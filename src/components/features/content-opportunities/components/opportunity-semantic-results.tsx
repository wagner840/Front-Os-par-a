
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

export default function OpportunitySemanticResults({
  semanticResults,
  setShowSemanticResults,
}) {
  return (
    <GlassCard>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">
            Resultados da Busca Semântica
          </h3>
          <Badge variant="outline" className="ml-auto">
            {semanticResults.length} encontrados
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSemanticResults(false)}
          >
            Fechar
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {semanticResults.map((result: any) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded border border-white/10 bg-white/5"
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  {result.type}
                </Badge>
                <div className="text-xs text-purple-400">
                  {Math.round(result.similarity * 100)}% similar
                </div>
              </div>
              <h5 className="font-medium text-white text-sm mb-1">
                {result.title}
              </h5>
              {result.description && (
                <p className="text-xs text-white/60 line-clamp-2">
                  {result.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
