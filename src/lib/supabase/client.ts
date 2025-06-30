import { createBrowserClient } from "@supabase/ssr";
import { Database } from "../types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Função para verificar se estamos no cliente
const isClient = typeof window !== "undefined";

// Durante o build ou server-side, usar valores padrão seguros
const safeSupabaseUrl = supabaseUrl || "https://placeholder.supabase.co";
const safeSupabaseKey = supabaseKey || "placeholder-key";

// Só validar no cliente onde as variáveis devem estar disponíveis
if (isClient && (!supabaseUrl || !supabaseKey)) {
  console.warn(
    "Missing Supabase environment variables. Please check your .env.local file."
  );
}

export const createClient = () => {
  // Se não estamos no cliente, retornar um cliente "dummy" para build
  if (!isClient) {
    return createBrowserClient<Database>(safeSupabaseUrl, safeSupabaseKey);
  }

  return createBrowserClient<Database>(safeSupabaseUrl, safeSupabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
};
