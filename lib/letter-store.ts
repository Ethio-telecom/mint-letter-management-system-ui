"use client";

import { useSyncExternalStore } from "react";
import { letters as seedLetters, type Letter } from "@/lib/data";

// In-memory letter store shared by the list and detail pages, so a letter created or archived
// on one page shows up on the other. It resets on a full page reload; replace it with API calls
// when the backend is wired up.
let state: Letter[] = seedLetters;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function set(next: Letter[]) {
  state = next;
  listeners.forEach((listener) => listener());
}

export const letterStore = {
  add: (letter: Letter) => set([letter, ...state]),
  update: (id: string, patch: Partial<Letter>) => set(state.map((l) => (l.id === id ? { ...l, ...patch } : l))),
};

export function useLetters() {
  return useSyncExternalStore(subscribe, () => state, () => seedLetters);
}

/** Memos live under /memos, every other letter type under /letters. */
export const letterHref = (letter: Pick<Letter, "id" | "type">) =>
  `${letter.type === "Memo" ? "/memos" : "/letters"}/${letter.id}`;
