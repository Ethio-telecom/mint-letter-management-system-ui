import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandLogo({ className, size = 36 }: { className?: string; size?: number }) {
  return (
    <Image
      src="/logo.png"
      alt="Ministry of Innovation and Technology"
      width={size}
      height={size}
      className={cn("shrink-0 object-contain", className)}
      style={{ width: size, height: size }}
      priority
    />
  );
}
