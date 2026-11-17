"use client";

import Link from "next/link";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { TruncatedText } from "@/components/truncated-text";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useI18n } from "@/lib/i18n";
import { tenants, useTenant } from "@/lib/tenant";

export function OrgSwitcher() {
  const { t } = useI18n();
  const { tenant, setTenant } = useTenant();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                tooltip={t("Switch organization")}
                className="hover:bg-sidebar-accent data-popup-open:bg-sidebar-accent"
              />
            }
          >
            <BrandLogo size={32} className="rounded-lg" />
            <TruncatedText className="flex-1 text-left text-sm font-semibold">{t(tenant.name)}</TruncatedText>
            <ChevronsUpDown className="ml-auto size-[15px]! text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="bottom" sideOffset={6} className="min-w-60 rounded-xl p-1.5">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-2 py-1.5 text-xs">{t("Organizations")}</DropdownMenuLabel>
              {tenants.map((item) => (
                <DropdownMenuItem key={item.id} onClick={() => setTenant(item.id)} className="gap-2.5 rounded-lg px-2 py-1.5">
                  <BrandLogo size={28} tenant={item} className="rounded-md" />
                  <TruncatedText className="flex-1 text-sm">{t(item.name)}</TruncatedText>
                  {item.id === tenant.id ? <Check className="size-4" /> : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-1.5" />
            <DropdownMenuItem render={<Link href="/organizations?new=1" />} className="items-start gap-2.5 rounded-lg px-2 py-1.5">
              <span className="flex size-7 shrink-0 items-center justify-center">
                <Plus className="size-4" />
              </span>
              <span className="grid min-w-0 leading-tight">
                <span className="text-sm">{t("New Organization")}</span>
                <span className="truncate text-xs text-muted-foreground">{t("Add new organization")}</span>
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
