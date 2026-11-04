"use client";

import WhatsAppLink from "@/components/WhatsAppLink";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { useI18n } from "@/i18n/LocaleProvider";

/**
 * Fixed WhatsApp CTA, always visible.
 *
 * Sits on the left so it doesn't collide with the Tawk.to chat launcher, which
 * anchors itself bottom-right. Physical left in Arabic too: Tawk does not mirror.
 */
export default function WhatsAppFloat() {
  const { t } = useI18n();
  return (
    <WhatsAppLink
      source="floating_button"
      message={t.common.floatMessage}
      aria-label={t.common.floatLabel}
      className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg transition-all duration-300 hover:bg-[#1ebe5b] hover:shadow-xl active:scale-95 sm:px-5"
    >
      <WhatsAppIcon className="h-6 w-6 flex-shrink-0" />
      <span className="hidden text-sm font-semibold sm:inline">{t.contactSection.whatsapp}</span>
    </WhatsAppLink>
  );
}
