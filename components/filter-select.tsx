"use client";

import { useI18n } from "@/lib/i18n";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function FilterSelect({
  value,
  onChange,
  options,
  className,
  id,
  name,
  placeholder,
}: {
  value?: string;
  onChange?: (value: string) => void;
  options: (string | { value: string; label: string })[];
  className?: string;
  id?: string;
  name?: string;
  placeholder?: string;
}) {
  const { tv } = useI18n();
  const items = options.map((o) => (typeof o === "string" ? { value: o, label: tv(o) } : o));
  return (
    <Select items={items} value={value} name={name} onValueChange={(v) => onChange?.(v as string)}>
      <SelectTrigger id={id} className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
