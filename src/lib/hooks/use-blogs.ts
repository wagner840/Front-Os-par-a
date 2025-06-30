import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../supabase/client";
import { Database } from "../types/database";

type Blog = Database["public"]["Tables"]["blogs"]["Row"];
type BlogInsert = Database["public"]["Tables"]["blogs"]["Insert"];
type BlogUpdate = Database["public"]["Tables"]["blogs"]["Update"];

export function useBlogs() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Blog[];
    },
  });
}

export function useBlog(id: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Blog;
    },
    enabled: !!id,
  });
}

export function useCreateBlog() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blog: BlogInsert) => {
      const { data, error } = await supabase
        .from("blogs")
        .insert(blog)
        .select()
        .single();

      if (error) throw error;
      return data as Blog;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
}

export function useUpdateBlog() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: BlogUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("blogs")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Blog;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog", data.id] });
    },
  });
}

export function useDeleteBlog() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blogs").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
}
