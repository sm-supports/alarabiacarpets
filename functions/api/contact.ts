import { Resend } from "resend";

interface Env {
  RESEND_API_KEY: string;
}

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, { status: 204, headers });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { name, email, message } = await context.request.json() as {
      name?: string;
      email?: string;
      message?: string;
    };

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Name, email, and message are required" }),
        { status: 400, headers }
      );
    }

    const resend = new Resend(context.env.RESEND_API_KEY);

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
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
