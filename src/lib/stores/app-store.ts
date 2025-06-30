import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

interface AppState {
  // Auth State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // UI State
  sidebarCollapsed: boolean;
  theme: "light" | "dark" | "system";

  // Data State
  selectedBlog: string | null;
  selectedBlogId: string | null; // Alias for compatibility

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setSelectedBlog: (blogId: string | null) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Initial State
        user: null,
        isAuthenticated: false,
        isLoading: true,
        sidebarCollapsed: false,
        theme: "system",
        selectedBlog: null,
        get selectedBlogId() {
          return this.selectedBlog;
        },

        // Actions
        setUser: (user) =>
          set({
            user,
            isAuthenticated: !!user,
            isLoading: false,
          }),

        setLoading: (isLoading) => set({ isLoading }),

        setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),

        setTheme: (theme) => set({ theme }),

        setSelectedBlog: (selectedBlog) => set({ selectedBlog }),

        logout: () =>
          set({
            user: null,
            isAuthenticated: false,
            selectedBlog: null,
          }),
      }),
      {
        name: "app-storage",
        partialize: (state) => ({
          sidebarCollapsed: state.sidebarCollapsed,
          theme: state.theme,
          selectedBlog: state.selectedBlog,
        }),
      }
    ),
    { name: "app-store" }
  )
);
