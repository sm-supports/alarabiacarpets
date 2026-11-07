"use client";

import Navbar from "@/components/Navbar";
import StatePanel from "@/components/StatePanel";
import { useI18n } from "@/i18n/LocaleProvider";
import { trackPhoneClick } from "@/lib/analytics";
import { hasStoredDraft } from "@/lib/draft";
import { PHONE_E164 } from "@/lib/site";

/**
 * What error.tsx shows when a page throws, usually a script that failed to download.
 * Reload rather than Next's reset(): reset re-renders with the same failed chunk.
 */
export default function PageError() {
  const { t } = useI18n();
  const s = t.statePanel;
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <StatePanel
          variant="page"
          headingAs="h1"
          focusHeadline
          headline={s.pageFailed}
          secondary={[{ label: s.call, href: `tel:${PHONE_E164}`, onClick: () => trackPhoneClick("page_error") }]}
          primary={{ label: s.reload, onClick: () => window.location.reload() }}
        >
          {hasStoredDraft() && <p>{s.draftSaved}</p>}
        </StatePanel>
      </main>
    </div>
  );
}
