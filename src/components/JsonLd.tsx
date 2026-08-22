/**
 * Emits a JSON-LD block. Server component -- the structured data lands in the
 * static HTML, which is the whole point (there is no Metadata API for JSON-LD).
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
