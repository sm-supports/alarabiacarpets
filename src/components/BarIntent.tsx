"use client";

import { useEffect } from "react";
import { clearBarIntent, setBarIntent, type BarIntent as Intent } from "@/lib/bar-intent";

/**
 * Tells the action bar what this page is about, so its WhatsApp prefill names it.
 * Renders nothing. Its props go into the page's hydration data, which is why it takes
 * three short strings and never a whole product, service or category record.
 */
export default function BarIntent({ name, type, slug }: Intent) {
  useEffect(() => {
    const intent = { name, type, slug };
    setBarIntent(intent);
    return () => clearBarIntent(intent);
  }, [name, type, slug]);
  return null;
}
