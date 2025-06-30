"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { RevenueDashboard } from "@/components/features/monetization/revenue-dashboard";

export default function MonetizationPage() {
  return (
    <DashboardLayout>
      <RevenueDashboard />
    </DashboardLayout>
  );
}
