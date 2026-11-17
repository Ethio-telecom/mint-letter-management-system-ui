"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDownLeft, ArrowRight, ArrowUp, ArrowUpRight, Building2, FileText, HardDrive, Repeat2, StickyNote, Users, type LucideIcon } from "lucide-react";
import { LetterVolumeChart, StatusChart } from "@/components/dashboard/charts";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Letter, LetterType, TenantData } from "@/lib/data";
import { useTenantData } from "@/lib/use-tenant-data";
import { useI18n, type TranslationKey } from "@/lib/i18n";

const buildStats = (dashboardStats: TenantData["dashboardStats"]): { label: TranslationKey; icon: LucideIcon; value: string; change: string | null; previous: string; href?: string; tone: string }[] => [
  { label: "Organizations", icon: Building2, href: "/organizations", tone: "bg-primary/10 text-primary", ...dashboardStats.organizations },
  { label: "Users", icon: Users, href: "/users", tone: "bg-sky-500/12 text-sky-700 dark:text-sky-300", ...dashboardStats.users },
  { label: "Letters", icon: FileText, href: "/letters", tone: "bg-amber-500/15 text-amber-700 dark:text-amber-300", ...dashboardStats.letters },
  { label: "Storage usage", icon: HardDrive, tone: "bg-violet-500/12 text-violet-700 dark:text-violet-300", ...dashboardStats.storage },
];

const typeIcons: Record<LetterType, LucideIcon> = {
  Incoming: ArrowDownLeft,
  Outgoing: ArrowUpRight,
  Internal: Repeat2,
  Memo: StickyNote,
};

/** Where a dashboard figure drills down to: memos have their own page, everything else is a letter. */
const typeHref = (type: LetterType) => (type === "Memo" ? "/memos" : `/letters?type=${type}`);
const letterHref = (letter: Letter) =>
  `${letter.type === "Memo" ? "/memos" : "/letters"}?q=${encodeURIComponent(letter.reference)}`;

const drillCard =
  "relative transition-shadow hover:ring-primary/50 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-primary";

export function DashboardView() {
  const router = useRouter();
  const { t, tv, locale } = useI18n();
  const { dashboardStats, letters, organizations, typeBreakdown } = useTenantData();
  const stats = buildStats(dashboardStats);
  const topOrganizations = [...organizations].sort((a, b) => b.letters - a.letters).slice(0, 6);
  const recentLetters = letters.slice(0, 6);

  return (
    <>
      <PageHeader title={t("Dashboard")} description={t("Monitor letter activity, organizations and users across the platform.")} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className={stat.href ? drillCard : undefined}>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                {stat.href ? (
                  <Link href={stat.href} className="text-sm text-muted-foreground outline-none after:absolute after:inset-0">
                    {t(stat.label)}
                  </Link>
                ) : (
                  <span className="text-sm text-muted-foreground">{t(stat.label)}</span>
                )}
                <span className={`flex size-9 items-center justify-center rounded-lg ${stat.tone}`}>
                  <stat.icon className="size-4.5" />
                </span>
              </div>
              <p className="text-3xl font-semibold tracking-tight tabular-nums">{stat.value}</p>
              <div className="flex items-center gap-2 text-xs">
                {stat.change ? (
                  <span className="flex items-center gap-0.5 font-medium text-success">
                    <ArrowUp className="size-3.5" />
                    {stat.change}
                  </span>
                ) : (
                  <span className="flex items-center gap-0.5 font-medium text-muted-foreground">
                    <ArrowRight className="size-3.5" />
                    {t("Stable")}
                  </span>
                )}
                <span className="text-muted-foreground">{t("Last month: {value}", { value: stat.previous })}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("Letters by type")}</CardTitle>
          <CardDescription>{t("Select a type to open its list.")}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {typeBreakdown.map(({ type, count }) => {
            const Icon = typeIcons[type];
            return (
              <Link
                key={type}
                href={typeHref(type)}
                className="group flex items-center gap-3 rounded-lg border p-3 outline-none transition-colors hover:border-primary/50 hover:bg-accent/50 focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-muted-foreground">{tv(type)}</span>
                  <span className="block text-xl font-semibold tabular-nums">{count.toLocaleString("en-US")}</span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>{t("Letter volume")}</CardTitle>
            <CardDescription>
              {t("Incoming and outgoing letters over the last 12 months")} · {t("Select a series to open its list.")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LetterVolumeChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("Status distribution")}</CardTitle>
            <CardDescription>
              {t("All letters by current status")} · {t("Select a bar to open its list.")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StatusChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>{t("Recent letters")}</CardTitle>
            <CardDescription>{t("Latest correspondence registered in the system")}</CardDescription>
            <CardAction>
              <Link href="/letters" className={buttonVariants({ variant: "outline", size: "sm" })}>
                {t("View all")} <ArrowRight />
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Reference")}</TableHead>
                  <TableHead>{t("Subject")}</TableHead>
                  <TableHead className="hidden md:table-cell">{t("From")}</TableHead>
                  <TableHead>{t("Status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLetters.map((letter) => (
                  <TableRow key={letter.id} className="cursor-pointer" onClick={() => router.push(letterHref(letter))}>
                    <TableCell className="font-mono text-xs">
                      <Link
                        href={letterHref(letter)}
                        onClick={(e) => e.stopPropagation()}
                        className="text-primary underline-offset-4 outline-none hover:underline focus-visible:underline"
                      >
                        {letter.reference}
                      </Link>
                    </TableCell>
                    <TableCell className="max-w-64 truncate font-medium">{letter.subject}</TableCell>
                    <TableCell className="hidden max-w-48 truncate text-muted-foreground md:table-cell">{letter.sender}</TableCell>
                    <TableCell>
                      <StatusBadge value={letter.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("Top organizations")}</CardTitle>
            <CardDescription>{t("Ranked by letters handled")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-4">
              {topOrganizations.map((org) => (
                <li key={org.id} className="grid gap-1.5">
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="truncate font-medium">{locale === "am" ? org.nameAm : org.name}</span>
                    <span className="text-muted-foreground tabular-nums">{org.letters.toLocaleString("en-US")}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(org.letters / topOrganizations[0].letters) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
