"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

type Tone = "success" | "warning" | "info" | "danger" | "neutral";

const toneClass: Record<Tone, string> = {
  success: "bg-success/12 text-success",
  warning: "bg-warning/14 text-warning",
  info: "bg-primary/10 text-primary",
  danger: "bg-destructive/10 text-destructive",
  neutral: "bg-muted text-muted-foreground",
};

const tones: Record<string, Tone> = {
  Active: "success",
  Published: "success",
  Pending: "warning",
  Invited: "warning",
  "In Review": "info",
  Returned: "danger",
  Suspended: "danger",
  Disabled: "neutral",
  Draft: "neutral",
  Archived: "neutral",
  Urgent: "danger",
  High: "warning",
  Medium: "info",
  Low: "neutral",
};

export function StatusBadge({ value, dot = true }: { value: string; dot?: boolean }) {
  const tone = tones[value] ?? "neutral";
  const { tv } = useI18n();
  return (
    <Badge variant="secondary" className={cn("font-medium", toneClass[tone])}>
      {dot ? <span className="size-1.5 rounded-full bg-current" /> : null}
      {tv(value)}
    </Badge>
  );
}
