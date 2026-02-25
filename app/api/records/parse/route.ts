import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { writeFile, unlink } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import crypto from "crypto";

import { createClient } from "@/libs/supabase/server";

export const maxDuration = 120;
export const dynamic = "force-dynamic";

const PARSE_PROMPT = `당신은 한국 고등학교 생활기록부(학생부) 전문 파서입니다.
첨부된 파일은 생활기록부입니다. 이 문서를 분석하여 아래 JSON 스키마에 맞게 구조화해주세요.

## JSON 스키마

{
  "attendance": [
    { "year": number, "totalDays": number|null, "absenceIllness": number|null, "absenceUnauthorized": number|null, "absenceOther": number|null, "latenessIllness": number|null, "latenessUnauthorized": number|null, "latenessOther": number|null, "earlyLeaveIllness": number|null, "earlyLeaveUnauthorized": number|null, "earlyLeaveOther": number|null, "classMissedIllness": number|null, "classMissedUnauthorized": number|null, "classMissedOther": number|null, "note": string }
  ],
  "awards": [
    { "year": number, "name": string, "rank": string, "date": string, "organization": string, "participants": string }
  ],
  "certifications": [
    { "category": string, "name": string, "details": string, "date": string, "issuer": string }
  ],
  "creativeActivities": [
    { "year": number, "area": "자율활동"|"동아리활동"|"진로활동", "hours": number|null, "note": string }
  ],
  "volunteerActivities": [
    { "year": number, "dateRange": string, "place": string, "content": string, "hours": number|null }
  ],
  "generalSubjects": [
    { "year": number, "semester": number, "category": string, "subject": string, "credits": number|null, "rawScore": number|null, "average": number|null, "standardDeviation": number|null, "achievement": string, "studentCount": number|null, "gradeRank": number|null }
  ],
  "careerSubjects": [
    { "year": number, "semester": number, "category": string, "subject": string, "credits": number|null, "rawScore": number|null, "average": number|null, "achievement": string, "studentCount": number|null, "achievementDistribution": string }
  ],
  "artsPhysicalSubjects": [
    { "year": number, "semester": number, "category": string, "subject": string, "credits": number|null, "achievement": string }
  ],
  "subjectEvaluations": [
    { "year": number, "subject": string, "evaluation": string }
  ],
  "readingActivities": [
    { "year": number, "subjectOrArea": string, "content": string }
  ],
  "behavioralAssessments": [
    { "year": number, "assessment": string }
  ]
}

## 분류 규칙

1. **교과 구분**:
   - 석차등급(gradeRank)이 있는 과목 → generalSubjects
   - 성취도별 분포비율(achievementDistribution)이 있는 과목 → careerSubjects
   - 체육·음악·미술 교과 → artsPhysicalSubjects

2. **창의적 체험활동**:
   - area는 반드시 "자율활동", "동아리활동", "진로활동" 중 하나

3. **학년(year)**:
   - 1학년=1, 2학년=2, 3학년=3 (숫자만)

4. **null 규칙**:
   - 숫자 필드에 해당 데이터가 없으면 null
   - 문자열 필드에 해당 데이터가 없으면 빈 문자열 ""

5. **id 필드는 포함하지 마세요** (서버에서 자동 생성)

6. 해당 섹션의 데이터가 없으면 빈 배열 []로 반환`;

interface RawRecord {
  attendance?: RawRow[];
  awards?: RawRow[];
  certifications?: RawRow[];
  creativeActivities?: RawRow[];
  volunteerActivities?: RawRow[];
  generalSubjects?: RawRow[];
  careerSubjects?: RawRow[];
  artsPhysicalSubjects?: RawRow[];
  subjectEvaluations?: RawRow[];
  readingActivities?: RawRow[];
  behavioralAssessments?: RawRow[];
}

interface RawRow {
  id?: string;
  [key: string]: unknown;
}

const enrichWithIds = (raw: RawRecord): RawRecord => {
  const sections = [
    "attendance",
    "awards",
    "certifications",
    "creativeActivities",
    "volunteerActivities",
    "generalSubjects",
    "careerSubjects",
    "artsPhysicalSubjects",
    "subjectEvaluations",
    "readingActivities",
    "behavioralAssessments",
  ] as const;

  const result: RawRecord = {};
  for (const key of sections) {
    const rows = raw[key];
    result[key] = Array.isArray(rows)
      ? rows.map((row) => ({ ...row, id: crypto.randomUUID() }))
      : [];
  }
  return result;
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();
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

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "AI 파싱 기능을 사용할 수 없습니다. API 키가 설정되지 않았습니다.",
      },
      { status: 503 }
    );
  }

  // Parse request body: { files: [{ data, mimeType }] }
  interface FilePayload {
    data: string;
    mimeType: string;
  }
  let files: FilePayload[];
  try {
    const body = await request.json();
    ({ files } = body);
    if (!Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { error: "파일 데이터가 필요합니다." },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const tempPaths: string[] = [];

  try {
    // Upload files via File API in parallel
    const fileManager = new GoogleAIFileManager(apiKey);

    const uploadPromises = files.map(async ({ data, mimeType }, i) => {
      const ext = mimeType.includes("pdf") ? "pdf" : "img";
      const tempPath = join(tmpdir(), `parse-${crypto.randomUUID()}.${ext}`);
      tempPaths.push(tempPath);

      await writeFile(tempPath, Buffer.from(data, "base64"));

      const uploadResult = await fileManager.uploadFile(tempPath, {
        mimeType,
        displayName: `school-record-${i}`,
      });

      return {
        fileData: {
          mimeType: uploadResult.file.mimeType,
          fileUri: uploadResult.file.uri,
        },
      };
    });

    const fileParts = await Promise.all(uploadPromises);

    // Generate content — disable thinking for faster structured extraction
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        // @ts-expect-error -- thinkingConfig is supported but not yet typed in SDK
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    const result = await model.generateContent([
      ...fileParts,
      { text: PARSE_PROMPT },
    ]);
    const responseText = result.response.text();

    if (!responseText || responseText.trim().length === 0) {
      console.error("Gemini returned empty response");
      return NextResponse.json(
        { error: "AI가 빈 응답을 반환했습니다. 다시 시도해주세요." },
        { status: 502 }
      );
    }

    let rawJson: unknown;
    try {
      rawJson = JSON.parse(responseText.trim());
    } catch (parseErr) {
      console.error("JSON parse failed:", parseErr);
      return NextResponse.json(
        { error: "AI 응답을 파싱할 수 없습니다. 다시 시도해주세요." },
        { status: 502 }
      );
    }

    const enriched = enrichWithIds(rawJson as RawRecord);
    return NextResponse.json(enriched);
  } catch (err) {
    console.error("Gemini parse error:", err);
    const message = err instanceof Error ? err.message : String(err);

    if (message.includes("403") || message.includes("suspended")) {
      return NextResponse.json(
        { error: "AI API 키가 유효하지 않습니다. 관리자에게 문의하세요." },
        { status: 403 }
      );
    }

    if (message.includes("429") || message.includes("quota")) {
      return NextResponse.json(
        {
          error:
            "AI API 사용량이 초과되었습니다. 잠시 후 다시 시도해주세요.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "AI 파싱에 실패했습니다. 다시 시도해주세요." },
      { status: 500 }
    );
  } finally {
    await Promise.all(tempPaths.map((p) => unlink(p).catch(() => {})));
  }
}
