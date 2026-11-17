"use client";

import { createContext, Fragment, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import type { TranslationKey } from "@/lib/i18n";

export type TenantId = "mint" | "moe" | "mop";

export type Tenant = {
  id: TenantId;
  /** English full name — also the i18n key. */
  name: TranslationKey;
  /** Abbreviation, e.g. "MInT". */
  abbr: string;
  short: string;
  /** Email domain, e.g. for login placeholders and contact links. */
  domain: string;
  logo: string;
  /** Brand primary colour (light mode); dark-mode variants live in globals.css. */
  primary: string;
};

export const tenants: Tenant[] = [
  { id: "mint", name: "Ministry of Innovation and Technology", abbr: "MInT", short: "MInT · ኢ.ቴ.ሚ", domain: "mint.gov.et", logo: "/logo.png", primary: "#185969" },
  { id: "moe", name: "Ministry of Education", abbr: "MoE", short: "MoE · ት.ሚ", domain: "moe.gov.et", logo: "/tenants/moe.svg", primary: "#1d4f91" },
  { id: "mop", name: "Ministry of Peace", abbr: "MoP", short: "MoP · ሰ.ሚ", domain: "mop.gov.et", logo: "/tenants/mop.svg", primary: "#2f7d4a" },
];

const DEFAULT: TenantId = "mint";
const STORAGE_KEY = "tenant";
const EVENT = "tenant-change";

/** Runs before hydration (see app/layout.tsx) so the brand colour never flashes. */
export const tenantInitScript = `try{var t=localStorage.getItem("${STORAGE_KEY}");document.documentElement.dataset.tenant=${JSON.stringify(
  tenants.map((t) => t.id),
)}.indexOf(t)>-1?t:"${DEFAULT}"}catch(e){}`;

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readTenant(): TenantId {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return tenants.some((t) => t.id === value) ? (value as TenantId) : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

type TenantContextValue = { tenant: Tenant; setTenant: (id: TenantId) => void };

const TenantContext = createContext<TenantContextValue | null>(null);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const id = useSyncExternalStore(subscribe, readTenant, () => DEFAULT);

  useEffect(() => {
    document.documentElement.dataset.tenant = id;
  }, [id]);

  const setTenant = useCallback((next: TenantId) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const value = useMemo(() => ({ tenant: tenants.find((t) => t.id === id)!, setTenant }), [id, setTenant]);
  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) throw new Error("useTenant must be used inside <TenantProvider>");
  return context;
}

/** Re-mounts its children when the tenant changes, so page-local state re-seeds from the new tenant. */
export function TenantScope({ children }: { children: React.ReactNode }) {
  const { tenant } = useTenant();
  return <Fragment key={tenant.id}>{children}</Fragment>;
}
