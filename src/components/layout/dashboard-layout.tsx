"use client";

import { ReactNode } from "react";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardHeader } from "./dashboard-header";
import { MobileNavigation } from "./mobile-navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  breadcrumbItems?: Array<{
    label: string;
    href?: string;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
}

export function DashboardLayout({
  children,
  className,
  title,
  description,
  breadcrumbItems,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Mobile Navigation */}
      <MobileNavigation />

      {/* Desktop Layout */}
      <div className="hidden md:flex h-screen">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden ml-72">
          {/* Header */}
          <DashboardHeader
            title={title || "Dashboard"}
            description={description}
          />

          {/* Content Area */}
          <main className="flex-1 overflow-auto">
            <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-none">
              {/* Breadcrumb */}
              {breadcrumbItems && breadcrumbItems.length > 0 && (
                <Breadcrumb items={breadcrumbItems} />
              )}

              {/* Page Header */}
              {(title || description) && (
                <div className="space-y-2">
                  {title && (
                    <h1 className="text-responsive-xl font-bold text-high-contrast">
                      {title}
                    </h1>
                  )}
                  {description && (
                    <p className="text-responsive-lg text-secondary max-w-4xl">
                      {description}
                    </p>
                  )}
                </div>
              )}

              {/* Page Content */}
              <div className={cn("space-y-6", className)}>{children}</div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Mobile Content with proper spacing */}
        <main className="pt-20 pb-24 px-4 space-y-6">
          {/* Breadcrumb */}
          {breadcrumbItems && breadcrumbItems.length > 0 && (
            <Breadcrumb items={breadcrumbItems} className="px-2" />
          )}

          {/* Page Header */}
          {(title || description) && (
            <div className="space-y-2 px-2">
              {title && (
                <h1 className="text-2xl font-bold text-high-contrast">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-lg text-secondary">{description}</p>
              )}
            </div>
          )}

          {/* Page Content */}
          <div className={cn("space-y-mobile", className)}>{children}</div>
        </main>
      </div>
    </div>
  );
}
