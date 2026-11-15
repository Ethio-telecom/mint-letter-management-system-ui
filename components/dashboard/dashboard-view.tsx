"use client";

import Link from "next/link";
import { ArrowRight, ArrowUp, Building2, FileText, HardDrive, Users, type LucideIcon } from "lucide-react";
import { LetterVolumeChart, StatusChart } from "@/components/dashboard/charts";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dashboardStats, letters, organizations } from "@/lib/data";
import { useI18n, type TranslationKey } from "@/lib/i18n";

const stats: { label: TranslationKey; icon: LucideIcon; value: string; change: string | null; previous: string }[] = [
  { label: "Organizations", icon: Building2, ...dashboardStats.organizations },
  { label: "Users", icon: Users, ...dashboardStats.users },
  { label: "Letters", icon: FileText, ...dashboardStats.letters },
  { label: "Storage usage", icon: HardDrive, ...dashboardStats.storage },
];

export function DashboardView() {
  const { t, locale } = useI18n();
  const topOrganizations = [...organizations].sort((a, b) => b.letters - a.letters).slice(0, 6);
  const recentLetters = letters.slice(0, 6);

  return (
    <>
      <PageHeader title={t("Dashboard")} description={t("Monitor letter activity, organizations and users across the platform.")} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t(stat.label)}</span>
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
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

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>{t("Letter volume")}</CardTitle>
            <CardDescription>{t("Incoming and outgoing letters over the last 12 months")}</CardDescription>
          </CardHeader>
          <CardContent>
            <LetterVolumeChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("Status distribution")}</CardTitle>
            <CardDescription>{t("All letters by current status")}</CardDescription>
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
                  <TableRow key={letter.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">{letter.reference}</TableCell>
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
