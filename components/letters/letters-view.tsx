"use client";

import { useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Archive, Eye, Forward, Inbox, MoreHorizontal, Paperclip, Plus, Search, X } from "lucide-react";
import { toast } from "sonner";
import { FilterSelect } from "@/components/filter-select";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { TablePagination, usePagination } from "@/components/table-pagination";
import { Badge } from "@/components/ui/badge";
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
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { letters as seedLetters, organizations, type Letter, type LetterPriority, type LetterType } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

const types = ["All", "Incoming", "Outgoing", "Internal"] as const;
const statuses = ["All statuses", "Draft", "Pending", "In Review", "Published", "Returned", "Archived"];
const priorities = ["All priorities", "Low", "Medium", "High", "Urgent"];

/** `kind="memos"` shows only memos; `kind="letters"` shows every other letter type. */
export function LettersView({ kind = "letters" }: { kind?: "letters" | "memos" }) {
  const isMemos = kind === "memos";
  const { t, tv } = useI18n();
  const [letters, setLetters] = useState<Letter[]>(() =>
    seedLetters.filter((l) => (l.type === "Memo") === isMemos),
  );
  // The URL is the source of truth for filters (?type=&status=&priority=&q=). The route stays
  // mounted between visits, so state initialised once from the URL would go stale when a
  // dashboard drill-down navigates here with different filters.
  const pathname = usePathname();
  const params = useSearchParams();
  const pick = <T extends string>(key: string, allowed: readonly T[], fallback: T) => {
    const value = params.get(key) as T | null;
    return value && allowed.includes(value) ? value : fallback;
  };
  const type = pick<(typeof types)[number]>("type", types, "All");
  const status = pick("status", statuses, statuses[0]);
  const priority = pick("priority", priorities, priorities[0]);
  const query = params.get("q") ?? "";
  const hasFilters = type !== "All" || status !== statuses[0] || priority !== priorities[0] || query !== "";

  function replaceParams(next: URLSearchParams) {
    const search = next.toString();
    // history.replaceState keeps useSearchParams in sync without a server round trip.
    window.history.replaceState(null, "", search ? `${pathname}?${search}` : pathname);
  }
  function setFilter(key: "type" | "status" | "priority" | "q", value: string, emptyValue: string) {
    const next = new URLSearchParams(params.toString());
    if (value === emptyValue) next.delete(key);
    else next.set(key, value);
    replaceParams(next);
  }
  const setType = (value: string) => setFilter("type", value, "All");
  const setStatus = (value: string) => setFilter("status", value, statuses[0]);
  const setPriority = (value: string) => setFilter("priority", value, priorities[0]);
  const setQuery = (value: string) => setFilter("q", value, "");
  const clearFilters = () => replaceParams(new URLSearchParams());

  const [selected, setSelected] = useState<Letter | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return letters.filter(
      (l) =>
        (type === "All" || l.type === type) &&
        (status === statuses[0] || l.status === status) &&
        (priority === priorities[0] || l.priority === priority) &&
        (!q || [l.subject, l.reference, l.sender, l.recipient].some((v) => v.toLowerCase().includes(q))),
    );
  }, [letters, type, status, priority, query]);

  const pagination = usePagination(filtered);

  // Go back to the first page whenever the filters change, including via navigation.
  const filterKey = params.toString();
  const [lastFilterKey, setLastFilterKey] = useState(filterKey);
  if (filterKey !== lastFilterKey) {
    setLastFilterKey(filterKey);
    pagination.setPage(1);
  }
  const count = (tab: string) => (tab === "All" ? letters.length : letters.filter((l) => l.type === tab).length);

  function createLetter(form: FormData) {
    const letter: Letter = {
      id: `ltr-new-${letters.length + 1}`,
      reference: `MINT-${String(letters.length + 31).padStart(4, "0")}`,
      subject: String(form.get("subject")),
      sender: "Ministry of Innovation and Technology",
      recipient: String(form.get("recipient")),
      type: isMemos ? "Memo" : (String(form.get("type")) as LetterType),
      priority: String(form.get("priority")) as LetterPriority,
      status: "Draft",
      date: "Nov 15, 2026",
      body: String(form.get("body") || ""),
    };
    setLetters((prev) => [letter, ...prev]);
    pagination.setPage(1);
    setDialogOpen(false);
    toast.success(isMemos ? t("Memo saved as draft") : t("Letter saved as draft"), { description: `${letter.reference} · ${letter.subject}` });
  }

  function archive(letter: Letter) {
    setLetters((prev) => prev.map((l) => (l.id === letter.id ? { ...l, status: "Archived" } : l)));
    toast.success(t("{name} archived", { name: letter.reference }));
  }

  return (
    <>
      <PageHeader
        title={isMemos ? t("Memos") : t("Letters")}
        description={
          isMemos
            ? t("Write and circulate internal memos to staff and directorates.")
            : t("Register, route and track incoming, outgoing and internal correspondence.")
        }
      >
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button />}>
            <Plus /> {isMemos ? t("New memo") : t("New letter")}
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <form
              className="grid gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                createLetter(new FormData(e.currentTarget));
              }}
            >
              <DialogHeader>
                <DialogTitle>{isMemos ? t("New memo") : t("New letter")}</DialogTitle>
                <DialogDescription>
                  {isMemos
                    ? t("The memo is saved as a draft until you publish it.")
                    : t("The letter is saved as a draft until you send it for review.")}
                </DialogDescription>
              </DialogHeader>
              <div className={isMemos ? "grid gap-4" : "grid gap-4 sm:grid-cols-2"}>
                {isMemos ? null : (
                  <div className="grid gap-2">
                    <Label htmlFor="letter-type">{t("Letter type")}</Label>
                    <FilterSelect id="letter-type" name="type" value={undefined} options={["Outgoing", "Incoming", "Internal"]} placeholder={t("Select type")} className="w-full" />
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="letter-priority">{t("Priority")}</Label>
                  <FilterSelect id="letter-priority" name="priority" options={["Low", "Medium", "High", "Urgent"]} placeholder={t("Select priority")} className="w-full" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="letter-recipient">{isMemos ? t("To") : t("Recipient")}</Label>
                {isMemos ? (
                  <Input id="letter-recipient" name="recipient" placeholder={t("e.g. All Directorates")} required />
                ) : (
                  <FilterSelect id="letter-recipient" name="recipient" options={organizations.map((o) => o.name)} placeholder={t("Select organization")} className="w-full" />
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="letter-subject">{t("Subject")}</Label>
                <Input id="letter-subject" name="subject" placeholder={isMemos ? t("What is this memo about?") : t("What is this letter about?")} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="letter-body">{t("Message")}</Label>
                <Textarea id="letter-body" name="body" rows={4} placeholder={t("Write the letter content or a short summary")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="letter-file">{t("Attachment")}</Label>
                <Input id="letter-file" name="file" type="file" accept=".pdf,.doc,.docx,image/*" />
              </div>
              <DialogFooter>
                <DialogClose render={<Button type="button" variant="outline" />}>{t("Cancel")}</DialogClose>
                <Button type="submit">{t("Save draft")}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Card>
        <CardContent className="grid gap-4">
          {isMemos ? null : (
            <Tabs value={type} onValueChange={(v) => { setType(v as string); }}>
              <div className="-mx-1 overflow-x-auto px-1">
                <TabsList>
                  {types.map((tab) => (
                    <TabsTrigger key={tab} value={tab} className="px-3">
                      {tv(tab)}
                      <Badge variant="secondary" className="h-4.5 px-1.5 tabular-nums">{count(tab)}</Badge>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </Tabs>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-56 flex-1 sm:max-w-sm">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => { setQuery(e.target.value); }}
                placeholder={t("Search subject, reference, sender…")}
                aria-label={isMemos ? t("Search memos") : t("Search letters")}
                className="pl-8"
              />
            </div>
            <FilterSelect value={status} onChange={(v) => { setStatus(v); }} options={statuses} className="w-40" />
            <FilterSelect value={priority} onChange={(v) => { setPriority(v); }} options={priorities} className="w-40" />
            {hasFilters ? (
              <Button variant="ghost" onClick={() => { clearFilters(); }}>
                <X /> {t("Clear filters")}
              </Button>
            ) : null}
          </div>

          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>{t("Reference")}</TableHead>
                  <TableHead>{t("Subject")}</TableHead>
                  <TableHead className="hidden lg:table-cell">{t("From")}</TableHead>
                  <TableHead className="hidden xl:table-cell">{t("To")}</TableHead>
                  {isMemos ? null : <TableHead className="hidden md:table-cell">{t("Type")}</TableHead>}
                  <TableHead className="hidden md:table-cell">{t("Priority")}</TableHead>
                  <TableHead>{t("Status")}</TableHead>
                  <TableHead className="hidden sm:table-cell">{t("Date")}</TableHead>
                  <TableHead className="w-10"><span className="sr-only">{t("Actions")}</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isMemos ? 8 : 9} className="h-40 text-center text-muted-foreground">
                      <Inbox className="mx-auto mb-2 size-6" />
                      {isMemos ? t("No memos match your filters.") : t("No letters match your filters.")}
                    </TableCell>
                  </TableRow>
                ) : (
                  pagination.rows.map((letter) => (
                    <TableRow key={letter.id} className="cursor-pointer" onClick={() => setSelected(letter)}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{letter.reference}</TableCell>
                      <TableCell className="max-w-72 truncate font-medium">{letter.subject}</TableCell>
                      <TableCell className="hidden max-w-44 truncate text-muted-foreground lg:table-cell">{letter.sender}</TableCell>
                      <TableCell className="hidden max-w-44 truncate text-muted-foreground xl:table-cell">{letter.recipient}</TableCell>
                      {isMemos ? null : (
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline">{tv(letter.type)}</Badge>
                        </TableCell>
                      )}
                      <TableCell className="hidden md:table-cell">
                        <StatusBadge value={letter.priority} dot={false} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge value={letter.status} />
                      </TableCell>
                      <TableCell className="hidden whitespace-nowrap text-muted-foreground sm:table-cell">{letter.date}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={t("Actions for {name}", { name: letter.reference })} />}>
                            <MoreHorizontal />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="min-w-40">
                            <DropdownMenuItem onClick={() => setSelected(letter)}>
                              <Eye /> {t("View details")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.info(t("Forwarding {name}", { name: letter.reference }))}>
                              <Forward /> {t("Forward")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => archive(letter)}>
                              <Archive /> {t("Archive")}
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

      <Sheet open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {selected ? (
            <>
              <SheetHeader>
                <SheetDescription className="font-mono text-xs">{selected.reference}</SheetDescription>
                <SheetTitle className="text-lg leading-snug">{selected.subject}</SheetTitle>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <StatusBadge value={selected.status} />
                  <StatusBadge value={selected.priority} dot={false} />
                  <Badge variant="outline">{tv(selected.type)}</Badge>
                </div>
              </SheetHeader>
              <div className="grid gap-5 overflow-y-auto px-4">
                <dl className="grid grid-cols-[5rem_1fr] gap-x-3 gap-y-3 text-sm">
                  <dt className="text-muted-foreground">{t("From")}</dt>
                  <dd className="font-medium">{selected.sender}</dd>
                  <dt className="text-muted-foreground">{t("To")}</dt>
                  <dd className="font-medium">{selected.recipient}</dd>
                  <dt className="text-muted-foreground">{t("Date")}</dt>
                  <dd>{selected.date}</dd>
                </dl>
                <div className="grid gap-2">
                  <p className="text-sm font-medium">{t("Summary")}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{selected.body || t("No summary provided.")}</p>
                </div>
                <div className="grid gap-2">
                  <p className="text-sm font-medium">{t("Attachments")}</p>
                  <div className="flex items-center gap-3 rounded-lg border p-3 text-sm">
                    <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Paperclip className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{selected.reference}.pdf</p>
                      <p className="text-xs text-muted-foreground">{t("Scanned letter · 1.2 MB")}</p>
                    </div>
                  </div>
                </div>
              </div>
              <SheetFooter className="flex-row">
                <Button className="flex-1" onClick={() => toast.info(t("Forwarding {name}", { name: selected.reference }))}>
                  <Forward /> {t("Forward")}
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => { archive(selected); setSelected(null); }}>
                  <Archive /> {t("Archive")}
                </Button>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
}
