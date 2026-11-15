"use client";

import Link from "next/link";
import { Archive, ArrowLeft, FileQuestion, Forward, Paperclip } from "lucide-react";
import { toast } from "sonner";
import { PdfReader } from "@/components/pdf/pdf-reader";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { useLetters, letterStore } from "@/lib/letter-store";

// Every letter shows the same sample scan until real documents come from the backend.
const SAMPLE_PDF = "/sample-letter.pdf";

export function LetterDetailView({ id, kind }: { id: string; kind: "letters" | "memos" }) {
  const { t, tv } = useI18n();
  const letter = useLetters().find((l) => l.id === id && (l.type === "Memo") === (kind === "memos"));
  const backHref = `/${kind}`;
  const backLabel = kind === "memos" ? t("Back to memos") : t("Back to letters");

  if (!letter) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-center">
        <FileQuestion className="size-10 text-muted-foreground" />
        <h1 className="text-xl font-semibold">{t("Letter not found")}</h1>
        <p className="max-w-sm text-sm text-muted-foreground">{t("It may have been removed, or the link is incorrect.")}</p>
        <Link href={backHref} className={buttonVariants({ variant: "outline" })}>
          <ArrowLeft /> {backLabel}
        </Link>
      </div>
    );
  }

  const fileName = `${letter.reference}.pdf`;
  const activity = [
    { text: t("Status changed to {name}", { name: tv(letter.status) }), time: letter.date },
    { text: t("Received by {name}", { name: letter.recipient }), time: letter.date },
    { text: t("Registered in the system"), time: letter.date },
  ];

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={backHref}
            className="mb-2 inline-flex items-center gap-1 rounded-sm text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <ArrowLeft className="size-4" /> {backLabel}
          </Link>
          <h1 className="text-xl font-semibold tracking-tight text-balance md:text-2xl">{letter.subject}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 font-mono text-xs text-muted-foreground">{letter.reference}</span>
            <StatusBadge value={letter.status} />
            <StatusBadge value={letter.priority} dot={false} />
            <Badge variant="outline">{tv(letter.type)}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => toast.info(t("Forwarding {name}", { name: letter.reference }))}>
            <Forward /> {t("Forward")}
          </Button>
          <Button
            variant="outline"
            disabled={letter.status === "Archived"}
            onClick={() => {
              letterStore.update(letter.id, { status: "Archived" });
              toast.success(t("{name} archived", { name: letter.reference }));
            }}
          >
            <Archive /> {t("Archive")}
          </Button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="h-[75svh] min-h-[28rem] lg:sticky lg:top-[4.5rem] lg:h-[calc(100svh-6rem)]">
          <PdfReader file={SAMPLE_PDF} fileName={fileName} />
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("Details")}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-3 text-sm">
                <dt className="text-muted-foreground">{t("Reference")}</dt>
                <dd className="font-mono text-xs leading-5">{letter.reference}</dd>
                <dt className="text-muted-foreground">{t("From")}</dt>
                <dd className="font-medium">{letter.sender}</dd>
                <dt className="text-muted-foreground">{t("To")}</dt>
                <dd className="font-medium">{letter.recipient}</dd>
                <dt className="text-muted-foreground">{t("Date")}</dt>
                <dd>{letter.date}</dd>
                <dt className="text-muted-foreground">{t("Type")}</dt>
                <dd>{tv(letter.type)}</dd>
                <dt className="text-muted-foreground">{t("Priority")}</dt>
                <dd>{tv(letter.priority)}</dd>
                <dt className="text-muted-foreground">{t("Status")}</dt>
                <dd>{tv(letter.status)}</dd>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("Summary")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">{letter.body || t("No summary provided.")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("Attachments")}</CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href={SAMPLE_PDF}
                download={fileName}
                className="flex items-center gap-3 rounded-lg border p-3 text-sm outline-none transition-colors hover:bg-accent/50 focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Paperclip className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium">{fileName}</span>
                  <span className="block text-xs text-muted-foreground">{t("Scanned letter · 2 pages")}</span>
                </span>
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("Activity")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative ml-1.5 grid gap-4 border-l pl-5">
                {activity.map((item, index) => (
                  <li key={item.text} className="relative text-sm">
                    <span
                      className={`absolute top-1.5 -left-[1.5625rem] size-2 rounded-full ring-4 ring-card ${index === 0 ? "bg-primary" : "bg-border"}`}
                    />
                    <p className="font-medium">{item.text}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
