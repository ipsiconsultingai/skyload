/**
 * Phase 4: 후처리
 *
 * Zod 스키마 검증, wordCloud 섹션 주입, ReportContent 조합.
 * 검증 실패 시 섹션별 fallback 전략을 적용한다.
 */

import { z } from "zod/v4";

import {
  ReportSectionSchema,
  ReportContentSchema,
  ReportMetaSchema,
  WordCloudSectionSchema,
  validateByPlan,
  StudentProfileSectionSchema,
  CompetencyScoreSectionSchema,
  AdmissionPredictionSectionSchema,
  DiagnosticSectionSchema,
  CompetencyEvaluationSectionSchema,
  AcademicAnalysisSectionSchema,
  CourseAlignmentSectionSchema,
  AttendanceAnalysisSectionSchema,
  ActivityAnalysisSectionSchema,
  SubjectAnalysisSectionSchema,
  BehaviorAnalysisSectionSchema,
  OverallAssessmentSectionSchema,
  WeaknessAnalysisSectionSchema,
  TopicRecommendationSectionSchema,
  InterviewPrepSectionSchema,
  AdmissionStrategySectionSchema,
  DirectionGuideSectionSchema,
  StoryAnalysisSectionSchema,
  ActionRoadmapSectionSchema,
  BookRecommendationSectionSchema,
  MajorExplorationSectionSchema,
} from "../schemas";
import { SECTION_ORDER } from "../types";
import type {
  ReportPlan,
  ReportContent,
  ReportMeta,
  ReportSection,
  StudentInfo,
} from "../types";
import type { PreprocessedData, WordCloudItem } from "./preprocessor";

// ─── sectionId → Zod schema 매핑 ───

const SECTION_SCHEMA_MAP: Record<string, z.ZodType> = {
  studentProfile: StudentProfileSectionSchema,
  competencyScore: CompetencyScoreSectionSchema,
  admissionPrediction: AdmissionPredictionSectionSchema,
  diagnostic: DiagnosticSectionSchema,
  competencyEvaluation: CompetencyEvaluationSectionSchema,
  academicAnalysis: AcademicAnalysisSectionSchema,
  courseAlignment: CourseAlignmentSectionSchema,
  attendanceAnalysis: AttendanceAnalysisSectionSchema,
  activityAnalysis: ActivityAnalysisSectionSchema,
  subjectAnalysis: SubjectAnalysisSectionSchema,
  behaviorAnalysis: BehaviorAnalysisSectionSchema,
  overallAssessment: OverallAssessmentSectionSchema,
  weaknessAnalysis: WeaknessAnalysisSectionSchema,
  topicRecommendation: TopicRecommendationSectionSchema,
  interviewPrep: InterviewPrepSectionSchema,
  admissionStrategy: AdmissionStrategySectionSchema,
  directionGuide: DirectionGuideSectionSchema,
  storyAnalysis: StoryAnalysisSectionSchema,
  actionRoadmap: ActionRoadmapSectionSchema,
  bookRecommendation: BookRecommendationSectionSchema,
  majorExploration: MajorExplorationSectionSchema,
  wordCloud: WordCloudSectionSchema,
};

// ─── 검증 결과 타입 ───

export interface SectionValidationResult {
  sectionId: string;
  valid: boolean;
  errors: string[];
}

export interface PostprocessResult {
  content: ReportContent;
  validationResults: SectionValidationResult[];
  planValidationErrors: string[];
}

// ─── 메인 후처리 함수 ───

