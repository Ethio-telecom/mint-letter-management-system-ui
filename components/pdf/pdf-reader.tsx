"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { PdfViewerProps } from "./pdf-viewer";

// pdf.js needs browser APIs, so the viewer is only loaded on the client.
const PdfViewer = dynamic(() => import("./pdf-viewer"), {
  ssr: false,
  loading: () => <Skeleton className="size-full rounded-xl" />,
});

export function PdfReader(props: PdfViewerProps) {
  return <PdfViewer {...props} />;
}
