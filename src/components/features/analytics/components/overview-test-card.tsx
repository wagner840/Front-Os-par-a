"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";
import type { ABTest } from "@/lib/hooks/use-ab-testing-dashboard";

interface OverviewTestCardProps {
  test: ABTest;
  index: number;
  getStatusColor: (status: ABTest["status"]) => string;
  getStatusLabel: (status: ABTest["status"]) => string;
  onSelectTest: (test: ABTest) => void;
}

export function OverviewTestCard({
  test,
  index,
  getStatusColor,
  getStatusLabel,
  onSelectTest,
}: OverviewTestCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <GlassCard
        className="cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => onSelectTest(test)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{test.name}</CardTitle>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${getStatusColor(
                  test.status
                )}`}
              />
              <Badge variant="outline">{getStatusLabel(test.status)}</Badge>
            </div>
          </div>
          <CardDescription>{test.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Visitantes
              </span>
              <span className="font-medium">
                {test.metrics.total_visitors.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Conversões
              </span>
              <span className="font-medium">
                {test.metrics.total_conversions}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Taxa de Conversão
              </span>
              <span className="font-medium">
                {test.metrics.overall_conversion_rate.toFixed(2)}%
              </span>
            </div>
            {test.status === "running" && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Confiança
                </span>
                <span className="font-medium">
                  {test.metrics.confidence_level.toFixed(1)}%
                </span>
              </div>
            )}
            {test.metrics.winner_variant && (
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  Vencedor identificado
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </GlassCard>
    </motion.div>
  );
}
