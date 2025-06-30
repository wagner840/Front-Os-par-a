"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ContentOpportunitiesDashboard } from "@/components/features/content-opportunities/content-opportunities-dashboard";

export default function ContentOpportunitiesPage() {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Content Opportunities" },
  ];

  return (
    <DashboardLayout
      title="Content Opportunities"
      description="Descubra e gerencie oportunidades de conteúdo baseadas em categories e clusters de keywords"
      breadcrumbItems={breadcrumbItems}
    >
      <ContentOpportunitiesDashboard />
    </DashboardLayout>
  );
}
