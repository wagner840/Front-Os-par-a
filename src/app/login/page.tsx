"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Sparkles,
  AlertCircle,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      setLoading(false);
      return;
    }

    // Validação específica para o usuário autorizado
    if (email.trim() !== "contatopawa@gmail.com") {
      setError("Acesso negado. Usuário não autorizado.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email: email.trim(),
          password: password,
        }
      );

      clearTimeout(timeoutId);

      if (authError) {
        console.error("Erro de autenticação:", authError);

        // Mensagens de erro mais amigáveis
        if (authError.message.includes("Invalid login credentials")) {
          setError("Email ou senha incorretos. Verifique suas credenciais.");
        } else if (authError.message.includes("Email not confirmed")) {
          setError("Email não confirmado. Verifique sua caixa de entrada.");
        } else if (authError.message.includes("Too many requests")) {
          setError("Muitas tentativas. Tente novamente em alguns minutos.");
        } else {
          setError("Erro ao fazer login. Verifique suas credenciais.");
        }
        return;
      }

      if (data?.user) {
        toast.success("Bem-vindo ao Content Hub!");
        // Use replace instead of push to avoid back button issues
        router.replace("/");
      }
    } catch (err) {
      console.error("Erro inesperado:", err);
      setError("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />

      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 bg-blue-400/20 rounded-full blur-xl"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-20 right-20 w-40 h-40 bg-green-400/20 rounded-full blur-xl"
        animate={{
          y: [0, 15, 0],
          x: [0, -10, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-40 right-40 w-24 h-24 bg-purple-400/15 rounded-full blur-xl"
        animate={{
          y: [0, -10, 0],
          x: [0, 15, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <GlassCard
          variant="default"
          className="p-8 space-y-6 backdrop-blur-xl bg-white/5 border-white/10"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/25"
            >
              <Zap className="w-10 h-10 text-white" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent mb-2">
                Content Hub
              </h1>
              <p className="text-white/80 text-base font-medium">
                Sistema Avançado de Gestão de Conteúdo
              </p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <p className="text-white/60 text-sm">
                  WordPress Integration • SEO Analytics • Content AI
                </p>
              </div>
            </motion.div>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 backdrop-blur-sm"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-200 text-sm font-medium">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <motion.form
            onSubmit={handleLogin}
            className="space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/90 font-medium">
                Email Autorizado
              </Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5 transition-colors group-focus-within:text-blue-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="contatopawa@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-blue-400/50 focus:ring-blue-400/25 rounded-xl transition-all duration-300 focus:bg-white/15"
                  autoComplete="email"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/90 font-medium">
                Senha de Acesso
              </Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5 transition-colors group-focus-within:text-blue-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-12 bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-blue-400/50 focus:ring-blue-400/25 rounded-xl transition-all duration-300 focus:bg-white/15"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors p-1"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              <AnimatedButton
                type="submit"
                variant="primary"
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Entrando...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Entrar no Sistema
                  </div>
                )}
              </AnimatedButton>
            </motion.div>
          </motion.form>

          {/* Footer */}
          <motion.div
            className="text-center pt-4 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-white/50 text-xs">
              Sistema exclusivo para gestão de conteúdo WordPress
            </p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <div className="w-1 h-1 bg-blue-400 rounded-full" />
              <div className="w-1 h-1 bg-purple-400 rounded-full" />
              <div className="w-1 h-1 bg-green-400 rounded-full" />
            </div>
          </motion.div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
