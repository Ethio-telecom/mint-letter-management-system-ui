import type { Metadata } from "next";
import { Suspense } from "react";
import { OrganizationsView } from "@/components/organizations/organizations-view";

export const metadata: Metadata = { title: "Organizations" };

export default function OrganizationsPage() {
  // OrganizationsView reads `?new=1` from the URL, so it needs a Suspense boundary.
  return (
    <Suspense>
      <OrganizationsView />
    </Suspense>
  );
}
