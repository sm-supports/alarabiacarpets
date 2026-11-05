import { Resend, type CreateEmailOptions, type CreateEmailRequestOptions } from "resend";
import { generateAcknowledgmentEmail } from "../email-templates/acknowledgment";

interface Env {
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
  /**
   * Comma-separated frontend hostnames allowed to submit this form, compared
   * against the `hostname` siteverify returns. Optional: when unset, falls back
   * to PRODUCTION_HOSTNAMES. Set it in .dev.vars for local work
   * (`localhost,127.0.0.1`); never add those to the production value.
   */
  TURNSTILE_HOSTNAMES?: string;
}

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// Must match the `action` the widget is rendered with in ContactSection.tsx.
const TURNSTILE_ACTION = "contact";

// Frontend hostnames this Function accepts tokens from when TURNSTILE_HOSTNAMES
// is not configured. A leading "*." entry matches any subdomain (Pages preview
// deployments live at <hash>.alarabiacarpets.pages.dev).
const PRODUCTION_HOSTNAMES = [
  "alarabiacarpets.com",
  "www.alarabiacarpets.com",
  "alarabiacarpets.pages.dev",
  "*.alarabiacarpets.pages.dev",
];

interface CFContext {
  request: Request;
  env: Env;
  /** Keeps the Function alive for work that finishes after the response is sent. */
  waitUntil(promise: Promise<unknown>): void;
}

// Resend usually answers in well under a second. Without a limit a stalled call
// would hold the visitor on "Sending..." until the platform killed the Function.
const RESEND_TIMEOUT_MS = 8_000;

// The form sends one id per message, and the same id again when the visitor retries
// the same text. Resend drops a second send with the same key, so a retry after a
// lost response doesn't email the team twice.
const SUBMISSION_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Length caps. Keep in sync with the maxLength attributes in ContactSection.tsx.
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;

// The form is same-origin, so CORS is only relevant to cross-origin callers.
// Preview deployments post to their own origin and are unaffected.
const headers: Record<string, string> = {
  "Access-Control-Allow-Origin": "https://alarabiacarpets.com",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, { status: 204, headers });
}

interface SiteverifyOutcome {
  success?: boolean;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
}

type TurnstileResult = { ok: true } | { ok: false; reason: string };

function expectedHostnames(env: Env): string[] {
  const configured = (env.TURNSTILE_HOSTNAMES ?? "")
    .split(",")
    .map((hostname) => hostname.trim().toLowerCase())
    .filter(Boolean);
  return configured.length > 0 ? configured : PRODUCTION_HOSTNAMES;
}

function hostnameAllowed(hostname: unknown, allowed: string[]): boolean {
  if (typeof hostname !== "string" || hostname.length === 0) {
    return false;
  }
  const actual = hostname.toLowerCase();
  return allowed.some((entry) =>
    entry.startsWith("*.")
      ? actual.endsWith(entry.slice(1)) && actual.length > entry.length - 1
      : entry === actual
  );
}

/**
 * Canonical server-side Turnstile check. Fails closed on any transport error,
 * non-2xx status, or malformed body, and requires `success`, the expected
 * `action`, and an approved frontend `hostname`.
 */
