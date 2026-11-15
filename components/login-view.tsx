"use client";

import { FileCheck2, Route, ShieldCheck, type LucideIcon } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LoginForm } from "@/components/login-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { useI18n, type TranslationKey } from "@/lib/i18n";

const highlights: { icon: LucideIcon; title: TranslationKey; text: TranslationKey }[] = [
  { icon: FileCheck2, title: "Register every letter", text: "Incoming, outgoing, internal letters and memos in one registry." },
  { icon: Route, title: "Track the route", text: "See who holds a letter and what is pending at each office." },
  { icon: ShieldCheck, title: "Verified and auditable", text: "Role-based access with a full audit trail per organization." },
];

export function LoginView() {
  const { t, locale } = useI18n();
  return (
    <div className="grid min-h-svh flex-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="relative hidden overflow-hidden bg-[#185969] text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
        <svg aria-hidden className="absolute inset-0 size-full opacity-[0.09]">
          <defs>
            <pattern id="hex" width="56" height="97" patternUnits="userSpaceOnUse" patternTransform="scale(0.9)">
              <path d="M28 0 56 16v32L28 64 0 48V16Zm0 97L0 81V64m56 0v17L28 97" fill="none" stroke="white" strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex)" />
        </svg>
        <div aria-hidden className="absolute -right-40 -bottom-40 size-[28rem] rounded-full border-[3rem] border-[#e89e4a]/25" />
        <div aria-hidden className="absolute -top-24 -left-24 size-72 rounded-full bg-white/5" />

        <div className="relative flex items-center gap-3">
          <BrandLogo size={52} />
          <div className="leading-tight">
            <p className="font-semibold">{t("Ministry of Innovation and Technology")}</p>
            <p className="text-sm text-white/70">{locale === "am" ? "Ministry of Innovation and Technology" : "የኢኖቬሽን እና ቴክኖሎጂ ሚኒስቴር"}</p>
          </div>
        </div>

        <div className="relative max-w-md">
          <span className="mb-5 block h-1 w-12 rounded-full bg-[#e89e4a]" />
          <h1 className="text-4xl leading-tight font-semibold tracking-tight text-balance">
            {t("Letter Management System")}
          </h1>
          <p className="mt-4 text-white/75">
            {t("Send, receive and track official correspondence across government organizations.")}
          </p>
          <ul className="mt-10 grid gap-5">
            {highlights.map((item) => (
              <li key={item.title} className="flex gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <item.icon className="size-4.5" />
                </span>
                <div>
                  <p className="text-sm font-medium">{t(item.title)}</p>
                  <p className="text-sm text-white/65">{t(item.text)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/55">{t("© 2026 Ministry of Innovation and Technology. All rights reserved.")}</p>
      </aside>

      <main className="relative flex flex-col items-center justify-center bg-card px-6 py-12">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <BrandLogo size={44} />
            <p className="text-sm leading-tight font-semibold">
              {t("Ministry of Innovation and Technology")}
            </p>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">{t("Welcome back")}</h2>
          <p className="mt-1.5 mb-8 text-sm text-muted-foreground">
            {t("Sign in with your government account to continue.")}
          </p>
          <LoginForm />
          <p className="mt-8 text-center text-sm text-muted-foreground">
            {t("Trouble signing in?")}{" "}
            <a href="mailto:contact@mint.gov.et" className="font-medium text-primary underline-offset-4 hover:underline">
              {t("Contact IT support")}
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
