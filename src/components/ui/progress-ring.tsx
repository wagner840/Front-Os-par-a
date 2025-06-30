"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  variant?: "default" | "success" | "warning" | "danger" | "rainbow";
  showValue?: boolean;
  label?: string;
  duration?: number;
  glow?: boolean;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  className,
  variant = "default",
  showValue = true,
  label,
  duration = 2,
  glow = false,
}: ProgressRingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedProgress / 100) * circumference;

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setAnimatedProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isInView, progress]);

  const variants = {
    default: {
      stroke: "url(#gradient-blue)",
      background: "#e5e7eb",
    },
    success: {
      stroke: "url(#gradient-green)",
      background: "#e5e7eb",
    },
    warning: {
      stroke: "url(#gradient-yellow)",
      background: "#e5e7eb",
    },
    danger: {
      stroke: "url(#gradient-red)",
      background: "#e5e7eb",
    },
    rainbow: {
      stroke: "url(#gradient-rainbow)",
      background: "#e5e7eb",
    },
  };

  return (
    <motion.div
      ref={ref}
      className={cn("relative inline-flex flex-col items-center", className)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <svg
          width={size}
          height={size}
          className={cn("transform -rotate-90", glow && "drop-shadow-lg")}
        >
          <defs>
            {/* Gradientes */}
            <linearGradient
              id="gradient-blue"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient
              id="gradient-green"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
            <linearGradient
              id="gradient-yellow"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            <linearGradient
              id="gradient-red"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#f87171" />
            </linearGradient>
            <linearGradient
              id="gradient-rainbow"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="33%" stopColor="#8b5cf6" />
              <stop offset="66%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>

            {/* Filtro de brilho */}
            {glow && (
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            )}
          </defs>

          {/* Círculo de fundo */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={variants[variant].background}
            strokeWidth={strokeWidth}
            fill="transparent"
            className="opacity-20"
          />

          {/* Círculo de progresso */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={variants[variant].stroke}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            filter={glow ? "url(#glow)" : undefined}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{
              duration,
              ease: "easeInOut",
            }}
          />
        </svg>

        {/* Valor central */}
        {showValue && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <motion.span
              className="text-2xl font-bold text-gray-900 dark:text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {Math.round(animatedProgress)}%
            </motion.span>
          </motion.div>
        )}
      </div>

      {/* Label */}
      {label && (
        <motion.p
          className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.3 }}
        >
          {label}
        </motion.p>
      )}
    </motion.div>
  );
}

// Componente para múltiplos anéis de progresso
interface ProgressRingGroupProps {
  rings: Array<{
    id: string;
    progress: number;
    label: string;
    variant?: "default" | "success" | "warning" | "danger" | "rainbow";
  }>;
  size?: number;
  className?: string;
}

export function ProgressRingGroup({
  rings,
  size = 100,
  className,
}: ProgressRingGroupProps) {
  return (
    <div className={cn("flex flex-wrap gap-6 justify-center", className)}>
      {rings.map((ring, index) => (
        <motion.div
          key={ring.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <ProgressRing
            progress={ring.progress}
            label={ring.label}
            variant={ring.variant}
            size={size}
            glow={true}
          />
        </motion.div>
      ))}
    </div>
  );
}
