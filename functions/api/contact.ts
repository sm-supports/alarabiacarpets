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

const headers: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
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
    outcome = (await result.json()) as SiteverifyOutcome;
  } catch (err) {
    console.error("Turnstile siteverify request failed:", err);
    return { ok: false, reason: "siteverify-unavailable" };
  }

  if (outcome.success !== true) {
    const codes = outcome["error-codes"] ?? [];
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
    const { name, email, message, turnstileToken } =
      (await context.request.json()) as {
        name?: string;
        email?: string;
        message?: string;
        turnstileToken?: string;
      };

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

    // Validate required fields
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Name, email, and message are required" }),
        { status: 400, headers }
      );
    }

    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers }
      );
    }

    const resend = new Resend(context.env.RESEND_API_KEY);

    // Send admin notification (critical)
    await resend.emails.send({
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

    // Send acknowledgment to submitter (non-critical)
    try {
      await resend.emails.send({
        from: "Al Arabia Carpets <noreply@alarabiacarpets.com>",
        to: email,
        subject: "Thank you for contacting Al Arabia Carpets",
        html: generateAcknowledgmentEmail(name, message),
      });
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
