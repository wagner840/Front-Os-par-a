"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AnimatedMetricProps {
  title: string;
  label?: string;
  value: number;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  prefix?: string;
  suffix?: string;
}

export function AnimatedMetric({
  title,
  label,
  value,
  icon,
  trend,
  trendValue,
  className,
  variant = "default",
  prefix = "",
  suffix = "",
}: AnimatedMetricProps) {
  const variantStyles = {
    default: "border-border/20 bg-background/50",
    success: "border-green-500/20 bg-green-500/5",
    warning: "border-yellow-500/20 bg-yellow-500/5",
    danger: "border-red-500/20 bg-red-500/5",
    info: "border-blue-500/20 bg-blue-500/5",
  };

  const trendStyles = {
    up: "text-green-500",
    down: "text-red-500",
    neutral: "text-gray-500",
  };

  const displayTitle = label || title;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "relative overflow-hidden rounded-xl border p-6",
        "backdrop-blur-sm",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            {displayTitle}
          </p>
          <motion.p
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-2xl font-bold"
          >
            {prefix}
            {typeof value === "number" ? value.toLocaleString() : value}
            {suffix}
          </motion.p>
          {trend && trendValue && (
            <div
              className={cn("flex items-center text-xs", trendStyles[trend])}
            >
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Componente para grid de métricas
interface MetricGridProps {
  metrics: Array<{
    id: string;
    value: number;
    label: string;
    suffix?: string;
    prefix?: string;
    variant?: "default" | "success" | "warning" | "danger" | "info";
    icon?: React.ReactNode;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
  }>;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function MetricGrid({
  metrics,
  columns = 3,
  className,
}: MetricGridProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-6", gridCols[columns], className)}>
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.id}
          className="p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <AnimatedMetric
            title={metric.label}
            value={metric.value}
            icon={metric.icon}
            trend={metric.trend}
            trendValue={metric.trendValue}
          />
        </motion.div>
      ))}
    </div>
  );
}
