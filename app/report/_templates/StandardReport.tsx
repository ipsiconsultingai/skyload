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

interface StandardReportProps {
  data: ReportContent;
}

const PART_CONFIG = [
  {
    partNumber: "PART 1",
    title: "진단",
    description:
      "생기부 전체를 기반으로 한 학생 유형 분류, 역량 정량 스코어, 합격 예측, 종합 진단",
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
      "역량별 종합 평가, 성적 분석, 권장과목 이수, 출결, 창체 활동, 세특, 행동특성, 기록 충실도 분석",
    sectionIds: [
      "competencyEvaluation",
      "academicAnalysis",
      "courseAlignment",
      "attendanceAnalysis",
      "activityAnalysis",
      "subjectAnalysis",
      "behaviorAnalysis",
      "overallAssessment",
    ],
  },
  {
    partNumber: "PART 3",
    title: "전략",
    description:
      "보완 전략, 세특 주제 추천, 면접 대비, 입시 전략, 스토리 분석, 실행 로드맵",
    sectionIds: [
      "weaknessAnalysis",
      "topicRecommendation",
      "interviewPrep",
      "admissionStrategy",
      "directionGuide",
      "storyAnalysis",
      "actionRoadmap",
    ],
  },
  {
    partNumber: "부록",
    title: "부록",
    description: "추천 도서, AI 전공 추천, 워드 클라우드",
    sectionIds: ["bookRecommendation", "majorExploration", "wordCloud"],
  },
];

export const StandardReport = ({ data }: StandardReportProps) => {
  const { meta, sections } = data;
  const order = SECTION_ORDER.standard;

  const sectionMap = new Map<string, ReportSection>(
    sections.map((s) => [s.sectionId, s])
  );

  let globalSectionNum = 0;
  let pageNum = 3;

  return (
    <div className={`${styles.report} ${styles.planStandard}`}>
      <div className={styles.reportWrapper}>
        <ReportCover meta={meta} />
        <ReportTableOfContents
          sections={order
            .map((id) => sectionMap.get(id))
            .filter((s): s is ReportSection => s !== undefined)}
          plan="standard"
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
                    plan="standard"
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
