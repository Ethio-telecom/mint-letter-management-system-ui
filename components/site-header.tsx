"use client";

import { useRouter } from "next/navigation";
import { Bell, LogOut, Settings, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { useI18n } from "@/lib/i18n";

export function SiteHeader() {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-card/80 px-4 backdrop-blur">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 data-vertical:h-4 data-vertical:self-center" />
      <span className="truncate text-sm font-medium text-muted-foreground">
        {t("Ministry of Innovation and Technology")}
      </span>

      <div className="ml-auto flex items-center gap-2">
        <LanguageSwitcher />

        <ThemeToggle />

        <Button variant="outline" size="icon" aria-label={t("Notifications")} className="relative">
          <Bell />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-brand-accent ring-2 ring-card" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<button className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50" aria-label={t("Account menu")} />}
          >
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">AM</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">Abebe Mekonnen</span>
                <span className="font-normal">abebe.mekonnen@mint.gov.et</span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserRound /> {t("Profile")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings /> {t("Settings")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => router.push("/login")}>
              <LogOut /> {t("Log out")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
