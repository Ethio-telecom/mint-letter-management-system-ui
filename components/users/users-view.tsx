"use client";

import { useMemo, useState } from "react";
import { KeyRound, MoreHorizontal, Pencil, Search, UserPlus, UserX, Users as UsersIcon } from "lucide-react";
import { toast } from "sonner";
import { FilterSelect } from "@/components/filter-select";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { TablePagination, usePagination } from "@/components/table-pagination";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { findOrganization, type User, type UserRole } from "@/lib/data";
import { useTenant } from "@/lib/tenant";
import { useTenantData } from "@/lib/use-tenant-data";
import { useI18n } from "@/lib/i18n";

const roles = ["All roles", "System Admin", "Org Admin", "Records Officer", "Approver", "Staff"];
const statuses = ["All statuses", "Active", "Invited", "Disabled"];

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

export function UsersView() {
  const { t, tv, locale } = useI18n();
  const orgLabel = (name: string) =>
    locale === "am" ? (findOrganization(name)?.nameAm ?? name) : name;
  const { tenant } = useTenant();
  const { organizations, users: seedUsers } = useTenantData();
  const orgOptions = [tenant.name, ...organizations.map((o) => o.name)];
  const [users, setUsers] = useState<User[]>(seedUsers);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState(roles[0]);
  const [status, setStatus] = useState(statuses[0]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter(
      (u) =>
        (role === roles[0] || u.role === role) &&
        (status === statuses[0] || u.status === status) &&
        (!q || [u.name, u.email, u.organization, u.department].some((v) => v.toLowerCase().includes(q))),
    );
  }, [users, query, role, status]);

  const pagination = usePagination(filtered);

  function inviteUser(form: FormData) {
    const user: User = {
      id: `usr-new-${users.length + 1}`,
      name: String(form.get("name")),
      email: String(form.get("email")),
      organization: String(form.get("organization")),
      department: String(form.get("department") || "—"),
      role: String(form.get("role")) as UserRole,
      status: "Invited",
      lastActive: "Never",
    };
    setUsers((prev) => [user, ...prev]);
    pagination.setPage(1);
    setDialogOpen(false);
    toast.success(t("Invitation sent"), { description: user.email });
  }

  function toggleDisabled(user: User) {
    const next = user.status === "Disabled" ? "Active" : "Disabled";
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: next } : u)));
    toast.success(t(next === "Disabled" ? "{name} disabled" : "{name} re-enabled", { name: user.name }));
  }

  return (
    <>
      <PageHeader title={t("Users")} description={t("Manage accounts, roles and access across all organizations.")}>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button />}>
            <UserPlus /> {t("Add user")}
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <form
              className="grid gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                inviteUser(new FormData(e.currentTarget));
              }}
            >
              <DialogHeader>
                <DialogTitle>{t("Add user")}</DialogTitle>
                <DialogDescription>{t("The user receives an email invitation to set their password.")}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="user-name">{t("Full name")}</Label>
                  <Input id="user-name" name="name" placeholder={t("Full name")} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="user-email">{t("Email")}</Label>
                  <Input id="user-email" name="email" type="email" placeholder={`name@${tenant.domain}`} required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="user-org">{t("Organization")}</Label>
                <FilterSelect id="user-org" name="organization" options={orgOptions} placeholder={t("Select organization")} className="w-full" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="user-department">{t("Department")}</Label>
                  <Input id="user-department" name="department" placeholder={t("e.g. Records Office")} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="user-role">{t("Role")}</Label>
                  <FilterSelect id="user-role" name="role" options={roles.slice(1)} placeholder={t("Select role")} className="w-full" />
                </div>
              </div>
              <DialogFooter>
                <DialogClose render={<Button type="button" variant="outline" />}>{t("Cancel")}</DialogClose>
                <Button type="submit">{t("Send invitation")}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Card>
        <CardContent className="grid gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-56 flex-1 sm:max-w-sm">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => { setQuery(e.target.value); pagination.setPage(1); }}
                placeholder={t("Search name, email, organization…")}
                aria-label={t("Search users")}
                className="pl-8"
              />
            </div>
            <FilterSelect value={role} onChange={(v) => { setRole(v); pagination.setPage(1); }} options={roles} className="w-40" />
            <FilterSelect value={status} onChange={(v) => { setStatus(v); pagination.setPage(1); }} options={statuses} className="w-36" />
          </div>

          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>{t("User")}</TableHead>
                  <TableHead className="hidden lg:table-cell">{t("Organization")}</TableHead>
                  <TableHead className="hidden md:table-cell">{t("Role")}</TableHead>
                  <TableHead>{t("Status")}</TableHead>
                  <TableHead className="hidden sm:table-cell">{t("Last active")}</TableHead>
                  <TableHead className="w-10"><span className="sr-only">{t("Actions")}</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                      <UsersIcon className="mx-auto mb-2 size-6" />
                      {t("No users match your filters.")}
                    </TableCell>
                  </TableRow>
                ) : (
                  pagination.rows.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">{initials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate font-medium">{user.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <p className="max-w-64 truncate">{orgLabel(user.organization)}</p>
                        <p className="text-xs text-muted-foreground">{user.department}</p>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{tv(user.role)}</TableCell>
                      <TableCell>
                        <StatusBadge value={user.status} />
                      </TableCell>
                      <TableCell className="hidden whitespace-nowrap text-muted-foreground sm:table-cell">{tv(user.lastActive)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={t("Actions for {name}", { name: user.name })} />}>
                            <MoreHorizontal />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="min-w-44">
                            <DropdownMenuItem onClick={() => toast.info(t("Editing {name}", { name: user.name }))}>
                              <Pencil /> {t("Edit user")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.success(t("Password reset link sent to {name}", { name: user.email }))}>
                              <KeyRound /> {t("Reset password")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant={user.status === "Disabled" ? "default" : "destructive"} onClick={() => toggleDisabled(user)}>
                              <UserX /> {user.status === "Disabled" ? t("Enable account") : t("Disable account")}
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
