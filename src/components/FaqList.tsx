/**
 * FAQ list. Native <details> rather than a JS accordion: the answers stay in the
 * DOM for crawlers and AI Overview extraction with zero JS.
 */
export default function FaqList({ faqs }: { faqs: Array<{ q: string; a: string }> }) {
  return (
    <div className="divide-y divide-neutral-200 border-y border-neutral-200">
      {faqs.map((faq) => (
        <details key={faq.q} className="group py-4">
          <summary className="faq-q">
            <h3 className="text-base">{faq.q}</h3>
            <span className="faq-toggle">
              +
            </span>
          </summary>
          <p className="faq-a">
            {faq.a}
          </p>
        </details>
      ))}
    </div>
  );
}
