"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { NicheStatistics } from "@/lib/types/analytics";

const supabase = createClient();

export function useNicheStatistics() {
  return useQuery({
    queryKey: ["niche-statistics"],
    queryFn: async (): Promise<NicheStatistics[]> => {
      const { data, error } = await supabase.rpc("get_niche_statistics");

      if (error) throw error;
      return data || [];
    },
    staleTime: 15 * 60 * 1000, // 15 minutos
  });
}
