import { createStore } from "zustand/vanilla";
import type { User } from "@supabase/supabase-js";

export interface AuthState {
  user: User | null;
  onboardingCompleted: boolean;
  isAuthModalOpen: boolean;
  setUser: (user: User | null) => void;
  setOnboardingCompleted: (completed: boolean) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

export type AuthStore = ReturnType<typeof createAuthStore>;

export const createAuthStore = () =>
  createStore<AuthState>((set) => ({
    user: null,
    onboardingCompleted: false,
    isAuthModalOpen: false,
    setUser: (user) => set({ user }),
    setOnboardingCompleted: (completed) =>
      set({ onboardingCompleted: completed }),
    openAuthModal: () => set({ isAuthModalOpen: true }),
    closeAuthModal: () => set({ isAuthModalOpen: false }),
  }));
