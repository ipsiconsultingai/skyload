import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/libs/supabase/server";

interface SchoolRecord {
  attendance: Record<string, unknown>[];
  awards: Record<string, unknown>[];
  certifications: Record<string, unknown>[];
  creativeActivities: Record<string, unknown>[];
  volunteerActivities: Record<string, unknown>[];
  generalSubjects: Record<string, unknown>[];
  careerSubjects: Record<string, unknown>[];
  artsPhysicalSubjects: Record<string, unknown>[];
  subjectEvaluations: Record<string, unknown>[];
  readingActivities: Record<string, unknown>[];
  behavioralAssessments: Record<string, unknown>[];
}

interface SubmitBody {
  method: "pdf" | "image" | "text";
  record: SchoolRecord;
  recordId?: string;
}

const deriveGradeLevel = (
  record: SchoolRecord
): "high1" | "high2" | "high3" => {
  let maxYear = 1;
  for (const rows of Object.values(record)) {
    for (const row of rows) {
      const { year } = row;
      if (typeof year === "number" && year > maxYear) {
        maxYear = year;
      }
    }
  }
  if (maxYear >= 3) return "high3";
  if (maxYear === 2) return "high2";
  return "high1";
};

// camelCase row → snake_case DB row (strips client-side `id`)
const toSnake = (
  row: Record<string, unknown>,
  recordId: string,
  fieldMap: Record<string, string>
): Record<string, unknown> => {
  const out: Record<string, unknown> = { record_id: recordId };
  for (const [camel, snake] of Object.entries(fieldMap)) {
    if (camel in row) {
      out[snake] = row[camel];
    }
  }
  return out;
};

// Section configs: sectionKey → tableName + camelCase→snake_case field map
const SECTION_CONFIGS: {
  key: keyof SchoolRecord;
  table: string;
  fields: Record<string, string>;
}[] = [
  {
    key: "attendance",
    table: "record_attendance",
    fields: {
      year: "year",
      totalDays: "total_days",
      absenceIllness: "absence_illness",
      absenceUnauthorized: "absence_unauthorized",
      absenceOther: "absence_other",
      latenessIllness: "lateness_illness",
      latenessUnauthorized: "lateness_unauthorized",
      latenessOther: "lateness_other",
      earlyLeaveIllness: "early_leave_illness",
      earlyLeaveUnauthorized: "early_leave_unauthorized",
      earlyLeaveOther: "early_leave_other",
      classMissedIllness: "class_missed_illness",
      classMissedUnauthorized: "class_missed_unauthorized",
      classMissedOther: "class_missed_other",
      note: "note",
    },
  },
  {
    key: "awards",
    table: "record_awards",
    fields: {
      year: "year",
      name: "name",
      rank: "rank",
      date: "date",
      organization: "organization",
      participants: "participants",
    },
  },
  {
    key: "certifications",
    table: "record_certifications",
    fields: {
      category: "category",
      name: "name",
      details: "details",
      date: "date",
      issuer: "issuer",
    },
  },
  {
    key: "creativeActivities",
    table: "record_creative_activities",
    fields: {
      year: "year",
      area: "area",
      hours: "hours",
      note: "note",
    },
  },
  {
    key: "volunteerActivities",
    table: "record_volunteer_activities",
    fields: {
      year: "year",
      dateRange: "date_range",
      place: "place",
      content: "content",
      hours: "hours",
    },
  },
  {
    key: "generalSubjects",
    table: "record_general_subjects",
    fields: {
      year: "year",
      semester: "semester",
      category: "category",
      subject: "subject",
      credits: "credits",
      rawScore: "raw_score",
      average: "average",
      standardDeviation: "standard_deviation",
      achievement: "achievement",
      studentCount: "student_count",
      gradeRank: "grade_rank",
    },
  },
  {
    key: "careerSubjects",
    table: "record_career_subjects",
    fields: {
      year: "year",
      semester: "semester",
      category: "category",
      subject: "subject",
      credits: "credits",
      rawScore: "raw_score",
      average: "average",
      achievement: "achievement",
      studentCount: "student_count",
      achievementDistribution: "achievement_distribution",
    },
  },
  {
    key: "artsPhysicalSubjects",
    table: "record_arts_physical_subjects",
    fields: {
      year: "year",
      semester: "semester",
      category: "category",
      subject: "subject",
      credits: "credits",
      achievement: "achievement",
    },
  },
  {
    key: "subjectEvaluations",
    table: "record_subject_evaluations",
    fields: {
      year: "year",
      subject: "subject",
      evaluation: "evaluation",
    },
  },
  {
    key: "readingActivities",
    table: "record_reading_activities",
    fields: {
      year: "year",
      subjectOrArea: "subject_or_area",
      content: "content",
    },
  },
  {
    key: "behavioralAssessments",
    table: "record_behavioral_assessments",
    fields: {
      year: "year",
      assessment: "assessment",
    },
  },
];

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // 인증 확인
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  // 요청 파싱
  let body: SubmitBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const { method, record, recordId: existingRecordId } = body;
  if (!method || !record) {
    return NextResponse.json(
      { error: "method와 record가 필요합니다." },
      { status: 400 }
    );
  }

  // 수정 모드: 기존 레코드 소유권 확인 후 삭제 (cascade)
  if (existingRecordId) {
    const { data: existing, error: fetchError } = await supabase
      .from("records")
      .select("user_id")
      .eq("id", existingRecordId)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: "기존 레코드를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    if (existing.user_id !== user.id) {
      return NextResponse.json(
        { error: "해당 레코드를 수정할 권한이 없습니다." },
        { status: 403 }
      );
    }

    const { error: deleteError } = await supabase
      .from("records")
      .delete()
      .eq("id", existingRecordId);

    if (deleteError) {
      console.error("records delete error:", deleteError);
      return NextResponse.json(
        { error: "기존 레코드 삭제에 실패했습니다." },
        { status: 500 }
      );
    }
  }

  const gradeLevel = deriveGradeLevel(record);

  // records 부모 row 삽입
  const { data: recordRow, error: insertError } = await supabase
    .from("records")
    .insert({
      user_id: user.id,
      submission_type: method,
      grade_level: gradeLevel,
    })
    .select("id")
    .single();

  if (insertError || !recordRow) {
    console.error("records insert error:", insertError);
    return NextResponse.json(
      { error: "생기부 저장에 실패했습니다." },
      { status: 500 }
    );
  }

  const recordId = recordRow.id as string;

  // 하위 테이블 bulk insert
  try {
    for (const config of SECTION_CONFIGS) {
      const rows = record[config.key];
      if (!Array.isArray(rows) || rows.length === 0) continue;

      const mapped = rows.map((row) =>
        toSnake(row as Record<string, unknown>, recordId, config.fields)
      );

      const { error } = await supabase.from(config.table).insert(mapped);
      if (error) {
        throw new Error(`${config.table} insert 실패: ${error.message}`);
      }
    }
  } catch (err) {
    console.error("하위 테이블 insert 에러:", err);
    // 롤백: records row 삭제 (cascade로 하위 데이터도 삭제됨)
    await supabase.from("records").delete().eq("id", recordId);
    return NextResponse.json(
      { error: "생기부 저장에 실패했습니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }

  // 최종 제출 성공 → draft 삭제
  await supabase.from("record_drafts").delete().eq("user_id", user.id);

  return NextResponse.json({ id: recordId });
}
