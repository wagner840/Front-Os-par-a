"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "intense" | "subtle" | "rainbow";
  glow?: boolean;
  hover?: boolean;
  blur?: "sm" | "md" | "lg" | "xl";
  border?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  variant = "default",
  glow = false,
  hover = true,
  blur = "md",
  border = true,
  onClick,
  ...props
}: GlassCardProps) {
  const variants = {
    default: "bg-white/10 backdrop-blur-md",
    intense: "bg-white/20 backdrop-blur-lg",
    subtle: "bg-white/5 backdrop-blur-sm",
    rainbow:
      "bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-md",
  };

  const blurClasses = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl",
  };

  const baseClasses = cn(
    "relative overflow-hidden rounded-xl",
    variants[variant],
    blurClasses[blur],
    border && "border border-white/20",
    glow && "shadow-lg shadow-blue-500/25",
    hover &&
      "transition-all duration-300 hover:bg-white/15 hover:shadow-xl hover:shadow-blue-500/30",
    onClick && "cursor-pointer",
    className
  );

  return (
    <motion.div
      className={baseClasses}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { scale: 1.02, y: -5 } : undefined}
      onClick={onClick}
      {...props}
    >
      {/* Efeito de brilho interno */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50" />

      {/* Efeito de reflexo */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/20 opacity-30" />

      {/* Conteúdo */}
      <div className="relative z-10 p-6">{children}</div>

      {/* Efeito de borda brilhante */}
      {glow && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-sm -z-10" />
      )}
    </motion.div>
  );
}
