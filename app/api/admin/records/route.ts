import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/libs/supabase/server";

interface AdminRecord {
  id: string;
  userName: string | null;
  userId: string;
  submissionType: "pdf" | "image" | "text";
  gradeLevel: string;
  textVerified: boolean;
  orderStatus: string | null;
  createdAt: string;
}

interface PaginatedResponse {
  data: AdminRecord[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export async function GET(
  request: NextRequest
): Promise<NextResponse<PaginatedResponse | { error: string }>> {
  const supabase = await createClient();

  // 1. 인증 확인
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

  // 2. 관리자 권한 확인
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    return NextResponse.json(
      { error: "관리자 권한이 필요합니다." },
      { status: 403 }
    );
  }

  // 3. 쿼리 파라미터 파싱
  const { searchParams } = request.nextUrl;
  const page = Math.max(
    DEFAULT_PAGE,
    parseInt(searchParams.get("page") ?? String(DEFAULT_PAGE), 10)
  );
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(
      1,
      parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10)
    )
  );
  const search = searchParams.get("search")?.trim() ?? "";
  const typeFilter = searchParams.get("type") ?? "";
  const gradeFilter = searchParams.get("grade") ?? "";
  const verifiedFilter = searchParams.get("verified") ?? "";

  const offset = (page - 1) * limit;

  // 4. 쿼리 빌드
  let query = supabase
    .from("records")
    .select(
      `
      id,
      user_id,
      submission_type,
      grade_level,
      text_verified,
      created_at,
      profiles!inner(name),
      orders(status)
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  // 5. 필터 적용
  if (search) {
    query = query.ilike("profiles.name", `%${search}%`);
  }

  if (typeFilter && ["pdf", "image", "text"].includes(typeFilter)) {
    query = query.eq("submission_type", typeFilter);
  }

  if (
    gradeFilter &&
    ["high1", "high2", "high3", "repeat"].includes(gradeFilter)
  ) {
    query = query.eq("grade_level", gradeFilter);
  }

  if (verifiedFilter === "true") {
    query = query.eq("text_verified", true);
  } else if (verifiedFilter === "false") {
    query = query.eq("text_verified", false);
  }

  const { data: records, count, error: queryError } = await query;

  if (queryError) {
    console.error("Admin records query error:", queryError);
    return NextResponse.json(
      { error: "레코드 목록을 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }

  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / limit);

  // 6. 응답 변환
  const adminRecords: AdminRecord[] = (records ?? []).map(
    (record: Record<string, unknown>) => {
      const profiles = record.profiles as { name: string } | null;
      const orders = record.orders as { status: string }[] | null;

      return {
        id: record.id as string,
        userName: profiles?.name ?? null,
        userId: record.user_id as string,
        submissionType: record.submission_type as "pdf" | "image" | "text",
        gradeLevel: record.grade_level as string,
        textVerified: record.text_verified as boolean,
        orderStatus: orders?.[0]?.status ?? null,
        createdAt: record.created_at as string,
      };
    }
  );

  return NextResponse.json({
    data: adminRecords,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages,
    },
  });
}
