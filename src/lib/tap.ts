/**
 * Where WhatsAppLink and CallLink report a tap, for lib/feedback.ts. Import-free and tiny
 * on purpose: the links are on every page, and lib/feedback.ts with the status store it
 * drives stays in the layout's code instead of joining each page's.
 */
export type Tap =
  | { kind: "whatsapp"; link: Element; href: string; source: string }
  | { kind: "call"; link: Element };

let listener: ((tap: Tap) => void) | null = null;

export function reportTap(tap: Tap): void {
  listener?.(tap);
}

/** One listener, set by lib/feedback.ts while it is installed. */
export function onTap(next: ((tap: Tap) => void) | null): void {
  listener = next;
}
