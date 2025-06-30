"use client";
import { N8nDashboard } from "@/components/features/automations/n8n-dashboard";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function AutomationsPage() {
  return (
    <DashboardLayout>
      <N8nDashboard />
    </DashboardLayout>
  );
}
