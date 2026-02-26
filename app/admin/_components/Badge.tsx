import type { ReactNode } from "react";

import styles from "./Badge.module.css";

type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
}

const VARIANT_CLASS_MAP: Record<BadgeVariant, string> = {
  success: styles.badgeSuccess,
  warning: styles.badgeWarning,
  error: styles.badgeError,
  info: styles.badgeInfo,
  neutral: styles.badgeNeutral,
};

export const Badge = ({ variant, children }: BadgeProps) => {
  return (
    <span className={`${styles.badge} ${VARIANT_CLASS_MAP[variant]}`}>
      {children}
    </span>
  );
};
