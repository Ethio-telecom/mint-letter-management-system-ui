import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Ethiopic } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import { TenantProvider, tenantInitScript } from "@/lib/tenant";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const ethiopic = Noto_Sans_Ethiopic({ variable: "--font-ethiopic", subsets: ["ethiopic"] });

export const metadata: Metadata = {
  title: { default: "MInT Letter Management", template: "%s · MInT Letter Management" },
  description: "Letter management system for the Ministry of Innovation and Technology",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${ethiopic.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: tenantInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <I18nProvider>
            <TenantProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </TenantProvider>
          </I18nProvider>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