async function verifyTurnstileToken(
  token: unknown,
  env: Env,
  ip: string | null
): Promise<TurnstileResult> {
  if (typeof token !== "string" || token.length === 0 || token.length > 2048) {
    return { ok: false, reason: "invalid-token" };
  }
  if (!env.TURNSTILE_SECRET_KEY) {
    return { ok: false, reason: "secret-not-configured" };
  }
  const allowed = expectedHostnames(env);
  if (allowed.length === 0) {
    return { ok: false, reason: "no-hostnames-configured" };
  }

  const formData = new URLSearchParams();
  formData.append("secret", env.TURNSTILE_SECRET_KEY);
  formData.append("response", token);
  if (ip) {
    formData.append("remoteip", ip);
  }

  let outcome: SiteverifyOutcome;
  try {
    const result = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
      signal: AbortSignal.timeout(10_000),
    });
    if (!result.ok) {
      throw new Error(`siteverify responded ${result.status}`);
    }
    // result.json() is typed loosely and the cast is not a check: a body of
    // literal `null` would survive it and then throw on `outcome.success`
    // below -- outside this try, so it would escape as a 500 rather than the
    // documented fail-closed rejection. Validate the shape here instead.
    const parsed: unknown = await result.json();
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("siteverify returned a malformed body");
    }
    outcome = parsed as SiteverifyOutcome;
  } catch (err) {
    console.error("Turnstile siteverify request failed:", err);
    return { ok: false, reason: "siteverify-unavailable" };
  }

  if (outcome.success !== true) {
    // Same untrusted body as above: the shape guard only proved `outcome` is an
    // object, so this field can be any JSON value. `.join` on a non-array would
    // throw here -- outside the try -- and escape as a 500.
    const raw = outcome["error-codes"];
    const codes = Array.isArray(raw) ? raw : [];
    return { ok: false, reason: codes.length ? codes.join(",") : "not-successful" };
  }
  if (outcome.action !== TURNSTILE_ACTION) {
    return { ok: false, reason: "action-mismatch" };
  }
  if (!hostnameAllowed(outcome.hostname, allowed)) {
    return { ok: false, reason: "hostname-mismatch" };
  }
  return { ok: true };
}

/**
 * resend.emails.send with a time limit. The SDK spreads its options into fetch(),
 * so the signal cancels the request, but its types don't list `signal` -- hence the
 * cast, and the race as a second limit that doesn't depend on that SDK detail. Like
 * the SDK, this reports failure in `error` and never throws.
 */
async function sendEmail(
  resend: Resend,
  payload: CreateEmailOptions,
  idempotencyKey: string | undefined
): Promise<{ error: unknown }> {
  const options = {
    ...(idempotencyKey && { idempotencyKey }),
    signal: AbortSignal.timeout(RESEND_TIMEOUT_MS),
  } as CreateEmailRequestOptions;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const limit = new Promise<{ error: unknown }>((resolve) => {
    timer = setTimeout(() => resolve({ error: "timed out" }), RESEND_TIMEOUT_MS + 500);
  });
  try {
    return await Promise.race([resend.emails.send(payload, options), limit]);
  } catch (error) {
    return { error: error ?? "send failed" };
  } finally {
    clearTimeout(timer);
  }
}

