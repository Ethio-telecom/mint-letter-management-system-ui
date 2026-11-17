"use client";

import { useSyncExternalStore } from "react";
import { getTenantData, type Letter } from "@/lib/data";
import { useTenant, type TenantId } from "@/lib/tenant";

// In-memory letter store shared by the list and detail pages, so a letter created or archived
// on one page shows up on the other. Each tenant has its own list. It resets on a full page
// reload; replace it with API calls when the backend is wired up.
const state = new Map<TenantId, Letter[]>();
const listeners = new Set<() => void>();

const read = (tenant: TenantId) => state.get(tenant) ?? getTenantData(tenant).letters;

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function set(tenant: TenantId, next: Letter[]) {
  state.set(tenant, next);
  listeners.forEach((listener) => listener());
}

export const letterStore = {
  add: (tenant: TenantId, letter: Letter) => set(tenant, [letter, ...read(tenant)]),
  update: (tenant: TenantId, id: string, patch: Partial<Letter>) =>
    set(tenant, read(tenant).map((l) => (l.id === id ? { ...l, ...patch } : l))),
};

export function useLetters() {
  const { tenant } = useTenant();
  return useSyncExternalStore(subscribe, () => read(tenant.id), () => getTenantData(tenant.id).letters);
}

/** Memos live under /memos, every other letter type under /letters. */
export const letterHref = (letter: Pick<Letter, "id" | "type">) =>
  `${letter.type === "Memo" ? "/memos" : "/letters"}/${letter.id}`;
