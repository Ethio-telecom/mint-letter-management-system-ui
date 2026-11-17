"use client";

import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/** Single-line text with an ellipsis; shows the full text in a tooltip only when it is cut off. */
export function TruncatedText({
  children,
  className,
  side = "right",
}: {
  children: string;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
}) {
  const [truncated, setTruncated] = useState(false);
  return (
    <Tooltip disabled={!truncated}>
      <TooltipTrigger
        render={
          <span
            className={cn("min-w-0 truncate", className)}
            onPointerEnter={(e) => setTruncated(e.currentTarget.scrollWidth > e.currentTarget.clientWidth)}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent side={side}>{children}</TooltipContent>
    </Tooltip>
  );
}
