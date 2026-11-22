/**
 * The heading of a fold (.fold-h in index.css): below md it is also the toggle for the
 * element after it, which carries the class fold-body; from md it is only the heading.
 *
 * The heading stays outside the <summary>, so screen readers list it as a heading at
 * every width: a summary is a button, and a heading inside one is read as part of the
 * button's name. The summary is empty, named by the heading, and laid over it below md.
 *
 * With `always`, the fold is a toggle at every width, not only below md (.fold-all): the
 * /contact panels, which stay closed on desktop so that page fits one screen.
 */
export default function FoldHead({
  id,
  as: Heading,
  className,
  wrapClassName,
  always = false,
  children,
}: {
  /** Unique on the page: the summary is named by it. */
  id: string;
  as: "h2" | "h3";
  className: string;
  wrapClassName?: string;
  always?: boolean;
  children: React.ReactNode;
}) {
  const wrap = ["fold-h", always && "fold-all", wrapClassName].filter(Boolean).join(" ");
  return (
    <div className={wrap}>
      <Heading id={id} className={className}>
        {children}
      </Heading>
      <details className="fold">
        <summary aria-labelledby={id} />
      </details>
    </div>
  );
}
