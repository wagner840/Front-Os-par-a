"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useSupabase } from "@/lib/hooks/use-supabase";
import { Toaster } from "sonner";
import { setupErrorHandlers } from "@/lib/chunk-error-handler";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 2,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // Configurar handlers de erro e suppressão de warnings
  useEffect(() => {
    try {
      setupErrorHandlers();
    } catch (error) {
      console.warn("Erro ao configurar handlers:", error);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#374151",
            },
            className: "glass-toast",
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize Supabase auth
  const [authMounted, setAuthMounted] = useState(false);

  useEffect(() => {
    setAuthMounted(true);
  }, []);

  if (!authMounted) {
    return <>{children}</>;
  }

  return <AuthProviderInner>{children}</AuthProviderInner>;
}

function AuthProviderInner({ children }: { children: React.ReactNode }) {
  try {
    useSupabase();
  } catch (error) {
    console.warn("Erro no useSupabase:", error);
  }

  return <>{children}</>;
}
