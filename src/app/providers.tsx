"use client";

import dynamic from "next/dynamic";
import { useToast } from "@/hooks/use-toast";

// Only the contact form raises toasts, so Radix Toast stays out of the initial
// bundle and loads with the first one.
const Toaster = dynamic(() => import("@/components/ui/toaster").then((m) => m.Toaster), {
  ssr: false,
});

function LazyToaster() {
  const { toasts } = useToast();
  return toasts.length > 0 ? <Toaster /> : null;
}

/**
 * Client-side context providers, lifted out of the old src/App.tsx.
 *
 * QueryClientProvider is intentionally not carried over -- the app never called
 * useQuery, so react-query was pure overhead.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <LazyToaster />
    </>
  );
}
