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
import type {
  ABTest,
  ABTestVariant,
} from "@/lib/hooks/use-ab-testing-dashboard";

interface CompletedTestCardProps {
  test: ABTest;
  index: number;
  calculateImprovement: (
    control: ABTestVariant,
    variant: ABTestVariant
  ) => number;
}

export function CompletedTestCard({
  test,
  index,
  calculateImprovement,
}: CompletedTestCardProps) {
  return (
    <motion.div
      key={test.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <GlassCard>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                {test.name}
              </CardTitle>
              <CardDescription>{test.description}</CardDescription>
            </div>
            {test.metrics.winner_variant && (
              <Badge variant="default" className="bg-green-500">
                Vencedor:{" "}
                {
                  test.variants.find(
                    (v) => v.id === test.metrics.winner_variant
                  )?.name
                }
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Resultados Finais</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total de Visitantes:</span>
                  <span className="font-medium">
                    {test.metrics.total_visitors.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total de Conversões:</span>
                  <span className="font-medium">
                    {test.metrics.total_conversions}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de Conversão:</span>
                  <span className="font-medium">
                    {test.metrics.overall_conversion_rate.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Confiança:</span>
                  <span className="font-medium">
                    {test.metrics.confidence_level.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-medium mb-2">Comparação de Variantes</h4>
              <div className="space-y-3">
                {test.variants.map((variant) => {
                  const control = test.variants.find((v) => v.is_control);
                  const improvement =
                    control && !variant.is_control
                      ? calculateImprovement(control, variant)
                      : 0;
                  const isWinner = test.metrics.winner_variant === variant.id;

                  return (
                    <div
                      key={variant.id}
                      className={`p-3 rounded-lg border ${
                        isWinner
                          ? "border-green-300 bg-green-50/50 dark:border-green-700 dark:bg-green-900/20"
                          : "border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{variant.name}</span>
                          {isWinner && (
                            <Award className="inline h-4 w-4 text-yellow-500 ml-2" />
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {variant.conversion_rate.toFixed(2)}%
                          </div>
                          {!variant.is_control && (
                            <div
                              className={`text-sm ${
                                improvement > 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {improvement > 0 ? "+" : ""}
                              {improvement.toFixed(1)}%
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </GlassCard>
    </motion.div>
  );
}
