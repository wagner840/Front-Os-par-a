
import { Lightbulb } from "lucide-react";

export default function OpportunityHeader() {
  return (
    <div className="flex items-center gap-3">
      <Lightbulb className="w-8 h-8 text-yellow-400" />
      <div>
        <h1 className="text-2xl font-bold text-white">
          Content Opportunities
        </h1>
        <p className="text-white/60">
          Oportunidades de conteúdo baseadas em categories e clusters de
          keywords
        </p>
      </div>
    </div>
  );
}
