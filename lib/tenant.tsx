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

/**
 * CSS variable overrides per tenant (light and dark). MInT uses the defaults in globals.css.
 * Rendered as an inline <style> by the root layout, so switching never depends on a CSS rebuild.
 */
const palettes: Partial<Record<TenantId, { light: Record<string, string>; dark: Record<string, string> }>> = {
  moe: {
    light: { "accent": "#e6eefa", "accent-foreground": "#163e73", "secondary": "#eaf0fa", "secondary-foreground": "#163e73", "sidebar-accent": "#e6eefa", "sidebar-accent-foreground": "#163e73", "primary": "#1d4f91", "ring": "#1d4f91", "chart-1": "#1d4f91", "sidebar-primary": "#1d4f91", "sidebar-ring": "#1d4f91" },
    dark: { "accent": "#1a2c47", "accent-foreground": "#d6e3f7", "secondary": "#182a42", "secondary-foreground": "#d6e3f7", "sidebar-accent": "#1a2c47", "sidebar-accent-foreground": "#e6eefa", "primary": "#6ea4ec", "primary-foreground": "#0a1d38", "ring": "#6ea4ec", "chart-1": "#6ea4ec", "sidebar-primary": "#6ea4ec", "sidebar-primary-foreground": "#0a1d38", "sidebar-ring": "#6ea4ec" },
  },
  mop: {
    light: { "accent": "#e5f2ea", "accent-foreground": "#22603a", "secondary": "#e9f4ed", "secondary-foreground": "#22603a", "sidebar-accent": "#e5f2ea", "sidebar-accent-foreground": "#22603a", "primary": "#2f7d4a", "ring": "#2f7d4a", "chart-1": "#2f7d4a", "sidebar-primary": "#2f7d4a", "sidebar-ring": "#2f7d4a" },
    dark: { "accent": "#1a3626", "accent-foreground": "#d4ecdc", "secondary": "#183323", "secondary-foreground": "#d4ecdc", "sidebar-accent": "#1a3626", "sidebar-accent-foreground": "#e5f2ea", "primary": "#6cc48a", "primary-foreground": "#0b2a16", "ring": "#6cc48a", "chart-1": "#6cc48a", "sidebar-primary": "#6cc48a", "sidebar-primary-foreground": "#0b2a16", "sidebar-ring": "#6cc48a" },
  },
};

const declarations = (vars: Record<string, string>) =>
  Object.entries(vars).map(([name, value]) => `--${name}:${value};`).join("");

export const tenantStyles = Object.entries(palettes)
  .map(([id, p]) => `html[data-tenant="${id}"]{${declarations(p!.light)}}html[data-tenant="${id}"].dark{${declarations(p!.dark)}}`)
  .join("");

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
