import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { TenantScope } from "@/lib/tenant";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0 bg-background">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-6 p-4 md:p-6">
          <TenantScope>{children}</TenantScope>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
