function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const COPY = {
  en: {
    lang: "en",
    dir: "ltr",
    title: "Thank You for Contacting Al Arabia Carpets",
    brand: "Al Arabia Carpets",
    greeting: "Thank You,",
    received:
      "We&rsquo;ve received your message and truly appreciate you reaching out. Our team will review your inquiry and get back to you as soon as possible &mdash; typically within 24 hours.",
    meantime: "In the meantime, feel free to reach out through any of the channels below.",
    ref: "Your reference",
    reach: "Reach Us Directly",
    whatsapp: "WhatsApp",
    email: "Email",
    visit: "Visit: Al Mansoura St, Doha, Qatar",
    rights: "Al Arabia Carpets. All rights reserved.",
    tagline: "Premium Carpets &amp; Home Furnishings in Qatar",
  },
  ar: {
    lang: "ar",
    dir: "rtl",
    title: "شكرًا لتواصلك مع سجاد العربية",
    brand: "سجاد العربية",
    greeting: "شكرًا لك،",
    received:
      "وصلتنا رسالتك ونقدّر تواصلك معنا. سيراجع فريقنا طلبك ويرد عليك في أقرب وقت، وعادةً خلال 24 ساعة.",
    meantime: "وفي الأثناء، تقدر تتواصل معنا عبر أي من القنوات التالية.",
    ref: "المرجع",
    reach: "تواصل معنا مباشرة",
    whatsapp: "واتساب",
    email: "البريد الإلكتروني",
    visit: "زرنا: شارع المنصورة، الدوحة، قطر",
    rights: "سجاد العربية. جميع الحقوق محفوظة.",
    tagline: "سجاد فاخر ومفروشات منزلية في قطر",
  },
};

// The submitted message is deliberately NOT echoed back: this email goes to
// whatever address the sender typed, so repeating their text would let anyone
// send content of their choice from our domain.
// `ref` is the reference the form's Sent panel shows, so the visitor can quote it on
// WhatsApp. Left out when the form sent no submission id.
export function generateAcknowledgmentEmail(name: string, locale: "en" | "ar" = "en", ref?: string): string {
  const c = COPY[locale];
  const year = new Date().getFullYear();
  const safeName = name ?? "";
  const escapedName = escapeHtml(safeName);

  return `<!DOCTYPE html>
<html lang="${c.lang}" dir="${c.dir}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${c.title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin:0; padding:0; background-color:#F5F5F7; font-family:'Poppins', Arial, Helvetica, sans-serif; -webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F5F5F7;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%; border-collapse:collapse;">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#0A2A1F; padding:36px 40px 32px 40px; border-radius:16px 16px 0 0;">
              <img
                src="https://alarabiacarpets.com/lovable-uploads/tran-golden-logo.webp"
                alt="${c.brand}"
                width="56"
                height="56"
                style="display:block; margin:0 auto 14px auto; border:0; outline:none;"
              />
              <p style="font-family:'Playfair Display', Georgia, 'Times New Roman', serif; font-size:22px; font-weight:600; color:#C5A572; margin:0; letter-spacing:0.02em;">
                ${c.brand}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#FFFFFF; padding:40px 40px 36px 40px;">
              <!-- Gold accent bar -->
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="width:48px; height:3px; background-color:#C5A572; border-radius:2px;"></td>
                </tr>
              </table>

              <!-- Greeting -->
              <h1 style="font-family:'Playfair Display', Georgia, 'Times New Roman', serif; font-size:26px; font-weight:700; color:#0A2A1F; margin:24px 0 16px 0; line-height:1.3;">
                ${c.greeting} ${escapedName}
              </h1>

              <p style="font-family:'Poppins', Arial, Helvetica, sans-serif; font-size:15px; line-height:1.7; color:#444444; margin:0 0 24px 0;">
                ${c.received}
              </p>

              <p style="font-family:'Poppins', Arial, Helvetica, sans-serif; font-size:15px; line-height:1.7; color:#444444; margin:0;">
                ${c.meantime}
              </p>
${ref ? `
              <p style="font-family:'Poppins', Arial, Helvetica, sans-serif; font-size:14px; line-height:1.7; color:#444444; margin:24px 0 0 0;">
                ${c.ref}: <strong dir="ltr" style="color:#0A2A1F;">${escapeHtml(ref)}</strong>
              </p>` : ""}
            </td>
          </tr>

          <!-- Contact Info Section -->
          <tr>
            <td style="background-color:#4D7C6F; padding:28px 40px;">
              <p style="font-family:'Playfair Display', Georgia, 'Times New Roman', serif; font-size:17px; font-weight:600; color:#FFFFFF; margin:0 0 18px 0;">
                ${c.reach}
              </p>
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding:7px 0;">
                    <a href="https://wa.me/97455512858" target="_blank" rel="noopener noreferrer" style="font-family:'Poppins', Arial, Helvetica, sans-serif; font-size:14px; color:#E8D5B5; text-decoration:none;">
                      &#9742;&ensp;${c.whatsapp}: <span dir="ltr">+974 5551 2858</span>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:7px 0;">
                    <a href="mailto:info@alarabiacarpets.com" style="font-family:'Poppins', Arial, Helvetica, sans-serif; font-size:14px; color:#E8D5B5; text-decoration:none;">
                      &#9993;&ensp;${c.email}: <span dir="ltr">info@alarabiacarpets.com</span>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:7px 0;">
                    <span style="font-family:'Poppins', Arial, Helvetica, sans-serif; font-size:14px; color:#E8D5B5;">
                      &#9872;&ensp;${c.visit}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color:#0A2A1F; padding:24px 40px; border-radius:0 0 16px 16px;">
              <p style="font-family:'Poppins', Arial, Helvetica, sans-serif; font-size:12px; color:#86868B; margin:0 0 4px 0;">
                &copy; ${year} ${c.rights}
              </p>
              <p style="font-family:'Poppins', Arial, Helvetica, sans-serif; font-size:11px; color:#5A5A5F; margin:0;">
                ${c.tagline}
              </p>
            </td>
          </tr>

        </table>
        <!-- End Main Container -->

      </td>
    </tr>
  </table>
</body>
</html>`;
}
