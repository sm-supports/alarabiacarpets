function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function generateAcknowledgmentEmail(name: string, message: string): string {
  const year = new Date().getFullYear();
  const escapedName = escapeHtml(name);
  const escapedMessage = escapeHtml(message).replace(/\n/g, "<br>");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Thank You for Contacting Al Arabia Carpets</title>
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
                alt="Al Arabia Carpets"
                width="56"
                height="56"
                style="display:block; margin:0 auto 14px auto; border:0; outline:none;"
              />
              <p style="font-family:'Playfair Display', Georgia, 'Times New Roman', serif; font-size:22px; font-weight:600; color:#C5A572; margin:0; letter-spacing:0.02em;">
                Al Arabia Carpets
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
                Thank You, ${escapedName}
              </h1>

              <p style="font-family:'Poppins', Arial, Helvetica, sans-serif; font-size:15px; line-height:1.7; color:#444444; margin:0 0 24px 0;">
                We&rsquo;ve received your message and truly appreciate you reaching out. Our team will review your inquiry and get back to you as soon as possible &mdash; typically within 24 hours.
              </p>

              <!-- Echoed message -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px 0;">
                <tr>
                  <td style="border-left:3px solid #C5A572; background-color:#F8F7F4; padding:16px 20px; border-radius:0 8px 8px 0;">
                    <p style="font-family:'Poppins', Arial, Helvetica, sans-serif; font-size:11px; font-weight:600; color:#86868B; text-transform:uppercase; letter-spacing:0.08em; margin:0 0 10px 0;">
                      Your Message
                    </p>
                    <p style="font-family:'Poppins', Arial, Helvetica, sans-serif; font-size:14px; line-height:1.7; color:#333333; margin:0;">
                      ${escapedMessage}
                    </p>
                  </td>
                </tr>
              </table>

              <p style="font-family:'Poppins', Arial, Helvetica, sans-serif; font-size:15px; line-height:1.7; color:#444444; margin:0;">
                In the meantime, feel free to reach out through any of the channels below.
              </p>
            </td>
          </tr>

          <!-- Contact Info Section -->
          <tr>
            <td style="background-color:#4D7C6F; padding:28px 40px;">
              <p style="font-family:'Playfair Display', Georgia, 'Times New Roman', serif; font-size:17px; font-weight:600; color:#FFFFFF; margin:0 0 18px 0;">
                Reach Us Directly
              </p>
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding:7px 0;">
                    <a href="https://wa.me/+97455512858" target="_blank" rel="noopener noreferrer" style="font-family:'Poppins', Arial, Helvetica, sans-serif; font-size:14px; color:#E8D5B5; text-decoration:none;">
                      &#9742;&ensp;WhatsApp: +974 5551 2858
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:7px 0;">
                    <a href="mailto:info@alarabiacarpets.com" style="font-family:'Poppins', Arial, Helvetica, sans-serif; font-size:14px; color:#E8D5B5; text-decoration:none;">
                      &#9993;&ensp;Email: info@alarabiacarpets.com
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:7px 0;">
                    <span style="font-family:'Poppins', Arial, Helvetica, sans-serif; font-size:14px; color:#E8D5B5;">
                      &#9872;&ensp;Visit: Al Mansoura St, Doha, Qatar
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
                &copy; ${year} Al Arabia Carpets. All rights reserved.
              </p>
              <p style="font-family:'Poppins', Arial, Helvetica, sans-serif; font-size:11px; color:#5A5A5F; margin:0;">
                Premium Carpets &amp; Home Furnishings in Qatar
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
