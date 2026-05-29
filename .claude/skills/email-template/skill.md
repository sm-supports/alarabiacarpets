# Create or Modify an Email Template

## Architecture

- Templates live in `functions/email-templates/`
- Each template is a TypeScript file exporting a function that returns an HTML string
- Templates are consumed by Workers functions in `functions/api/`
- Email sender is always `Al Arabia Carpets <noreply@alarabiacarpets.com>` via Resend

## Brand Styling

| Element | Value |
|---------|-------|
| Header background | `#0A2A1F` (Deep Forest) |
| Logo | `https://alarabiacarpets.com/lovable-uploads/tran-golden-logo.webp` (56x56) |
| Brand name color | `#C5A572` (Rich Gold) |
| Body background | `#F5F5F7` |
| Card background | `#FFFFFF` |
| Gold accent bar | `#C5A572`, 48px wide, 3px tall |
| Contact section bg | `#4D7C6F` (Sage Teal) |
| Footer background | `#0A2A1F` |
| Heading font | Playfair Display (via Google Fonts link) |
| Body font | Poppins (via Google Fonts link) |
| Link color (teal section) | `#E8D5B5` |
| Max width | 600px, centered |

## Template File Pattern

```typescript
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function generate<Name>Email(...params): string {
  // Escape all user-provided content
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Title</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin:0; padding:0; background-color:#F5F5F7; font-family:'Poppins', Arial, Helvetica, sans-serif;">
  <!-- Table-based layout for email client compatibility -->
</body>
</html>`;
}
```

## Standard Sections (in order)

1. **Header** — Dark background (`#0A2A1F`), logo image centered, brand name in gold Playfair Display
2. **Body** — White card, gold accent bar at top, heading in Playfair Display, body text in Poppins
3. **Contact info** — Teal background (`#4D7C6F`), WhatsApp (+974 5551 2858), email (info@alarabiacarpets.com), address (Al Mansoura St, Doha, Qatar), links in `#E8D5B5`
4. **Footer** — Dark background (`#0A2A1F`), copyright + tagline in small gray text

## Integration

Import the template in the relevant Workers function (`functions/api/*.ts`):
```typescript
import { generate<Name>Email } from "../email-templates/<name>";

await resend.emails.send({
  from: "Al Arabia Carpets <noreply@alarabiacarpets.com>",
  to: recipientEmail,
  subject: "Subject Line",
  html: generate<Name>Email(...params),
});
```

## Testing

```bash
npm run pages:dev
```
Submit the contact form (or trigger the relevant endpoint) to send a test email, then check the Resend dashboard for the email preview.

## Rules

- Use inline styles only — email clients do not support `<style>` blocks reliably
- Use table-based layout for cross-client compatibility
- Always include the `escapeHtml()` helper and escape all user-provided content
- Always include the Google Fonts `<link>` in `<head>`
- Max width 600px for the main container

## Canonical Example

Read `functions/email-templates/acknowledgment.ts` for the complete reference implementation.
