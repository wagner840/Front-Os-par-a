"use client";

import { useState, useEffect } from "react";
import { User, AuthChangeEvent, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

// Mock user para desenvolvimento quando Supabase não estiver disponível
const createMockUser = (email: string): User => ({
  id: "mock-user-id",
  aud: "authenticated",
  role: "authenticated",
  email,
  email_confirmed_at: new Date().toISOString(),
  phone: "",
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: {
    name: "Demo User",
    avatar_url: undefined,
  },
  identities: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

export function useSupabase() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  useEffect(() => {
    // Verificar se estamos no cliente
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    const testSupabaseConnection = async () => {
      try {
        const supabase = createClient();

        // Teste simples de conectividade
        const { error } = await supabase.auth.getUser();

        if (error && error.message.includes("Failed to fetch")) {
          console.warn("Supabase indisponível, ativando modo offline");
          setIsOfflineMode(true);
          setError("Modo offline ativado - Supabase indisponível");
        } else {
          setIsOfflineMode(false);
          setError(null);
        }
      } catch (err) {
        console.warn("Erro de conectividade, ativando modo offline:", err);
        setIsOfflineMode(true);
        setError("Modo offline ativado - Erro de conectividade");
      } finally {
        setLoading(false);
      }
    };

    testSupabaseConnection();

    // Se não estiver em modo offline, configurar listeners
    if (!isOfflineMode) {
      const supabase = createClient();

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(
        (event: AuthChangeEvent, session: Session | null) => {
          setUser(session?.user ?? null);
          setError(null);
        }
      );

      return () => subscription.unsubscribe();
    }
  }, [isOfflineMode]);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      // Se estiver em modo offline, usar mock
      if (isOfflineMode) {
        console.log("Modo offline: Usando dados mock para login");
        const mockUser = createMockUser(email);
        setUser(mockUser);

        // Simular delay de rede
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return { success: true, user: mockUser };
      }

      // Tentar conexão real com Supabase
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Se for erro de fetch, ativar modo offline
        if (error.message.includes("Failed to fetch")) {
          console.warn("Erro de fetch detectado, ativando modo offline");
          setIsOfflineMode(true);
          const mockUser = createMockUser(email);
          setUser(mockUser);
          setError("Conectado em modo offline");
          return { success: true, user: mockUser };
        }

        console.error("Erro no login:", error.message);
        setError(error.message);
        return { success: false, error: error.message };
      }

      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err: unknown) {
      // Para qualquer erro de conectividade, usar modo offline
      console.warn("Erro de conectividade, usando modo offline:", err);
      setIsOfflineMode(true);
      const mockUser = createMockUser(email);
      setUser(mockUser);
      setError("Conectado em modo offline");
      return { success: true, user: mockUser };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);

      // Se estiver em modo offline, apenas limpar estado local
      if (isOfflineMode) {
        setUser(null);
        setError(null);
        return { success: true };
      }

      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Erro no logout:", error.message);
        setError(error.message);
        return { success: false, error: error.message };
      }

      setUser(null);
      setError(null);
      return { success: true };
    } catch {
      // Em caso de erro, apenas limpar estado local
      setUser(null);
      setError(null);
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    isOfflineMode,
    signInWithEmail,
    signOut,
  };
}
