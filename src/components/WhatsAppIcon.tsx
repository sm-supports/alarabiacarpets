import { ICON_SPRITE } from "@/lib/icon-sprite";

/**
 * The WhatsApp logo, from a shared sprite. Its path is over a kilobyte and several
 * buttons on every page use it, so it isn't repeated inline. The sprite's symbol carries
 * the viewBox, so this doesn't repeat it either; give it a size (a class, or a parent such
 * as .cta that sizes its icons).
 */
export default function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" aria-hidden="true">
      <use href={`${ICON_SPRITE}#whatsapp`} />
    </svg>
  );
}
