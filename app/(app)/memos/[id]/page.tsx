import type { Metadata } from "next";
import { Suspense } from "react";
import { LetterDetailView } from "@/components/letters/letter-detail-view";
import { letters } from "@/lib/data";

export const metadata: Metadata = { title: "Memo details" };

// Prerender the known sample memos; any other id falls back to the "not found" state.
export function generateStaticParams() {
  return letters.filter((l) => l.type === "Memo").map((l) => ({ id: l.id }));
}

async function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LetterDetailView id={id} kind="memos" />;
}

export default function MemoDetailPage({ params }: PageProps<"/memos/[id]">) {
  return (
    <Suspense>
      <Detail params={params} />
    </Suspense>
  );
}
