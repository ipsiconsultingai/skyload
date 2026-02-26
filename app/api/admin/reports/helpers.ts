import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { ReportStatus } from "@/app/admin/types";

export const verifyAdmin = async (
  supabase: SupabaseClient
): Promise<
  { userId: string; error: null } | { userId: null; error: NextResponse }
> => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      userId: null,
      error: NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      ),
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return {
      userId: null,
      error: NextResponse.json(
        { error: "관리자 권한이 필요합니다." },
        { status: 403 }
      ),
    };
  }

  return { userId: user.id, error: null };
};

export const deriveReportStatus = (row: {
  content: unknown;
  ai_generated_at: string | null;
  reviewed_at: string | null;
  delivered_at: string | null;
}): ReportStatus => {
  if (row.delivered_at) return "delivered";
  if (row.reviewed_at) return "review_complete";
  if (row.content !== null) return "review_pending";
  return "ai_pending";
};

export const STATUS_LABEL_MAP: Record<ReportStatus, string> = {
  ai_pending: "AI 생성 대기",
  review_pending: "검수 대기",
  review_complete: "검수 완료",
  delivered: "발송 완료",
};
