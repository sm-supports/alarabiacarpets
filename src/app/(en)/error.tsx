"use client";

import PageError from "@/components/PageError";

/** Catches a page that throws under this root layout. (ar)/error.tsx does the same there. */
export default function Error() {
  return <PageError />;
}
