import type { StudentProfileSection } from "@/libs/report/types";

import styles from "./report.module.css";
import { SectionHeader } from "./SectionHeader";

interface StudentProfileRendererProps {
  data: StudentProfileSection;
  sectionNumber: number;
}

const CATEGORY_LABEL: Record<string, string> = {
  academic: "학업 역량",
  career: "진로 역량",
  community: "공동체 역량",
  growth: "발전 가능성",
};

export const StudentProfileRenderer = ({
  data,
  sectionNumber,
}: StudentProfileRendererProps) => {
  const radarEntries = Object.entries(data.radarChart) as [string, number][];

  return (
    <div className={styles.section}>
      <SectionHeader number={sectionNumber} title={data.title} />

      {/* Type card */}
      <div className={styles.cardAccent}>
        <div className={styles.cardHeader}>
          <div className={styles.h2}>{data.typeName}</div>
        </div>
        <p className={styles.body}>{data.typeDescription}</p>
      </div>

      {/* Radar chart as 2x2 stat card grid */}
      <div className={`${styles.h3} ${styles.mt24} ${styles.mb12}`}>
        역량 프로필
      </div>
      <div className={styles.cardGrid}>
        {radarEntries.map(([key, value]) => (
          <div key={key} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                {CATEGORY_LABEL[key] ?? key}
              </div>
            </div>
            <div className={styles.statCardLargeValue}>{value}</div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${value}%` }}
              />
            </div>
            <div className={styles.small}>/100</div>
          </div>
        ))}
      </div>

      {/* Tags */}
      <div className={`${styles.tagGroup} ${styles.mt20}`}>
        {data.tags.map((tag) => (
          <span key={tag} className={styles.tagAccent}>
            {tag}
          </span>
        ))}
      </div>

      {/* Catch phrase */}
      <div className={`${styles.cardHighlight} ${styles.mt16}`}>
        <span className={styles.emphasis}>{data.catchPhrase}</span>
      </div>
    </div>
  );
};
