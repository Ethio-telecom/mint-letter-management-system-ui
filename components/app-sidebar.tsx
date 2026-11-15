"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LayoutDashboard, Mail, StickyNote, Users, type LucideIcon } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useI18n, type TranslationKey } from "@/lib/i18n";

type NavItem = { title: TranslationKey; href: string; icon: LucideIcon; badge?: string };

const groups: { label: TranslationKey; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Correspondence",
    items: [
      { title: "Letters", href: "/letters", icon: Mail, badge: "5" },
      { title: "Memos", href: "/memos", icon: StickyNote },
    ],
  },
  {
    label: "Administration",
    items: [
      { title: "Organizations", href: "/organizations", icon: Building2 },
      { title: "Users", href: "/users", icon: Users },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { t } = useI18n();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/dashboard" />}>
              <BrandLogo size={32} />
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate text-sm font-semibold">{t("Letter Management")}</span>
                <span className="truncate text-xs text-muted-foreground">MInT · ኢ.ቴ.ሚ</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label} className={group.label === "Administration" ? "mt-auto" : undefined}>
            <SidebarGroupLabel>{t(group.label)}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        isActive={active}
                        tooltip={t(item.title)}
                        render={<Link href={item.href} />}
                        className="data-active:bg-primary data-active:text-primary-foreground data-active:hover:bg-primary/90 data-active:hover:text-primary-foreground"
                      >
                        <item.icon />
                        <span>{t(item.title)}</span>
                      </SidebarMenuButton>
                      {item.badge ? (
                        <SidebarMenuBadge className="peer-data-active/menu-button:text-primary-foreground">
                          {item.badge}
                        </SidebarMenuBadge>
                      ) : null}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