export const postprocess = (
  rawSections: ReportSection[],
  data: PreprocessedData,
  studentInfo: StudentInfo,
  plan: ReportPlan,
  reportId: string
): PostprocessResult => {
  const validationResults: SectionValidationResult[] = [];

  // 1. 각 섹션 Zod 검증
  const validatedSections: ReportSection[] = [];

  for (const section of rawSections) {
    const result = validateSection(section);
    validationResults.push(result);

    if (result.valid) {
      validatedSections.push(section);
    } else {
      // 검증 실패 시에도 섹션 포함 (최선의 결과 제공)
      // 필수 섹션은 반드시 포함, 선택 섹션은 에러가 심각하면 제외 가능
      const isCritical = isCriticalSection(section.sectionId, plan);
      if (isCritical) {
        validatedSections.push(section);
      }
    }
  }

  // 2. wordCloud 섹션 주입 (코드 생성, AI 아님)
  const wordCloudSection = buildWordCloudSection(data.wordCloudData);
  const wordCloudResult = validateSection(wordCloudSection);
  validationResults.push(wordCloudResult);
  validatedSections.push(wordCloudSection);

  // 3. 섹션 정렬 (플랜별 순서)
  const sectionOrder = SECTION_ORDER[plan];
  validatedSections.sort((a, b) => {
    const aIdx = sectionOrder.indexOf(a.sectionId);
    const bIdx = sectionOrder.indexOf(b.sectionId);
    return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
  });

  // 4. ReportMeta 생성
  const meta: ReportMeta = {
    reportId,
    plan,
    studentInfo: {
      name: studentInfo.name,
      grade: studentInfo.grade,
      track: studentInfo.track,
      schoolType: studentInfo.schoolType,
      targetUniversity: studentInfo.targetUniversity,
      targetDepartment: studentInfo.targetDepartment,
      hasMockExamData: studentInfo.hasMockExamData,
    },
    createdAt: new Date().toISOString(),
    version: 3,
  };

  // 5. ReportContent 조합
  const content: ReportContent = {
    meta,
    sections: validatedSections,
  };

  // 6. 플랜별 검증
  const planValidationErrors = validateByPlan(content);

  return {
    content,
    validationResults,
    planValidationErrors,
  };
};

// ─── 개별 섹션 검증 ───

const validateSection = (section: ReportSection): SectionValidationResult => {
  const { sectionId } = section;
  const schema = SECTION_SCHEMA_MAP[sectionId];

  if (!schema) {
    return {
      sectionId,
      valid: false,
      errors: [`알 수 없는 섹션 ID: ${sectionId}`],
    };
  }

  const result = schema.safeParse(section);

  if (result.success) {
    return { sectionId, valid: true, errors: [] };
  }

  const errors = z.prettifyError(result.error);

  return {
    sectionId,
    valid: false,
    errors: [errors],
  };
};

// ─── 필수 섹션 판정 ───

const CRITICAL_SECTIONS: Record<ReportPlan, Set<string>> = {
  lite: new Set([
    "studentProfile",
    "competencyScore",
    "diagnostic",
    "competencyEvaluation",
    "academicAnalysis",
    "subjectAnalysis",
  ]),
  standard: new Set([
    "studentProfile",
    "competencyScore",
    "diagnostic",
    "competencyEvaluation",
    "academicAnalysis",
    "subjectAnalysis",
    "admissionPrediction",
  ]),
  premium: new Set([
    "studentProfile",
    "competencyScore",
    "diagnostic",
    "competencyEvaluation",
    "academicAnalysis",
    "subjectAnalysis",
    "admissionPrediction",
    "admissionStrategy",
  ]),
};

const isCriticalSection = (sectionId: string, plan: ReportPlan): boolean => {
  return CRITICAL_SECTIONS[plan].has(sectionId);
};

// ─── wordCloud 섹션 빌더 ───

const buildWordCloudSection = (
  wordCloudData: WordCloudItem[]
): ReportSection => {
  const words = wordCloudData.slice(0, 50).map((item) => ({
    text: item.text,
    frequency: item.frequency,
    ...(item.category ? { category: item.category } : {}),
  }));

  // 최소 20개 보장
  while (words.length < 20) {
    words.push({
      text: `키워드${words.length + 1}`,
      frequency: 1,
    });
  }

  return {
    sectionId: "wordCloud",
    title: "핵심 키워드 분석",
    words,
  } as ReportSection;
};
