"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import StatePanel from "@/components/StatePanel";
import { useI18n } from "@/i18n/LocaleProvider";
import { clearStatus, useStatus } from "@/lib/status";

/**
 * Shows the current status from lib/status.ts. The two live regions are always in the
 * page because one that is inserted already holding its text is often not announced.
 *
 * When focus moves to the headline the screen reader reads it from there, so the live
 * region carries only the facts.
 */
export default function StatusRegion() {
  const status = useStatus();
  const pathname = usePathname();
  const { t } = useI18n();

  // A status is about the page it was raised on.
  useEffect(() => {
    clearStatus();
  }, [pathname]);

  const spoken = status && (status.focus ? status.facts : <>{status.headline} {status.facts}</>);

  return (
    <>
      <div role="status" className="sr-only">{status?.urgent ? null : spoken}</div>
      <div role="alert" className="sr-only">{status?.urgent ? spoken : null}</div>
      {status && (
        <StatePanel
          key={status.id}
          variant="overlay"
          badge={status.badge}
          tone={status.tone}
          headline={status.headline}
          focusHeadline={status.focus}
          secondary={status.secondary}
          primary={status.primary}
          onClose={() => clearStatus(status.id)}
          closeLabel={t.statePanel.close}
        >
          {status.facts}
        </StatePanel>
      )}
    </>
  );
}
