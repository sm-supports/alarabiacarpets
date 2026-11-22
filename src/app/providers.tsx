"use client";

import ImageFallback from "@/components/ImageFallback";
import NavProgress from "@/components/NavProgress";
import RegisterSW from "@/components/RegisterSW";
import StatusRegion from "@/components/StatusRegion";
import TapFeedback from "@/components/TapFeedback";

/**
 * Client-side context providers, lifted out of the old src/App.tsx.
 *
 * QueryClientProvider is intentionally not carried over -- the app never called
 * useQuery, so react-query was pure overhead.
 *
 * The site-wide feedback mounts here: the status panel, what it says after a WhatsApp or
 * Call tap, the progress line, and the tile in place of a photo that failed. None of them
 * renders anything in the static HTML. RegisterSW adds or removes the service worker.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <StatusRegion />
      <TapFeedback />
      <NavProgress />
      <ImageFallback />
      <RegisterSW />
    </>
  );
}
