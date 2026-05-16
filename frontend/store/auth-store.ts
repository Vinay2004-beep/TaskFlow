"use client";

import { create } from "zustand";
import { api } from "@/services/api";
import type { User } from "@/types";

type AuthState = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  bootstrap: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  bootstrap: async () => {
    try {
      const { data } = await api.get<User>("/auth/me");
      set({ user: data, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
  logout: async () => {
    await api.post("/auth/logout", { refreshToken: localStorage.getItem("refreshToken") }).catch(() => null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ user: null });
  }
}));
