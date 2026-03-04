import type { CompetencyCategory, WordCloudSection } from "@/libs/report/types";

import styles from "./report.module.css";
import { SectionHeader } from "./SectionHeader";

interface WordCloudRendererProps {
  data: WordCloudSection;
  sectionNumber: number;
}

const CATEGORY_TAG_CLASS: Record<CompetencyCategory, string> = {
  academic: styles.tagAccent,
  career: styles.tagStrength,
  community: styles.tagTrendUp,
  growth: styles.tag,
};

const CATEGORY_COLOR: Record<CompetencyCategory, string> = {
  academic: "var(--report-accent)",
  career: "var(--report-strength)",
  community: "var(--report-caution)",
  growth: "var(--strategy-reach)",
};

export const WordCloudRenderer = ({
  data,
  sectionNumber,
}: WordCloudRendererProps) => {
  const sortedWords = [...data.words].sort((a, b) => b.frequency - a.frequency);
  const maxFrequency = Math.max(...data.words.map((w) => w.frequency));
  const minFrequency = Math.min(...data.words.map((w) => w.frequency));
  const range = maxFrequency - minFrequency || 1;

  const getFontSize = (frequency: number): number => {
    const normalized = (frequency - minFrequency) / range;
    return 0.75 + normalized * 1.5;
  };

  const getOpacity = (frequency: number): number => {
    const normalized = (frequency - minFrequency) / range;
    return 0.5 + normalized * 0.5;
  };

  return (
    <div className={styles.section}>
      <SectionHeader
        number={sectionNumber}
        title={data.title}
        subtitle="생기부에서 자주 등장하는 핵심 키워드입니다"
      />

      {/* Word cloud as tag cluster */}
      <div className={styles.tagGroup} style={{ justifyContent: "center" }}>
        {sortedWords.map((word) => (
          <span
            key={word.text}
            className={
              word.category
                ? CATEGORY_TAG_CLASS[word.category]
                : styles.tagAccent
            }
            style={{
              fontSize: `${getFontSize(word.frequency)}rem`,
              color: word.category
                ? CATEGORY_COLOR[word.category]
                : "var(--report-accent)",
              opacity: getOpacity(word.frequency),
              fontWeight:
                word.frequency > (maxFrequency + minFrequency) / 2 ? 600 : 400,
            }}
          >
            {word.text}
          </span>
        ))}
      </div>

      {/* Legend */}
      <div className={styles.chartLegend}>
        <span className={styles.chartLegendItem}>
          <span
            className={styles.chartLegendDot}
            style={{ background: "var(--report-accent)" }}
          />
          학업
        </span>
        <span className={styles.chartLegendItem}>
          <span
            className={styles.chartLegendDot}
            style={{ background: "var(--report-strength)" }}
          />
          진로
        </span>
        <span className={styles.chartLegendItem}>
          <span
            className={styles.chartLegendDot}
            style={{ background: "var(--report-caution)" }}
          />
          공동체
        </span>
        <span className={styles.chartLegendItem}>
          <span
            className={styles.chartLegendDot}
            style={{ background: "var(--strategy-reach)" }}
          />
          성장
        </span>
      </div>
    </div>
  );
};
