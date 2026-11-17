"use client";

import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/lib/i18n";
import { tenants, useTenant, type TenantId } from "@/lib/tenant";

/** Compact organization picker for pages without the sidebar (e.g. login). */
export function OrgSelect() {
  const { t } = useI18n();
  const { tenant, setTenant } = useTenant();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" aria-label={t("Switch organization")} />}>
        <BrandLogo size={18} />
        <span className="hidden sm:inline">{tenant.abbr}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuRadioGroup value={tenant.id} onValueChange={(v) => setTenant(v as TenantId)}>
          {tenants.map((item) => (
            <DropdownMenuRadioItem key={item.id} value={item.id} className="gap-2">
              <BrandLogo size={20} tenant={item} />
              <span className="truncate">{t(item.name)}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
