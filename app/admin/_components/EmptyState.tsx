import { Users } from "lucide-react";
import type { ReactNode } from "react";

import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
}

export const EmptyState = ({ icon, title, description }: EmptyStateProps) => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>{icon ?? <Users size={40} />}</div>
      <p className={styles.emptyTitle}>{title}</p>
      {description && <p className={styles.emptyDesc}>{description}</p>}
    </div>
  );
};
