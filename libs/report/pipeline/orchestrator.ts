/**
 * Phase 2-3: 오케스트레이터
 *
 * Wave 기반 병렬/순차 실행으로 Gemini API를 호출하여
 * 21개 섹션을 생성한다.
 */

import type { ReportPlan, ReportSection, StudentInfo } from "../types";
import { SECTION_ORDER } from "../types";
import { buildSystemPrompt } from "../prompts/system";

// Phase 2 prompts
import { buildCompetencyExtractionPrompt } from "../prompts/phase2/competency-extraction";
import type { CompetencyExtractionOutput } from "../prompts/phase2/competency-extraction";
import { buildAcademicContextAnalysisPrompt } from "../prompts/phase2/academic-analysis";
import type { AcademicContextAnalysisOutput } from "../prompts/phase2/academic-analysis";
import { buildStudentTypeClassificationPrompt } from "../prompts/phase2/student-type-classification";
import type { StudentTypeClassificationOutput } from "../prompts/phase2/student-type-classification";

// Section prompts
import { buildStudentProfilePrompt } from "../prompts/sections/student-profile";
import { buildCompetencyScorePrompt } from "../prompts/sections/competency-score";
import { buildDiagnosticPrompt } from "../prompts/sections/diagnostic";
import { buildAdmissionPredictionPrompt } from "../prompts/sections/admission-prediction";
import { buildCompetencyEvaluationPrompt } from "../prompts/sections/competency-evaluation";
import { buildAcademicAnalysisPrompt } from "../prompts/sections/academic-analysis";
import { buildCourseAlignmentPrompt } from "../prompts/sections/course-alignment";
import { buildAttendanceAnalysisPrompt } from "../prompts/sections/attendance-analysis";
import { buildActivityAnalysisPrompt } from "../prompts/sections/activity-analysis";
import { buildSubjectAnalysisPrompt } from "../prompts/sections/subject-analysis";
import { buildBehaviorAnalysisPrompt } from "../prompts/sections/behavior-analysis";
import { buildOverallAssessmentPrompt } from "../prompts/sections/overall-assessment";
import { buildWeaknessAnalysisPrompt } from "../prompts/sections/weakness-analysis";
import { buildTopicRecommendationPrompt } from "../prompts/sections/topic-recommendation";
import { buildInterviewPrepPrompt } from "../prompts/sections/interview-prep";
import {
  buildAdmissionStrategyPrompt,
  buildDirectionGuidePrompt,
} from "../prompts/sections/admission-strategy";
import { buildStoryAnalysisPrompt } from "../prompts/sections/story-analysis";
import { buildActionRoadmapPrompt } from "../prompts/sections/action-roadmap";
import { buildBookRecommendationPrompt } from "../prompts/sections/book-recommendation";
import { buildMajorExplorationPrompt } from "../prompts/sections/major-exploration";

import type { GeminiClient } from "./gemini-client";
import type { PreprocessedTexts, PreprocessedData } from "./preprocessor";

// ─── Gemini responseSchema stubs ───
// 실제 Schema 객체는 Gemini SDK 타입으로 정의해야 하지만,
// 구조화된 출력에서 responseSchema 없이 JSON mode만 사용하는 것도 가능.
// 여기서는 빈 스키마 placeholder로 처리하고, 후처리에서 Zod 검증으로 보완.

const EMPTY_SCHEMA = {} as never;

// ─── 진행 상황 콜백 ───

export interface OrchestratorProgress {
  phase: string;
  section?: string;
  progress: number; // 0~100
}

export type ProgressCallback = (progress: OrchestratorProgress) => void;

// ─── 내부 상태 ───

interface Phase2Results {
  competencyExtraction: CompetencyExtractionOutput;
  academicAnalysis: AcademicContextAnalysisOutput;
  studentTypeClassification: StudentTypeClassificationOutput;
}

// ─── 메인 오케스트레이터 ───

