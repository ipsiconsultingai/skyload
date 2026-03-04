import type { ReportPlan, ReportSection } from "@/libs/report/types";

import styles from "./report.module.css";
import { ReportPage } from "./ReportPage";

interface ReportTableOfContentsProps {
  sections: ReportSection[];
  plan?: ReportPlan;
  studentName?: string;
}

interface PartDefinition {
  partNumber: string;
  partTitle: string;
  sectionIds: string[];
}

const PART_DEFINITIONS: Record<string, PartDefinition[]> = {
  lite: [
    {
      partNumber: "PART 1",
      partTitle: "종합 진단",
      sectionIds: ["overview", "summary"],
    },
    {
      partNumber: "PART 2",
      partTitle: "세부 분석",
      sectionIds: [
        "subjectAnalysis",
        "academic",
        "weakness",
        "researchTopics",
        "interview",
      ],
    },
    {
      partNumber: "PART 3",
      partTitle: "입시 전략",
      sectionIds: ["universityStrategy"],
    },
  ],
  standard: [
    {
      partNumber: "PART 1",
      partTitle: "종합 진단",
      sectionIds: ["overview", "summary"],
    },
    {
      partNumber: "PART 2",
      partTitle: "세부 분석",
      sectionIds: [
        "subjectAnalysis",
        "academic",
        "weakness",
        "researchTopics",
        "interview",
      ],
    },
    {
      partNumber: "PART 3",
      partTitle: "입시 전략",
      sectionIds: ["universityStrategy"],
    },
  ],
  premium: [
    {
      partNumber: "PART 1",
      partTitle: "종합 진단",
      sectionIds: ["overview", "summary"],
    },
    {
      partNumber: "PART 2",
      partTitle: "정밀 분석",
      sectionIds: [
        "subjectAnalysis",
        "storyAnalysis",
        "academic",
        "weakness",
        "researchTopics",
        "interview",
      ],
    },
    {
      partNumber: "PART 3",
      partTitle: "입시 전략 & 로드맵",
      sectionIds: ["universityStrategy", "supplement", "careerPath", "roadmap"],
    },
  ],
};

export const ReportTableOfContents = ({
  sections,
  plan = "lite",
  studentName,
}: ReportTableOfContentsProps) => {
  const parts = PART_DEFINITIONS[plan] ?? PART_DEFINITIONS.lite;

  const sectionMap = new Map<
    string,
    { section: ReportSection; globalIndex: number }
  >(sections.map((s, i) => [s.sectionId, { section: s, globalIndex: i }]));

  return (
    <ReportPage
      sectionTitle="목차"
      studentName={studentName}
      showWatermark={false}
    >
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <span className={styles.sectionTitle}>목차</span>
          </div>
        </div>

        {parts.map((part) => {
          const partSections = part.sectionIds
            .map((id) => sectionMap.get(id))
            .filter(Boolean);

          if (partSections.length === 0) {
            return null;
          }

          return (
            <div key={part.partNumber} className={styles.tocPart}>
              <div className={styles.tocPartHeader}>
                <span className={styles.tocPartNumber}>{part.partNumber}</span>
                <span className={styles.tocPartTitle}>{part.partTitle}</span>
              </div>
              {partSections.map((item) => {
                if (!item) return null;
                const { section, globalIndex } = item;
                return (
                  <div key={section.sectionId} className={styles.tocItem}>
                    <span className={styles.tocNumber}>
                      {String(globalIndex + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.tocTitle}>{section.title}</span>
                    <span className={styles.tocDots} />
                    <span className={styles.tocPage}>{globalIndex + 3}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </ReportPage>
  );
};
