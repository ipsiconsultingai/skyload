"use client";

import { TrendingDown, TrendingUp, Minus } from "lucide-react";

import styles from "./stat-card.module.css";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  change?: { value: number; type: "increase" | "decrease" | "neutral" };
  suffix?: string;
}

export const StatCard = ({
  label,
  value,
  icon,
  change,
  suffix,
}: StatCardProps) => {
  const changeStyleMap = {
    increase: styles.statChangeUp,
    decrease: styles.statChangeDown,
    neutral: styles.statChangeNeutral,
  };

  const changeIconMap = {
    increase: <TrendingUp size={14} />,
    decrease: <TrendingDown size={14} />,
    neutral: <Minus size={14} />,
  };

  const formatChangeText = (
    changeValue: number,
    changeType: "increase" | "decrease" | "neutral"
  ): string => {
    if (changeType === "neutral") return "변동 없음";
    const prefix = changeType === "increase" ? "+" : "";
    return `${prefix}${changeValue}%`;
  };

  return (
    <div className={styles.statCard}>
      <div className={styles.statHeader}>
        <span className={styles.statLabel}>{label}</span>
        <div className={styles.statIcon}>{icon}</div>
      </div>
      <div className={styles.statBody}>
        <div className={styles.statValueRow}>
          <span className={styles.statValue}>
            {typeof value === "number" ? value.toLocaleString("ko-KR") : value}
          </span>
          {suffix && <span className={styles.statSuffix}>{suffix}</span>}
        </div>
        {change && (
          <span className={changeStyleMap[change.type]}>
            {changeIconMap[change.type]}
            {formatChangeText(change.value, change.type)}
          </span>
        )}
      </div>
    </div>
  );
};
