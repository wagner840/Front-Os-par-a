"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface AnimatedButtonProps {
  children: ReactNode;
  className?: string;
  variant?:
    | "primary"
    | "secondary"
    | "glass"
    | "rainbow"
    | "success"
    | "danger"
    | "ghost"
    | "outline";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  disabled?: boolean;
  glow?: boolean;
  ripple?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function AnimatedButton({
  children,
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  glow = false,
  ripple = true,
  onClick,
  type = "button",
  ...props
}: AnimatedButtonProps) {
  const variants = {
    primary:
      "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25",
    secondary:
      "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25",
    glass:
      "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20",
    rainbow:
      "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25",
    success:
      "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25",
    danger:
      "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25",
    ghost:
      "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl",
  };

  const baseClasses = cn(
    "relative overflow-hidden rounded-lg font-medium transition-all duration-300",
    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent",
    "active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
    variants[variant],
    sizes[size],
    glow && "shadow-xl hover:shadow-2xl",
    className
  );

  return (
    <motion.button
      className={baseClasses}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={!disabled && !loading ? { scale: 1.05, y: -2 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.95 } : undefined}
      {...props}
    >
      {/* Efeito de brilho animado */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeInOut",
        }}
      />

      {/* Efeito ripple */}
      {ripple && (
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-lg"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}

      {/* Conteúdo */}
      <div className="relative z-10 flex items-center justify-center gap-2">
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </div>

      {/* Efeito de borda brilhante */}
      {glow && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 blur-sm -z-10" />
      )}
    </motion.button>
  );
}
