/**
 * Authentication Store (Zustand)
 * Author: Ali Sohel <avesohel@gmail.com>
 */
import { create } from "zustand";
import { supabase } from "./supabase";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ user, loading: false }),

  initialize: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      set({ user: session?.user ?? null, loading: false, initialized: true });

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user ?? null, loading: false });
      });
    } catch (error) {
      console.error("Auth initialization error:", error);
      set({ user: null, loading: false, initialized: true });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));