export const orchestrate = async (
  client: GeminiClient,
  plan: ReportPlan,
  studentInfo: StudentInfo,
  texts: PreprocessedTexts,
  data: PreprocessedData,
  onProgress?: ProgressCallback
): Promise<ReportSection[]> => {
  const systemPrompt = buildSystemPrompt(plan);
  const sections: ReportSection[] = [];
  const requiredSections = SECTION_ORDER[plan];
  const isGrade1Only = studentInfo.grade === 1;
  const isStandardPlus = plan === "standard" || plan === "premium";

  const totalSteps = computeTotalSteps(plan, isGrade1Only);
  let completedSteps = 0;

  const reportProgress = (phase: string, section?: string) => {
    completedSteps++;
    onProgress?.({
      phase,
      section,
      progress: Math.round((completedSteps / totalSteps) * 100),
    });
  };

  const callGemini = async <T>(prompt: string): Promise<T> => {
    const result = await client.call<T>({
      systemInstruction: systemPrompt,
      prompt,
      responseSchema: EMPTY_SCHEMA,
    });
    return result.data;
  };

  // ═══════════════════════════════════════════
  // Phase 2: 기반 분석 (병렬 3건)
  // ═══════════════════════════════════════════

  onProgress?.({ phase: "Phase 2", progress: 0 });

  const [competencyExtraction, academicAnalysis, studentTypeClassification] =
    await Promise.all([
      callGemini<CompetencyExtractionOutput>(
        buildCompetencyExtractionPrompt({
          studentProfile: texts.studentProfileText,
          recordData: texts.recordDataText,
        })
      ).then((r) => {
        reportProgress("Phase 2", "competencyExtraction");
        return r;
      }),
      callGemini<AcademicContextAnalysisOutput>(
        buildAcademicContextAnalysisPrompt({
          preprocessedAcademicData: texts.preprocessedAcademicDataText,
          rawAcademicData: texts.rawAcademicDataText,
          studentProfile: texts.studentProfileText,
        })
      ).then((r) => {
        reportProgress("Phase 2", "academicAnalysis");
        return r;
      }),
      callGemini<StudentTypeClassificationOutput>(
        buildStudentTypeClassificationPrompt({
          competencyExtraction: texts.preprocessedAcademicDataText,
          preprocessedAcademicData: texts.preprocessedAcademicDataText,
          studentProfile: texts.studentProfileText,
        })
      ).then((r) => {
        reportProgress("Phase 2", "studentTypeClassification");
        return r;
      }),
    ]);

  const phase2: Phase2Results = {
    competencyExtraction,
    academicAnalysis,
    studentTypeClassification,
  };

  const compExtrText = JSON.stringify(competencyExtraction);
  const acadAnalText = JSON.stringify(academicAnalysis);
  const stuTypeText = JSON.stringify(studentTypeClassification);

  // ═══════════════════════════════════════════
  // Phase 3: 섹션 생성 (Wave 기반)
  // ═══════════════════════════════════════════

  // --- Group 1: studentProfile, competencyScore, diagnostic (병렬) ---
  const [studentProfile, competencyScore, diagnostic] = await Promise.all([
    callGemini<ReportSection>(
      buildStudentProfilePrompt(
        {
          studentTypeClassification: stuTypeText,
          studentProfile: texts.studentProfileText,
        },
        plan
      )
    ).then((r) => {
      reportProgress("Phase 3 Group 1", "studentProfile");
      return r;
    }),
    callGemini<ReportSection>(
      buildCompetencyScorePrompt(
        {
          studentTypeClassification: stuTypeText,
          competencyExtraction: compExtrText,
          preprocessedAcademicData: texts.preprocessedAcademicDataText,
          studentProfile: texts.studentProfileText,
        },
        plan
      )
    ).then((r) => {
      reportProgress("Phase 3 Group 1", "competencyScore");
      return r;
    }),
    callGemini<ReportSection>(
      buildDiagnosticPrompt(
        {
          competencyExtraction: compExtrText,
          academicAnalysis: acadAnalText,
          studentTypeClassification: stuTypeText,
          studentProfile: texts.studentProfileText,
        },
        plan
      )
    ).then((r) => {
      reportProgress("Phase 3 Group 1", "diagnostic");
      return r;
    }),
  ]);

  sections.push(studentProfile, competencyScore, diagnostic);

  // --- Group 2: competencyEvaluation, academicAnalysis, courseAlignment, attendanceAnalysis, activityAnalysis (병렬) ---
  const group2Promises: Promise<ReportSection>[] = [
    callGemini<ReportSection>(
      buildCompetencyEvaluationPrompt(
        {
          competencyExtraction: compExtrText,
          academicAnalysis: acadAnalText,
          studentProfile: texts.studentProfileText,
        },
        plan
      )
    ).then((r) => {
      reportProgress("Phase 3 Group 2", "competencyEvaluation");
      return r;
    }),
    callGemini<ReportSection>(
      buildAcademicAnalysisPrompt(
        {
          quantitativeAnalysis: acadAnalText,
          preprocessedAcademicData: texts.preprocessedAcademicDataText,
          studentProfile: texts.studentProfileText,
        },
        plan
      )
    ).then((r) => {
      reportProgress("Phase 3 Group 2", "academicAnalysis");
      return r;
    }),
    callGemini<ReportSection>(
      buildCourseAlignmentPrompt(
        {
          recommendedCourseMatch: texts.recommendedCourseMatchText,
          competencyExtraction: compExtrText,
          studentProfile: texts.studentProfileText,
        },
        plan
      )
    ).then((r) => {
      reportProgress("Phase 3 Group 2", "courseAlignment");
      return r;
    }),
    callGemini<ReportSection>(
      buildAttendanceAnalysisPrompt(
        {
          attendanceSummary: texts.attendanceSummaryText,
          studentProfile: texts.studentProfileText,
        },
        plan
      )
    ).then((r) => {
      reportProgress("Phase 3 Group 2", "attendanceAnalysis");
      return r;
    }),
    callGemini<ReportSection>(
      buildActivityAnalysisPrompt(
        {
          creativeActivities: texts.creativeActivitiesText,
          competencyExtraction: compExtrText,
          studentProfile: texts.studentProfileText,
          curriculumVersion: texts.curriculumVersion,
        },
        plan
      )
    ).then((r) => {
      reportProgress("Phase 3 Group 2", "activityAnalysis");
      return r;
    }),
  ];
  const group2Results = await Promise.all(group2Promises);
  sections.push(...group2Results);

  // --- Group 3: subjectAnalysis, behaviorAnalysis (Standard+), overallAssessment (Standard+) ---
  const group3Promises: Promise<ReportSection>[] = [
    callGemini<ReportSection>(
      buildSubjectAnalysisPrompt(
        {
          subjectData: texts.subjectDataText,
          studentProfile: texts.studentProfileText,
        },
        plan
      )
    ).then((r) => {
      reportProgress("Phase 3 Group 3", "subjectAnalysis");
      return r;
    }),
  ];

  if (isStandardPlus) {
    group3Promises.push(
      callGemini<ReportSection>(
        buildBehaviorAnalysisPrompt(
          {
            behavioralAssessment: texts.behavioralAssessmentText,
            competencyExtraction: compExtrText,
            studentProfile: texts.studentProfileText,
          },
          plan
        )
      ).then((r) => {
        reportProgress("Phase 3 Group 3", "behaviorAnalysis");
        return r;
      })
    );
    group3Promises.push(
      callGemini<ReportSection>(
        buildOverallAssessmentPrompt(
          {
            recordVolumeData: texts.recordVolumeText,
            competencyExtraction: compExtrText,
            studentProfile: texts.studentProfileText,
          },
          plan
        )
      ).then((r) => {
        reportProgress("Phase 3 Group 3", "overallAssessment");
        return r;
      })
    );
  }
  const group3Results = await Promise.all(group3Promises);
  sections.push(...group3Results);

  // Serialize group 2/3 results for downstream usage
  const compEvalText = JSON.stringify(
    group2Results.find((s) => s.sectionId === "competencyEvaluation")
  );
  const acadSectionText = JSON.stringify(
    group2Results.find((s) => s.sectionId === "academicAnalysis")
  );
  const attendSectionText = JSON.stringify(
    group2Results.find((s) => s.sectionId === "attendanceAnalysis")
  );
  const subjAnalysisText = JSON.stringify(
    group3Results.find((s) => s.sectionId === "subjectAnalysis")
  );

  // --- Group 4: weaknessAnalysis, admissionPrediction, topicRecommendation, interviewPrep (Standard+) ---
  const group4Promises: Promise<ReportSection>[] = [
    callGemini<ReportSection>(
      buildWeaknessAnalysisPrompt(
        {
          competencyExtraction: compExtrText,
          academicAnalysis: acadAnalText,
          studentProfile: texts.studentProfileText,
        },
        plan
      )
    ).then((r) => {
      reportProgress("Phase 3 Group 4", "weaknessAnalysis");
      return r;
    }),
    callGemini<ReportSection>(
      buildAdmissionPredictionPrompt(
        {
          competencyExtraction: compExtrText,
          academicAnalysis: acadAnalText,
          studentTypeClassification: stuTypeText,
          universityCandidates: "[]",
          studentProfile: texts.studentProfileText,
          competencyEvaluationResult: compEvalText,
          subjectAnalysisResult: subjAnalysisText,
          academicAnalysisResult: acadSectionText,
          attendanceAnalysisResult: attendSectionText,
        },
        plan
      )
    ).then((r) => {
      reportProgress("Phase 3 Group 4", "admissionPrediction");
      return r;
    }),
    callGemini<ReportSection>(
      buildTopicRecommendationPrompt(
        {
          subjectAnalysisResult: subjAnalysisText,
          weaknessAnalysisResult: "[]",
          studentProfile: texts.studentProfileText,
        },
        plan
      )
    ).then((r) => {
      reportProgress("Phase 3 Group 4", "topicRecommendation");
      return r;
    }),
  ];

  if (isStandardPlus) {
    group4Promises.push(
      callGemini<ReportSection>(
        buildInterviewPrepPrompt(
          {
            subjectAnalysisResult: subjAnalysisText,
            studentProfile: texts.studentProfileText,
            academicData: texts.rawAcademicDataText,
          },
          plan
        )
      ).then((r) => {
        reportProgress("Phase 3 Group 4", "interviewPrep");
        return r;
      })
    );
  }

  const group4Results = await Promise.all(group4Promises);
  sections.push(...group4Results);

  const weaknessText = JSON.stringify(
    group4Results.find((s) => s.sectionId === "weaknessAnalysis")
  );
  const admPredText = JSON.stringify(
    group4Results.find((s) => s.sectionId === "admissionPrediction")
  );

  // --- Group 5: admissionStrategy/directionGuide, storyAnalysis (Standard+), actionRoadmap (Standard+) ---
  const group5Promises: Promise<ReportSection>[] = [];

  if (isGrade1Only) {
    group5Promises.push(
      callGemini<ReportSection>(
        buildDirectionGuidePrompt({
          competencyExtraction: compExtrText,
          academicAnalysis: acadAnalText,
          recommendedCourseMatch: texts.recommendedCourseMatchText,
          studentProfile: texts.studentProfileText,
        })
      ).then((r) => {
        reportProgress("Phase 3 Group 5", "directionGuide");
        return r;
      })
    );
  } else {
    group5Promises.push(
      callGemini<ReportSection>(
        buildAdmissionStrategyPrompt(
          {
            academicAnalysis: acadSectionText,
            competencyEvaluation: compEvalText,
            admissionPredictionResult: admPredText,
            universityCandidates: "[]",
            recommendedCourseMatch: texts.recommendedCourseMatchText,
            studentProfile: texts.studentProfileText,
          },
          plan
        )
      ).then((r) => {
        reportProgress("Phase 3 Group 5", "admissionStrategy");
        return r;
      })
    );
  }

  if (isStandardPlus) {
    group5Promises.push(
      callGemini<ReportSection>(
        buildStoryAnalysisPrompt(
          {
            allSubjectData: texts.subjectDataText,
            creativeActivities: texts.creativeActivitiesText,
            behavioralAssessment: texts.behavioralAssessmentText,
            studentProfile: texts.studentProfileText,
          },
          plan
        )
      ).then((r) => {
        reportProgress("Phase 3 Group 5", "storyAnalysis");
        return r;
      })
    );
    group5Promises.push(
      callGemini<ReportSection>(
        buildActionRoadmapPrompt(
          {
            weaknessAnalysisResult: weaknessText,
            admissionStrategyResult: JSON.stringify(
              sections.find(
                (s) =>
                  s.sectionId === "admissionStrategy" ||
                  s.sectionId === "directionGuide"
              )
            ),
            studentProfile: texts.studentProfileText,
          },
          plan
        )
      ).then((r) => {
        reportProgress("Phase 3 Group 5", "actionRoadmap");
        return r;
      })
    );
  }

  const group5Results = await Promise.all(group5Promises);
  sections.push(...group5Results);

  // --- Group 6: bookRecommendation (Standard+), majorExploration (Standard+) -- independent ---
  if (isStandardPlus) {
    const group6Results = await Promise.all([
      callGemini<ReportSection>(
        buildBookRecommendationPrompt(
          {
            competencyExtraction: compExtrText,
            subjectAnalysisResult: subjAnalysisText,
            studentProfile: texts.studentProfileText,
          },
          plan
        )
      ).then((r) => {
        reportProgress("Phase 3 Group 6", "bookRecommendation");
        return r;
      }),
      callGemini<ReportSection>(
        buildMajorExplorationPrompt(
          {
            competencyExtraction: compExtrText,
            academicAnalysis: acadAnalText,
            studentProfile: texts.studentProfileText,
          },
          plan
        )
      ).then((r) => {
        reportProgress("Phase 3 Group 6", "majorExploration");
        return r;
      }),
    ]);
    sections.push(...group6Results);
  }

  // Sort sections according to plan order
  const sectionOrder = SECTION_ORDER[plan];
  sections.sort((a, b) => {
    const aIdx = sectionOrder.indexOf(a.sectionId);
    const bIdx = sectionOrder.indexOf(b.sectionId);
    return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
  });

  return sections;
};

const computeTotalSteps = (plan: ReportPlan, isGrade1Only: boolean): number => {
  // Phase 2: 3 calls
  let steps = 3;

  // Group 1: 3
  steps += 3;

  // Group 2: 5
  steps += 5;

  // Group 3: 1 (subjectAnalysis) + standard: 2 (behavior, overall)
  steps += 1;
  if (plan !== "lite") steps += 2;

  // Group 4: 3 (weakness, prediction, topic) + standard: 1 (interview)
  steps += 3;
  if (plan !== "lite") steps += 1;

  // Group 5: 1 (strategy/direction) + standard: 2 (story, roadmap)
  steps += 1;
  if (plan !== "lite") steps += 2;

  // Group 6: standard: 2 (book, major)
  if (plan !== "lite") steps += 2;

  return steps;
};
