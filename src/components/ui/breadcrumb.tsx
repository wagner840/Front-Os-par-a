"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export function Breadcrumb({
  items = [],
  className,
  showHome = true,
}: BreadcrumbProps) {
  const pathname = usePathname();

  // Generate breadcrumb items from pathname if not provided
  const generateItems = (): BreadcrumbItem[] => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbItems: BreadcrumbItem[] = [];

    if (showHome) {
      breadcrumbItems.push({
        label: "Dashboard",
        href: "/",
        icon: Home,
      });
    }

    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      const isLast = index === segments.length - 1;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);

      breadcrumbItems.push({
        label: formatLabel(label),
        href: isLast ? undefined : currentPath,
      });
    });

    return breadcrumbItems;
  };

  const formatLabel = (label: string): string => {
    // Convert kebab-case and snake_case to Title Case
    return label.replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const breadcrumbItems = items.length > 0 ? items : generateItems();

  if (breadcrumbItems.length <= 1) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-1 text-sm", className)}
    >
      <ol className="flex items-center space-x-1">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const Icon = item.icon;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight
                  className="h-4 w-4 text-white/40 mx-2 flex-shrink-0"
                  aria-hidden="true"
                />
              )}

              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1 rounded-lg",
                    "text-white/70 hover:text-white hover:bg-white/10",
                    "transition-all duration-200 focus-enhanced",
                    "min-h-[32px] min-w-[32px]" // Touch target
                  )}
                  aria-label={`Ir para ${item.label}`}
                >
                  {Icon && (
                    <Icon
                      className="h-4 w-4 flex-shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <span className="truncate max-w-[120px] sm:max-w-none">
                    {item.label}
                  </span>
                </Link>
              ) : (
                <span
                  className={cn(
                    "flex items-center gap-2 px-2 py-1",
                    "text-white font-medium",
                    isLast && "text-white"
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {Icon && (
                    <Icon
                      className="h-4 w-4 flex-shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <span className="truncate max-w-[120px] sm:max-w-none">
                    {item.label}
                  </span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Hook para usar breadcrumb customizado
export function useBreadcrumb() {
  const setBreadcrumb = (items: BreadcrumbItem[]) => {
    // Pode ser expandido para usar contexto se necessário
    return items;
  };

  return { setBreadcrumb };
}
