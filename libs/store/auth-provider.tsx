"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useStore } from "zustand";

import { createClient } from "@/libs/supabase/client";

import { createAuthStore, type AuthState, type AuthStore } from "./auth-store";

const AuthStoreContext = createContext<AuthStore | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<AuthStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = createAuthStore();
  }

  useEffect(() => {
    const supabase = createClient();

    const fetchOnboardingStatus = async (userId: string) => {
      const { data } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", userId)
        .single();
      storeRef.current
        ?.getState()
        .setOnboardingCompleted(data?.onboarding_completed ?? false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      storeRef.current?.getState().setUser(session?.user ?? null);
      if (session?.user) {
        fetchOnboardingStatus(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      storeRef.current?.getState().setUser(session?.user ?? null);
      if (session?.user) {
        fetchOnboardingStatus(session.user.id);
      } else {
        storeRef.current?.getState().setOnboardingCompleted(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthStoreContext.Provider value={storeRef.current}>
      {children}
    </AuthStoreContext.Provider>
  );
};

export const useAuthStore = <T,>(selector: (state: AuthState) => T): T => {
  const store = useContext(AuthStoreContext);
  if (!store) {
    throw new Error("useAuthStore must be used within AuthProvider");
  }
  return useStore(store, selector);
};
