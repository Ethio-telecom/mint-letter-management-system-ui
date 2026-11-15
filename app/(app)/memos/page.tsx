import type { Metadata } from "next";
import { LettersView } from "@/components/letters/letters-view";

export const metadata: Metadata = { title: "Memos" };

export default function MemosPage() {
  return <LettersView kind="memos" />;
}
