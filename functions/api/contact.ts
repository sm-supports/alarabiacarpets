import { Resend } from "resend";
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
}

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

export async function onRequestPost(context: CFContext): Promise<Response> {
  try {
    let body: unknown;
    try {
      body = await context.request.json();
    } catch {
      body = null;
    }
    if (body === null || typeof body !== "object" || Array.isArray(body)) {
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        { status: 400, headers }
      );
    }
    const { turnstileToken, ...fields } = body as Record<string, unknown>;

    // Verify Turnstile token
    if (!turnstileToken) {
      return new Response(
        JSON.stringify({ error: "Bot verification required" }),
        { status: 400, headers }
      );
    }

    const clientIp = context.request.headers.get("CF-Connecting-IP");
    const verification = await verifyTurnstileToken(
      turnstileToken,
      context.env,
      clientIp
    );

    if (!verification.ok) {
      console.warn("Turnstile verification rejected:", verification.reason);
      return new Response(
        JSON.stringify({ error: "Bot verification failed" }),
        { status: 403, headers }
      );
    }

    // Validate required fields. The JSON body is untrusted, so check the types
    // rather than trusting a cast: a non-string would throw in escapeHtml.
    if (
      typeof fields.name !== "string" ||
      typeof fields.email !== "string" ||
      typeof fields.message !== "string"
    ) {
      return new Response(
        JSON.stringify({ error: "Name, email, and message are required" }),
        { status: 400, headers }
      );
    }

    // The name goes into the subject line, so collapse line breaks and other
    // control characters.
    const name = fields.name.replace(/[\u0000-\u001F\u007F]+/g, " ").trim();
    const email = fields.email.trim();
    const message = fields.message.trim();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Name, email, and message are required" }),
        { status: 400, headers }
      );
    }

    if (
      name.length > MAX_NAME_LENGTH ||
      email.length > MAX_EMAIL_LENGTH ||
      message.length > MAX_MESSAGE_LENGTH
    ) {
      return new Response(
        JSON.stringify({ error: "One or more fields are too long" }),
        { status: 400, headers }
      );
    }

    // Bare addresses only: no display-name syntax and no address lists, since
    // this value is used as `to` and `replyTo`.
    const emailRegex = /^[^\s@<>",;]+@[^\s@<>",;]+\.[^\s@<>",;]+$/;

    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers }
      );
    }

    const resend = new Resend(context.env.RESEND_API_KEY);

    // Send admin notification (critical). The SDK reports API failures in
    // `error` instead of throwing, so it has to be checked explicitly.
    const { error: adminError } = await resend.emails.send({
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
    });

    if (adminError) {
      console.error("Admin notification failed:", adminError);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { status: 502, headers }
      );
    }

    // Send acknowledgment to submitter (non-critical)
    try {
      const { error: ackError } = await resend.emails.send({
        from: "Al Arabia Carpets <noreply@alarabiacarpets.com>",
        to: email,
        subject: "Thank you for contacting Al Arabia Carpets",
        html: generateAcknowledgmentEmail(name),
      });
      if (ackError) {
        console.error("Acknowledgment email failed:", ackError);
      }
    } catch (ackError) {
      console.error("Acknowledgment email failed:", ackError);
    }

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Email send error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send email" }),
      { status: 500, headers }
    );
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
