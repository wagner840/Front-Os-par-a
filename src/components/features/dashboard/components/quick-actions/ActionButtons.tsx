"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Plus } from "lucide-react";

interface Action {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  action: () => void;
}

interface ActionButtonsProps {
  actions: Action[];
}

export function ActionButtons({ actions }: ActionButtonsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {actions.map((action, index) => (
        <motion.div
          key={action.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <GlassCard
            variant="default"
            className="p-4 cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={action.action}
          >
            <div className="flex items-start gap-4">
              <div
                className={`
                w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} 
                flex items-center justify-center flex-shrink-0
              `}
              >
                <action.icon className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1">
                <h3 className="font-medium text-white mb-1">{action.title}</h3>
                <p className="text-sm text-white/60">{action.description}</p>
              </div>

              <Plus className="w-5 h-5 text-white/40 flex-shrink-0" />
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
