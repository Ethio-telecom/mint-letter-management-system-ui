"use client";

import { getTenantData } from "@/lib/data";
import { useTenant } from "@/lib/tenant";

/** Seed data for the organization currently selected in the switcher. */
export function useTenantData() {
  const { tenant } = useTenant();
  return getTenantData(tenant.id);
}
