"use client";

import { useMemo, useState } from "react";
import { Ban, Building2, MoreHorizontal, Pencil, Plus, Search, Users } from "lucide-react";
import { toast } from "sonner";
import { FilterSelect } from "@/components/filter-select";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { TablePagination, usePagination } from "@/components/table-pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { organizations as seedOrganizations, type Organization } from "@/lib/data";
import { useI18n, type TranslationKey } from "@/lib/i18n";

const statuses = ["All statuses", "Active", "Suspended"];

export function OrganizationsView() {
  const { t, locale } = useI18n();
  const [organizations, setOrganizations] = useState<Organization[]>(seedOrganizations);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(statuses[0]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return organizations.filter(
      (o) =>
        (status === statuses[0] || o.status === status) &&
        (!q || [o.name, o.nameAm, o.code].some((v) => v.toLowerCase().includes(q))),
    );
  }, [organizations, query, status]);

  const pagination = usePagination(filtered);

  const summary: { label: TranslationKey; value: number | string }[] = [
    { label: "Total organizations", value: organizations.length },
    { label: "Active", value: organizations.filter((o) => o.status === "Active").length },
    { label: "Suspended", value: organizations.filter((o) => o.status === "Suspended").length },
    { label: "Total users", value: organizations.reduce((sum, o) => sum + o.users, 0).toLocaleString("en-US") },
  ];

  function createOrganization(form: FormData) {
    const organization: Organization = {
      id: `org-new-${organizations.length + 1}`,
      name: String(form.get("name")),
      nameAm: String(form.get("nameAm") || ""),
      code: String(form.get("code")).toLowerCase(),
      users: 0,
      letters: 0,
      storage: "0 MB",
      status: "Active",
      createdAt: "Nov 15, 2026",
    };
    setOrganizations((prev) => [organization, ...prev]);
    pagination.setPage(1);
    setDialogOpen(false);
    toast.success(t("Organization created"), { description: organization.name });
  }

  function toggleSuspended(org: Organization) {
    const next = org.status === "Active" ? "Suspended" : "Active";
    setOrganizations((prev) => prev.map((o) => (o.id === org.id ? { ...o, status: next } : o)));
    toast.success(t(next === "Suspended" ? "{name} suspended" : "{name} reactivated", { name: org.name }));
  }

  return (
    <>
      <PageHeader title={t("Organizations")} description={t("Manage the government organizations that send and receive letters.")}>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button />}>
            <Plus /> {t("Add organization")}
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <form
              className="grid gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                createOrganization(new FormData(e.currentTarget));
              }}
            >
              <DialogHeader>
                <DialogTitle>{t("Add organization")}</DialogTitle>
                <DialogDescription>{t("Create a new organization workspace. You can invite its administrators afterwards.")}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-2">
                <Label htmlFor="org-name">{t("Name (English)")}</Label>
                <Input id="org-name" name="name" placeholder={t("e.g. Ministry of Health")} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="org-name-am">{t("Name (Amharic)")}</Label>
                <Input id="org-name-am" name="nameAm" placeholder="ጤና ሚኒስቴር" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="org-code">{t("Short code")}</Label>
                  <Input id="org-code" name="code" placeholder={t("e.g. moh")} required pattern="[A-Za-z0-9-]{2,12}" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="org-email">{t("Contact email")}</Label>
                  <Input id="org-email" name="email" type="email" placeholder="info@moh.gov.et" />
                </div>
              </div>
              <DialogFooter>
                <DialogClose render={<Button type="button" variant="outline" />}>{t("Cancel")}</DialogClose>
                <Button type="submit">{t("Create organization")}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summary.map((item) => (
          <Card key={item.label} size="sm">
            <CardContent>
              <p className="text-sm text-muted-foreground">{t(item.label)}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="grid gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-56 flex-1 sm:max-w-sm">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => { setQuery(e.target.value); pagination.setPage(1); }}
                placeholder={t("Search name or code…")}
                aria-label={t("Search organizations")}
                className="pl-8"
              />
            </div>
            <FilterSelect value={status} onChange={(v) => { setStatus(v); pagination.setPage(1); }} options={statuses} className="w-36" />
          </div>

          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>{t("Organization")}</TableHead>
                  <TableHead className="hidden sm:table-cell">{t("Code")}</TableHead>
                  <TableHead className="hidden text-right md:table-cell">{t("Users")}</TableHead>
                  <TableHead className="hidden text-right md:table-cell">{t("Letters")}</TableHead>
                  <TableHead className="hidden text-right lg:table-cell">{t("Storage")}</TableHead>
                  <TableHead>{t("Status")}</TableHead>
                  <TableHead className="hidden xl:table-cell">{t("Created")}</TableHead>
                  <TableHead className="w-10"><span className="sr-only">{t("Actions")}</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-40 text-center text-muted-foreground">
                      <Building2 className="mx-auto mb-2 size-6" />
                      {t("No organizations match your filters.")}
                    </TableCell>
                  </TableRow>
                ) : (
                  pagination.rows.map((org) => (
                    <TableRow key={org.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary uppercase">
                            {org.code.slice(0, 2)}
                          </span>
                          <div className="min-w-0">
                            <p className="max-w-80 truncate font-medium">{locale === "am" ? org.nameAm || org.name : org.name}</p>
                            <p className="max-w-80 truncate text-xs text-muted-foreground">{locale === "am" ? org.name : org.nameAm}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden font-mono text-xs text-muted-foreground sm:table-cell">{org.code}</TableCell>
                      <TableCell className="hidden text-right tabular-nums md:table-cell">{org.users.toLocaleString("en-US")}</TableCell>
                      <TableCell className="hidden text-right tabular-nums md:table-cell">{org.letters.toLocaleString("en-US")}</TableCell>
                      <TableCell className="hidden text-right tabular-nums lg:table-cell">{org.storage}</TableCell>
                      <TableCell>
                        <StatusBadge value={org.status} />
                      </TableCell>
                      <TableCell className="hidden whitespace-nowrap text-muted-foreground xl:table-cell">{org.createdAt}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={t("Actions for {name}", { name: org.name })} />}>
                            <MoreHorizontal />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="min-w-44">
                            <DropdownMenuItem onClick={() => toast.info(t("Editing {name}", { name: org.name }))}>
                              <Pencil /> {t("Edit details")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.info(t("Opening members of {name}", { name: org.name }))}>
                              <Users /> {t("View members")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant={org.status === "Active" ? "destructive" : "default"} onClick={() => toggleSuspended(org)}>
                              <Ban /> {org.status === "Active" ? t("Suspend") : t("Reactivate")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <TablePagination {...pagination} />
        </CardContent>
      </Card>
    </>
  );
}
