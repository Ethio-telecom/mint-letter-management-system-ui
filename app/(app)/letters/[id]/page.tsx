import type { Metadata } from "next";
import { Suspense } from "react";
import { LetterDetailView } from "@/components/letters/letter-detail-view";
import { allLetters } from "@/lib/data";

export const metadata: Metadata = { title: "Letter details" };

// Prerender the known sample letters; any other id falls back to the "not found" state.
export function generateStaticParams() {
  return allLetters.filter((l) => l.type !== "Memo").map((l) => ({ id: l.id }));
}

async function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LetterDetailView id={id} kind="letters" />;
}

export default function LetterDetailPage({ params }: PageProps<"/letters/[id]">) {
  return (
    <Suspense>
      <Detail params={params} />
    </Suspense>
  );
}
