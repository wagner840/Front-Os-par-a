"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface FloatingOrbProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "blue" | "purple" | "pink" | "green" | "yellow" | "rainbow";
  opacity?: number;
  blur?: boolean;
  animate?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function FloatingOrb({
  size = "md",
  color = "blue",
  opacity = 0.6,
  blur = true,
  animate = true,
  className = "",
  style = {},
}: FloatingOrbProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sizes = {
    sm: "w-12 h-12",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-48 h-48",
  };

  const colors = {
    blue: "bg-gradient-to-br from-blue-400 to-cyan-400",
    purple: "bg-gradient-to-br from-purple-400 to-pink-400",
    pink: "bg-gradient-to-br from-pink-400 to-rose-400",
    green: "bg-gradient-to-br from-green-400 to-emerald-400",
    yellow: "bg-gradient-to-br from-yellow-400 to-orange-400",
    rainbow: "bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400",
  };

  // Animações aleatórias
  const getRandomAnimation = () => ({
    x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
    y: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
    rotate: [0, Math.random() * 360, Math.random() * 360, 0],
  });

  if (!mounted) return null;

  return (
    <motion.div
      className={`
        absolute rounded-full pointer-events-none
        ${sizes[size]}
        ${colors[color]}
        ${blur ? "blur-sm" : ""}
        ${className}
      `}
      style={{
        opacity,
        ...style,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={
        animate
          ? {
              opacity: [opacity * 0.3, opacity, opacity * 0.5, opacity],
              scale: [0.8, 1.2, 0.9, 1],
              ...getRandomAnimation(),
            }
          : { opacity, scale: 1 }
      }
      transition={{
        duration: Math.random() * 10 + 15, // 15-25 segundos
        repeat: Infinity,
        ease: "easeInOut",
        delay: Math.random() * 5, // Delay aleatório de 0-5 segundos
      }}
    >
      {/* Brilho interno */}
      <div className="absolute inset-2 rounded-full bg-white/30 blur-sm" />

      {/* Reflexo */}
      <div className="absolute top-2 left-2 w-1/3 h-1/3 rounded-full bg-white/50 blur-xs" />
    </motion.div>
  );
}

// Componente para múltiplas orbs
interface FloatingOrbsProps {
  count?: number;
  colors?: Array<"blue" | "purple" | "pink" | "green" | "yellow" | "rainbow">;
  sizes?: Array<"sm" | "md" | "lg" | "xl">;
  className?: string;
}

export function FloatingOrbs({
  count = 6,
  colors = ["blue", "purple", "pink", "green"],
  sizes = ["sm", "md", "lg"],
  className = "",
}: FloatingOrbsProps) {
  const [orbs, setOrbs] = useState<
    Array<{
      id: number;
      color: string;
      size: string;
      position: { top: string; left: string };
      delay: number;
    }>
  >([]);

  useEffect(() => {
    const newOrbs = Array.from({ length: count }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: sizes[Math.floor(Math.random() * sizes.length)],
      position: {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      },
      delay: Math.random() * 5,
    }));
    setOrbs(newOrbs);
  }, [count, colors, sizes]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {orbs.map((orb) => (
        <FloatingOrb
          key={orb.id}
          color={
            orb.color as
              | "blue"
              | "purple"
              | "pink"
              | "green"
              | "yellow"
              | "rainbow"
          }
          size={orb.size as "sm" | "md" | "lg" | "xl"}
          style={{
            top: orb.position.top,
            left: orb.position.left,
          }}
          animate={true}
        />
      ))}
    </div>
  );
}
