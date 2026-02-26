import { NextRequest, NextResponse } from "next/server";

import { createAdminClient } from "@/libs/supabase/admin";
import { createClient } from "@/libs/supabase/server";

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  role: "user" | "admin";
  highSchoolName: string | null;
  grade: string | null;
  onboardingCompleted: boolean;
  createdAt: string;
  recordCount: number;
  orderCount: number;
}

interface PaginatedResponse {
  data: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export const GET = async (
  request: NextRequest
): Promise<NextResponse<PaginatedResponse | { error: string }>> => {
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

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!adminProfile || adminProfile.role !== "admin") {
    return NextResponse.json(
      { error: "관리자 권한이 필요합니다." },
      { status: 403 }
    );
  }

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
  const roleFilter = searchParams.get("role") ?? "";
  const gradeFilter = searchParams.get("grade") ?? "";
  const onboardingFilter = searchParams.get("onboarding") ?? "";

  // Use admin client for email lookup only (optional)
  const adminSupabase = createAdminClient();

  // If searching by email and admin client is available, find matching IDs
  let emailMatchedIds: string[] | null = null;
  if (search && adminSupabase) {
    const { data: authData } = await adminSupabase.auth.admin.listUsers({
      perPage: 1000,
    });
    if (authData?.users) {
      emailMatchedIds = authData.users
        .filter((u) => u.email?.toLowerCase().includes(search.toLowerCase()))
        .map((u) => u.id);
    }
  }

  // Build query using regular client (admin RLS policies handle access)
  let query = supabase.from("profiles").select("*", { count: "exact" });

  if (roleFilter && (roleFilter === "user" || roleFilter === "admin")) {
    query = query.eq("role", roleFilter);
  }

  if (
    gradeFilter &&
    ["high1", "high2", "high3", "graduate"].includes(gradeFilter)
  ) {
    query = query.eq("grade", gradeFilter);
  }

  if (onboardingFilter === "true") {
    query = query.eq("onboarding_completed", true);
  } else if (onboardingFilter === "false") {
    query = query.eq("onboarding_completed", false);
  }

  if (search) {
    if (emailMatchedIds && emailMatchedIds.length > 0) {
      query = query.or(
        `name.ilike.%${search}%,id.in.(${emailMatchedIds.join(",")})`
      );
    } else {
      query = query.ilike("name", `%${search}%`);
    }
  }

  const offset = (page - 1) * limit;
  query = query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const { data: profiles, count, error: profilesError } = await query;

  if (profilesError) {
    console.error("프로필 조회 오류:", profilesError);
    return NextResponse.json(
      { error: "사용자 목록을 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }

  if (!profiles || profiles.length === 0) {
    return NextResponse.json({
      data: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    });
  }

  // Get emails from auth (only if admin client is available)
  const emailMap = new Map<string, string>();
  if (adminSupabase) {
    const { data: authData } = await adminSupabase.auth.admin.listUsers({
      perPage: 1000,
    });
    if (authData?.users) {
      for (const u of authData.users) {
        emailMap.set(u.id, u.email ?? "");
      }
    }
  }

  // Get record counts using regular client (admin RLS)
  const profileIds = profiles.map((p) => p.id);

  const { data: recordCounts } = await supabase
    .from("records")
    .select("user_id")
    .in("user_id", profileIds);

  const recordCountMap = new Map<string, number>();
  if (recordCounts) {
    for (const r of recordCounts) {
      recordCountMap.set(r.user_id, (recordCountMap.get(r.user_id) ?? 0) + 1);
    }
  }

  // Get order counts using regular client (admin RLS)
  const { data: orderCounts } = await supabase
    .from("orders")
    .select("user_id")
    .in("user_id", profileIds);

  const orderCountMap = new Map<string, number>();
  if (orderCounts) {
    for (const o of orderCounts) {
      orderCountMap.set(o.user_id, (orderCountMap.get(o.user_id) ?? 0) + 1);
    }
  }

  const total = count ?? 0;
  const totalPages = Math.ceil(total / limit);

  const data: AdminUser[] = profiles.map((p) => ({
    id: p.id,
    name: p.name,
    email: emailMap.get(p.id) ?? "",
    role: p.role ?? "user",
    highSchoolName: p.high_school_name,
    grade: p.grade,
    onboardingCompleted: p.onboarding_completed ?? false,
    createdAt: p.created_at,
    recordCount: recordCountMap.get(p.id) ?? 0,
    orderCount: orderCountMap.get(p.id) ?? 0,
  }));

  return NextResponse.json({
    data,
    total,
    page,
    limit,
    totalPages,
  });
};
