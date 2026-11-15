import type { Metadata } from "next";
import { Suspense } from "react";
import { LettersView } from "@/components/letters/letters-view";

export const metadata: Metadata = { title: "Letters" };

export default function LettersPage() {
  // LettersView reads its initial filters from the URL, so it needs a Suspense boundary.
  return (
    <Suspense>
      <LettersView kind="letters" />
    </Suspense>
  );
}
