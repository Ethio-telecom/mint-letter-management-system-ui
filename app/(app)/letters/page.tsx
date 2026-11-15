import type { Metadata } from "next";
import { LettersView } from "@/components/letters/letters-view";

export const metadata: Metadata = { title: "Letters" };

export default function LettersPage() {
  return <LettersView />;
}
