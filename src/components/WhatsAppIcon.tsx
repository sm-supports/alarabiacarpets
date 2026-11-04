/**
 * The WhatsApp logo, from a shared sprite. Its path is over a kilobyte and several
 * buttons on every page use it, so it isn't repeated inline.
 */
export default function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <use href="/icons.svg#whatsapp" />
    </svg>
  );
}
