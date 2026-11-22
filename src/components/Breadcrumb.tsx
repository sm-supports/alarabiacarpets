import Link from "next/link";
import { getDict, localePath, type Locale } from "@/i18n";

/** One step after Home: its label and its unprefixed path, as buildBreadcrumb takes them. */
export type Crumb = [label: string, path: string];

/**
 * The visible trail on every interior page: Home, then `trail`, the last step being the
 * page itself. Pass the same `trail` the page gives buildBreadcrumb (src/lib/seo.ts), so
 * what readers see and the BreadcrumbList agree step for step; this renders no JSON-LD of
 * its own. Server component, plain links. Styles are `.bc` in src/index.css: one line with
 * an ellipsis on phones, wrapping at md and up.
 *
 * `dark` is for the forest bands. Desktop stays as it was: `phoneOnly` keeps the trail off
 * it on the page types that had none there, and `currentPhoneOnly` hides the last step
 * there where the old trail stopped before the page itself (guides, whose h1 it repeats).
 */
export default function Breadcrumb({
  locale,
  trail,
  dark = false,
  phoneOnly = false,
  currentPhoneOnly = false,
  className,
}: {
  locale: Locale;
  trail: Crumb[];
  dark?: boolean;
  phoneOnly?: boolean;
  currentPhoneOnly?: boolean;
  className?: string;
}) {
  const t = getDict(locale);
  const steps: Crumb[] = [[t.common.home, "/"], ...trail];
  const classes = ["bc", dark && "bc-dark", phoneOnly && "md:hidden", currentPhoneOnly && "bc-cur-m", className]
    .filter(Boolean)
    .join(" ");
  return (
    <nav aria-label={t.common.breadcrumb} className={classes}>
      <ol>
        {steps.map(([label, path], index) =>
          index < steps.length - 1 ? (
            <li key={path}>
              <Link href={localePath(locale, path)}>{label}</Link>
            </li>
          ) : (
            <li key={path} aria-current="page">
              {label}
            </li>
          )
        )}
      </ol>
    </nav>
  );
}
