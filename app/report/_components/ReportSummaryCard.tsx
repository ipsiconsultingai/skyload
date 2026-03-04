import type { ReportPlan } from "@/libs/report/types";

import styles from "./report.module.css";

interface Keyword {
  label: string;
  description: string;
}

interface ReportSummaryCardProps {
  oneLiner: string;
  keywords: Keyword[];
  plan?: ReportPlan;
}

export const ReportSummaryCard = ({
  oneLiner,
  keywords,
  plan,
}: ReportSummaryCardProps) => {
  const isPremium = plan === "premium";

  return (
    <div>
      {/* Large quote-style one-liner */}
      <div
        className={isPremium ? styles.verdictPremium : styles.cardAccent}
        style={
          isPremium
            ? undefined
            : {
                padding: "24px",
                borderLeftWidth: "4px",
              }
        }
      >
        {isPremium && (
          <div className={styles.verdictPremiumTitle}>한줄 총평</div>
        )}
        <p
          className={`${styles.body} ${styles.fontOneLiner}`}
          style={{ fontWeight: isPremium ? 400 : 500 }}
        >
          {oneLiner}
        </p>
      </div>

      {/* 3-column keyword cards */}
      <div className={`${styles.cardGridThree} ${styles.mt20}`}>
        {keywords.map((kw) => (
          <div key={kw.label} className={styles.cardHighlight}>
            <div className={`${styles.cardTitle} ${styles.mb8}`}>
              {kw.label}
            </div>
            <p className={styles.small}>{kw.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
