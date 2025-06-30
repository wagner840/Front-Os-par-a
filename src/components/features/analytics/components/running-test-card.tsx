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
import { Button } from "@/components/ui/button";
import {
  TestTube2 as TestTube,
  Pause,
  RotateCcw,
  BarChart3,
} from "lucide-react";
import type {
  ABTest,
  ABTestVariant,
} from "@/lib/hooks/use-ab-testing-dashboard";

interface RunningTestCardProps {
  test: ABTest;
  index: number;
  calculateImprovement: (
    control: ABTestVariant,
    variant: ABTestVariant
  ) => number;
}

export function RunningTestCard({
  test,
  index,
  calculateImprovement,
}: RunningTestCardProps) {
  return (
    <motion.div
      key={test.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <GlassCard>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                {test.name}
              </CardTitle>
              <CardDescription>{test.description}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Pause className="h-4 w-4 mr-2" />
                Pausar
              </Button>
              <Button variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reiniciar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {test.variants.map((variant) => {
              const control = test.variants.find((v) => v.is_control);
              const improvement =
                control && !variant.is_control
                  ? calculateImprovement(control, variant)
                  : 0;

              return (
                <div
                  key={variant.id}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{variant.name}</h4>
                    {variant.is_control ? (
                      <Badge variant="outline">Controle</Badge>
                    ) : improvement > 0 ? (
                      <Badge variant="default" className="bg-green-500">
                        +{improvement.toFixed(1)}%
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        {improvement.toFixed(1)}%
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {variant.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Visitantes:</span>
                      <span className="font-medium">
                        {variant.visitors.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversões:</span>
                      <span className="font-medium">{variant.conversions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa de Conversão:</span>
                      <span className="font-medium">
                        {variant.conversion_rate.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tráfego:</span>
                      <span className="font-medium">
                        {variant.traffic_percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-600 dark:text-blue-400">
                Status Estatístico
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  Confiança:
                </span>
                <div className="font-medium">
                  {test.metrics.confidence_level.toFixed(1)}%
                </div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  Significância:
                </span>
                <div className="font-medium">
                  {test.metrics.statistical_significance ? "Sim" : "Não"}
                </div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  Amostra Mín.:
                </span>
                <div className="font-medium">
                  {test.minimum_sample_size.toLocaleString()}
                </div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  Progresso:
                </span>
                <div className="font-medium">
                  {test.minimum_sample_size > 0
                    ? Math.round(
                        (test.metrics.total_visitors /
                          test.minimum_sample_size) *
                          100
                      )
                    : 0}
                  %
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </GlassCard>
    </motion.div>
  );
}
