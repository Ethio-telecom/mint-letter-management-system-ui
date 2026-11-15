"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Download, ExternalLink, FileWarning, Loader2, ZoomIn, ZoomOut } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Button, buttonVariants } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

// react-pdf requires the worker to be configured in the same module that renders <Document>.
pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const MAX_FIT_WIDTH = 860;

export type PdfViewerProps = {
  /** URL of the PDF to show. */
  file: string;
  /** File name offered when downloading. */
  fileName?: string;
};

export default function PdfViewer({ file, fileName = "document.pdf" }: PdfViewerProps) {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // At 100% the page fits the available width (minus padding), up to a comfortable reading width.
  const fitWidth = Math.min(Math.max(containerWidth - 32, 200), MAX_FIT_WIDTH);
  const zoomIndex = ZOOM_STEPS.indexOf(zoom);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      <div className="flex flex-wrap items-center gap-1 border-b px-2 py-1.5">
        <Button variant="ghost" size="icon-sm" aria-label={t("Previous page")} disabled={page <= 1} onClick={() => setPage(page - 1)}>
          <ChevronLeft />
        </Button>
        <span className="min-w-24 text-center text-sm tabular-nums">
          {pageCount ? t("Page {page} of {count}", { page, count: pageCount }) : "…"}
        </span>
        <Button variant="ghost" size="icon-sm" aria-label={t("Next page")} disabled={page >= pageCount} onClick={() => setPage(page + 1)}>
          <ChevronRight />
        </Button>

        <span className="mx-1 h-4 w-px bg-border" />

        <Button variant="ghost" size="icon-sm" aria-label={t("Zoom out")} disabled={zoomIndex <= 0} onClick={() => setZoom(ZOOM_STEPS[zoomIndex - 1])}>
          <ZoomOut />
        </Button>
        <button
          type="button"
          onClick={() => setZoom(1)}
          aria-label={t("Reset zoom")}
          className="min-w-12 rounded-md px-1 py-0.5 text-center text-sm tabular-nums outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {Math.round(zoom * 100)}%
        </button>
        <Button variant="ghost" size="icon-sm" aria-label={t("Zoom in")} disabled={zoomIndex >= ZOOM_STEPS.length - 1} onClick={() => setZoom(ZOOM_STEPS[zoomIndex + 1])}>
          <ZoomIn />
        </Button>

        <div className="ml-auto flex items-center gap-1">
          <a href={file} target="_blank" rel="noreferrer" aria-label={t("Open in new tab")} title={t("Open in new tab")} className={buttonVariants({ variant: "ghost", size: "icon-sm" })}>
            <ExternalLink />
          </a>
          <a href={file} download={fileName} className={buttonVariants({ variant: "outline", size: "sm" })}>
            <Download /> {t("Download")}
          </a>
        </div>
      </div>

      <div ref={containerRef} className="min-h-0 flex-1 overflow-auto bg-muted/60">
        <Document
          file={file}
          onLoadSuccess={({ numPages }) => {
            setPageCount(numPages);
            setPage(1);
          }}
          className="flex min-h-full w-max min-w-full justify-center p-4"
          loading={
            <div className="flex items-center gap-2 self-center text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> {t("Loading document…")}
            </div>
          }
          error={
            <div className="flex flex-col items-center gap-2 self-center text-sm text-muted-foreground">
              <FileWarning className="size-6" />
              {t("Could not load the document.")}
            </div>
          }
        >
          {containerWidth > 0 ? (
            <Page pageNumber={page} width={fitWidth * zoom} className="h-fit shadow-md ring-1 ring-black/5" loading={null} />
          ) : null}
        </Document>
      </div>
    </div>
  );
}
