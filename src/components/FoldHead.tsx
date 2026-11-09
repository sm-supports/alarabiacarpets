/**
 * The heading of a fold (.fold-h in index.css): below md it is also the toggle for the
 * element after it, which carries the class fold-body; from md it is only the heading.
 *
 * The heading stays outside the <summary>, so screen readers list it as a heading at
 * every width: a summary is a button, and a heading inside one is read as part of the
 * button's name. The summary is empty, named by the heading, and laid over it below md.
 */
export default function FoldHead({
  id,
  as: Heading,
  className,
  wrapClassName,
  children,
}: {
  /** Unique on the page: the summary is named by it. */
  id: string;
  as: "h2" | "h3";
  className: string;
  wrapClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={wrapClassName ? `fold-h ${wrapClassName}` : "fold-h"}>
      <Heading id={id} className={className}>
        {children}
      </Heading>
      <details className="fold">
        <summary aria-labelledby={id} />
      </details>
    </div>
  );
}
