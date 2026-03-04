"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { useAuthStore } from "@/libs/store/auth-provider";

interface CtaButtonProps {
  children: ReactNode;
  className?: string;
  plan?: string;
}

export const CtaButton = ({ children, className, plan }: CtaButtonProps) => {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);

  const handleClick = () => {
    if (user) {
      router.push(plan ? `/checkout?plan=${plan}` : "/record");
    } else {
      openAuthModal();
    }
  };

  return (
    <button type="button" className={className} onClick={handleClick}>
      {children}
    </button>
  );
};
