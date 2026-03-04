import { SECTION_ORDER } from "@/libs/report/types";
import type { ReportContent, ReportSection } from "@/libs/report/types";

import {
  PartPage,
  ReportCover,
  ReportPage,
  ReportTableOfContents,
} from "../_components";
import styles from "../_components/report.module.css";
import { SectionRenderer } from "./SectionRenderer";

interface LiteReportProps {
  data: ReportContent;
}

const PART_CONFIG = [
  {
    partNumber: "PART 1",
    title: "진단",
    description:
      "생기부 전체를 기반으로 한 학생 유형 분류, 역량 점수, 합격 예측",
    sectionIds: [
      "studentProfile",
      "competencyScore",
      "admissionPrediction",
      "diagnostic",
    ],
  },
  {
    partNumber: "PART 2",
    title: "분석",
    description:
      "역량별 평가, 성적 분석, 권장과목 이수, 출결, 창체 활동, 세특 분석",
    sectionIds: [
      "competencyEvaluation",
      "academicAnalysis",
      "courseAlignment",
      "attendanceAnalysis",
      "activityAnalysis",
      "subjectAnalysis",
    ],
  },
  {
    partNumber: "PART 3",
    title: "전략",
    description: "부족한 부분 보완 전략, 세특 주제 추천, 입시 전략",
    sectionIds: [
      "weaknessAnalysis",
      "topicRecommendation",
      "admissionStrategy",
      "directionGuide",
    ],
  },
  {
    partNumber: "부록",
    title: "부록",
    description: "워드 클라우드",
    sectionIds: ["wordCloud"],
  },
];

export const LiteReport = ({ data }: LiteReportProps) => {
  const { meta, sections } = data;
  const order = SECTION_ORDER.lite;

  const sectionMap = new Map<string, ReportSection>(
    sections.map((s) => [s.sectionId, s])
  );

  let globalSectionNum = 0;
  let pageNum = 3;

  return (
    <div className={styles.report}>
      <div className={styles.reportWrapper}>
        <ReportCover meta={meta} />
        <ReportTableOfContents
          sections={order
            .map((id) => sectionMap.get(id))
            .filter((s): s is ReportSection => s !== undefined)}
          plan="lite"
          studentName={meta.studentInfo.name}
        />

        {PART_CONFIG.map((part) => {
          const partSections = part.sectionIds
            .map((id) => sectionMap.get(id))
            .filter((s): s is ReportSection => s !== undefined);

          if (partSections.length === 0) return null;

          const partSectionList = partSections.map((s) => {
            globalSectionNum++;
            return {
              section: s,
              num: globalSectionNum,
            };
          });

          return (
            <div key={part.partNumber}>
              <PartPage
                partNumber={part.partNumber}
                title={part.title}
                description={part.description}
                sections={partSectionList.map((item) => ({
                  number: String(item.num).padStart(2, "0"),
                  title: item.section.title,
                }))}
              />

              {partSectionList.map((item) => (
                <ReportPage
                  key={item.section.sectionId}
                  pageNumber={++pageNum}
                  sectionTitle={item.section.title}
                  studentName={meta.studentInfo.name}
                >
                  <SectionRenderer
                    section={item.section}
                    plan="lite"
                    sectionNumber={item.num}
                  />
                </ReportPage>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};
