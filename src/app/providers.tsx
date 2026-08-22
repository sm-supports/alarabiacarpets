"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import ImagePreloader from "@/components/ImagePreloader";

/**
 * Client-side context providers, lifted out of the old src/App.tsx.
 *
 * QueryClientProvider is intentionally not carried over -- the app never called
 * useQuery, so react-query was pure overhead.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      {children}
      <Toaster />
      <ImagePreloader />
    </TooltipProvider>
  );
}