export async function onRequestPost(context: CFContext): Promise<Response> {
  // One log line and a Server-Timing header per request, so a slow submission can be
  // traced to the step that was slow. No names, addresses or message text.
  const started = Date.now();
  const timing: { verify_ms?: number; email_ms?: number } = {};
  let locale: "en" | "ar" = "en";
  const respond = (status: number, body: Record<string, string>, outcome: string): Response => {
    const total_ms = Date.now() - started;
    console.log(JSON.stringify({ evt: "contact", outcome, status, ...timing, total_ms, locale }));
    const serverTiming = [
      timing.verify_ms !== undefined && `verify;dur=${timing.verify_ms}`,
      timing.email_ms !== undefined && `email;dur=${timing.email_ms}`,
      `total;dur=${total_ms}`,
    ].filter(Boolean).join(", ");
    return new Response(JSON.stringify(body), {
      status,
      headers: { ...headers, "Server-Timing": serverTiming },
    });
  };

  try {
    let body: unknown;
    try {
      body = await context.request.json();
    } catch {
      body = null;
    }
    if (body === null || typeof body !== "object" || Array.isArray(body)) {
      return respond(400, { error: "Invalid request body" }, "bad-body");
    }
    const { turnstileToken, ...fields } = body as Record<string, unknown>;

    // Untrusted, so only an exact match selects Arabic. Read first so the log line
    // for a rejected request carries the right language too.
    locale = fields.locale === "ar" ? "ar" : "en";

    // Verify Turnstile token
    if (!turnstileToken) {
      return respond(400, { error: "Bot verification required" }, "no-token");
    }

    const clientIp = context.request.headers.get("CF-Connecting-IP");
    const verifyStarted = Date.now();
    const verification = await verifyTurnstileToken(
      turnstileToken,
      context.env,
      clientIp
    );
    timing.verify_ms = Date.now() - verifyStarted;

    if (!verification.ok) {
      console.warn("Turnstile verification rejected:", verification.reason);
      return respond(403, { error: "Bot verification failed" }, "bot-check-failed");
    }

    // Validate required fields. The JSON body is untrusted, so check the types
    // rather than trusting a cast: a non-string would throw in escapeHtml.
    if (
      typeof fields.name !== "string" ||
      typeof fields.email !== "string" ||
      typeof fields.message !== "string"
    ) {
      return respond(400, { error: "Name, email, and message are required" }, "invalid");
    }

    // The name goes into the subject line, so collapse line breaks and other
    // control characters.
    const name = fields.name.replace(/[\u0000-\u001F\u007F]+/g, " ").trim();
    const email = fields.email.trim();
    const message = fields.message.trim();

    if (!name || !email || !message) {
      return respond(400, { error: "Name, email, and message are required" }, "invalid");
    }

    if (
      name.length > MAX_NAME_LENGTH ||
      email.length > MAX_EMAIL_LENGTH ||
      message.length > MAX_MESSAGE_LENGTH
    ) {
      return respond(400, { error: "One or more fields are too long" }, "invalid");
    }

    // Bare addresses only: no display-name syntax and no address lists, since
    // this value is used as `to` and `replyTo`.
    const emailRegex = /^[^\s@<>",;]+@[^\s@<>",;]+\.[^\s@<>",;]+$/;

    if (!emailRegex.test(email)) {
      return respond(400, { error: "Invalid email format" }, "invalid");
    }

    // Optional: a tab opened before this field existed doesn't send it.
    const submissionId =
      typeof fields.submissionId === "string" && SUBMISSION_ID.test(fields.submissionId)
        ? fields.submissionId.toLowerCase()
        : undefined;

    const resend = new Resend(context.env.RESEND_API_KEY);

    // Send admin notification (critical). Failures come back in `error`, not as a
    // throw, so it has to be checked explicitly.
    const emailStarted = Date.now();
    const { error: adminError } = await sendEmail(resend, {
      from: "Al Arabia Carpets <noreply@alarabiacarpets.com>",
      to: "info@alarabiacarpets.com",
      replyTo: email,
      subject: `New Contact Form Message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      `,
    }, submissionId && `contact-admin/${submissionId}`);
    timing.email_ms = Date.now() - emailStarted;

    if (adminError) {
      console.error("Admin notification failed:", adminError);
      return respond(502, { error: "Failed to send email" }, "admin-email-failed");
    }

    // Acknowledgment to the submitter (non-critical). The team already has the
    // message, so the visitor gets their answer now and this finishes afterwards.
    // Only after the admin email succeeded: never thank someone for a message that
    // didn't arrive.
    context.waitUntil(
      sendEmail(resend, {
        from: "Al Arabia Carpets <noreply@alarabiacarpets.com>",
        to: email,
        subject:
          locale === "ar"
            ? "شكرًا لتواصلك مع سجاد العربية"
            : "Thank you for contacting Al Arabia Carpets",
        html: generateAcknowledgmentEmail(name, locale),
      }, submissionId && `contact-ack/${submissionId}`).then(({ error: ackError }) => {
        if (ackError) console.error("Acknowledgment email failed:", ackError);
      })
    );

    return respond(200, { message: "Email sent successfully" }, "sent");
  } catch (error) {
    console.error("Email send error:", error);
    return respond(500, { error: "Failed to send email" }, "error");
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
