"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTenant, type Tenant } from "@/lib/tenant";

export function BrandLogo({ className, size = 36, tenant }: { className?: string; size?: number; tenant?: Tenant }) {
  const { tenant: current } = useTenant();
  const t = tenant ?? current;
  return (
    <Image
      src={t.logo}
      alt={t.name}
      width={size}
      height={size}
      className={cn("shrink-0 object-contain", className)}
      style={{ width: size, height: size }}
      priority
    />
  );
}
