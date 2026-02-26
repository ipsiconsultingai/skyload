import { createStore } from "zustand/vanilla";
import type { User } from "@supabase/supabase-js";

export interface AuthState {
  user: User | null;
  role: string | null;
  onboardingCompleted: boolean;
  isAuthModalOpen: boolean;
  setUser: (user: User | null) => void;
  setRole: (role: string | null) => void;
  setOnboardingCompleted: (completed: boolean) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

export type AuthStore = ReturnType<typeof createAuthStore>;

export const createAuthStore = () =>
  createStore<AuthState>((set) => ({
    user: null,
    role: null,
    onboardingCompleted: false,
    isAuthModalOpen: false,
    setUser: (user) => set({ user }),
    setRole: (role) => set({ role }),
    setOnboardingCompleted: (completed) =>
      set({ onboardingCompleted: completed }),
    openAuthModal: () => set({ isAuthModalOpen: true }),
    closeAuthModal: () => set({ isAuthModalOpen: false }),
  }));
