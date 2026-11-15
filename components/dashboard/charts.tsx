"use client";

import { useRouter } from "next/navigation";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { letterVolume, statusDistribution } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export function LetterVolumeChart() {
  const { t } = useI18n();
  const router = useRouter();
  const volumeConfig = {
    incoming: { label: t("Incoming"), color: "var(--chart-1)" },
    outgoing: { label: t("Outgoing"), color: "var(--chart-2)" },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={volumeConfig} className="aspect-auto h-72 w-full">
      <AreaChart data={letterVolume} margin={{ left: 0, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fill-incoming" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-incoming)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--color-incoming)" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="fill-outgoing" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-outgoing)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-outgoing)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} width={36} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area dataKey="incoming" className="cursor-pointer" onClick={() => router.push("/letters?type=Incoming")} type="monotone" stroke="var(--color-incoming)" strokeWidth={2} fill="url(#fill-incoming)" />
        <Area dataKey="outgoing" className="cursor-pointer" onClick={() => router.push("/letters?type=Outgoing")} type="monotone" stroke="var(--color-outgoing)" strokeWidth={2} fill="url(#fill-outgoing)" />
      </AreaChart>
    </ChartContainer>
  );
}

export function StatusChart() {
  const { t, tv, locale } = useI18n();
  const router = useRouter();
  const statusConfig = {
    count: { label: t("Letters"), color: "var(--chart-1)" },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={statusConfig} className="aspect-auto h-72 w-full">
      <BarChart data={statusDistribution} layout="vertical" margin={{ left: 0, right: 16 }}>
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis type="number" hide />
        <YAxis dataKey="status" type="category" tickLine={false} axisLine={false} width={locale === "am" ? 104 : 72} tickFormatter={tv} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator labelFormatter={(label) => tv(String(label))} />} />
        <Bar
          dataKey="count"
          fill="var(--color-count)"
          radius={[0, 6, 6, 0]}
          barSize={22}
          className="cursor-pointer"
          onClick={(entry) => {
            const status = (entry as { payload?: { status?: string } }).payload?.status;
            if (status) router.push(`/letters?status=${encodeURIComponent(status)}`);
          }}
        />
      </BarChart>
    </ChartContainer>
  );
}
