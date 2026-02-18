import { Resend } from "resend";
import { generateAcknowledgmentEmail } from "../email-templates/acknowledgment";

interface Env {
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
}

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

async function verifyTurnstileToken(
  token: string,
  secretKey: string,
  ip: string | null
): Promise<boolean> {
  const formData = new URLSearchParams();
  formData.append("secret", secretKey);
  formData.append("response", token);
  if (ip) {
    formData.append("remoteip", ip);
  }

  const result = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    }
  );

  const outcome = (await result.json()) as {
    success: boolean;
    "error-codes"?: string[];
  };
  return outcome.success;
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
    const isHuman = await verifyTurnstileToken(
      turnstileToken,
      context.env.TURNSTILE_SECRET_KEY,
      clientIp
    );

    if (!isHuman) {
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
