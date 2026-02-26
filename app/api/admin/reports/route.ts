import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { createClient } from "@/libs/supabase/server";
import { createAdminClient } from "@/libs/supabase/admin";
import type { AdminReport, PaginatedResponse } from "@/app/admin/types";

import { verifyAdmin, deriveReportStatus } from "./helpers";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

export const GET = async (request: NextRequest) => {
  const supabase = await createClient();

  const { error: authError } = await verifyAdmin(supabase);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const page = Math.max(
    1,
    parseInt(searchParams.get("page") || `${DEFAULT_PAGE}`, 10)
  );
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") || `${DEFAULT_LIMIT}`, 10))
  );
  const search = searchParams.get("search")?.trim() || "";
  const statusFilter = searchParams.get("status") || "";
  const planFilter = searchParams.get("plan") || "";

  const offset = (page - 1) * limit;

  // Query reports with joins
  let query = supabase
    .from("reports")
    .select(
      `
      id,
      content,
      ai_generated_at,
      reviewed_at,
      delivered_at,
      review_notes,
      reviewed_by,
      target_university_id,
      orders!inner (
        id,
        user_id,
        profiles!inner (
          id,
          name
        ),
        plans!inner (
          id,
          name,
          display_name
        )
      ),
      target_universities (
        university_name,
        department,
        admission_type
      ),
      reviewer:profiles!reports_reviewed_by_fkey (
        name
      )
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  // Search filter by user name
  if (search) {
    query = query.ilike("orders.profiles.name", `%${search}%`);
  }

  // Plan filter
  if (planFilter) {
    query = query.eq("orders.plans.name", planFilter);
  }

  // Status filter - we need to filter at the application level
  // because status is derived from multiple fields
  // For performance, apply DB-level conditions where possible
  if (statusFilter === "ai_pending") {
    query = query.is("content", null).is("ai_generated_at", null);
  } else if (statusFilter === "review_pending") {
    query = query.not("content", "is", null).is("reviewed_at", null);
  } else if (statusFilter === "review_complete") {
    query = query.not("reviewed_at", "is", null).is("delivered_at", null);
  } else if (statusFilter === "delivered") {
    query = query.not("delivered_at", "is", null);
  }

  // Get total count with a count-only query first, then paginate
  const {
    data: rows,
    error: queryError,
    count,
  } = await query.range(offset, offset + limit - 1);

  if (queryError) {
    console.error("Reports query error:", queryError);
    return NextResponse.json(
      { error: "리포트 목록을 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }

  // Get user emails via admin client (optional)
  const adminClient = createAdminClient();
  const userIds = [
    ...new Set(
      (rows || []).map(
        (r: Record<string, unknown>) =>
          (r.orders as Record<string, unknown>)?.user_id as string
      )
    ),
  ].filter(Boolean);

  const emailMap = new Map<string, string>();
  if (adminClient && userIds.length > 0) {
    const {
      data: { users },
    } = await adminClient.auth.admin.listUsers({
      perPage: 1000,
    });

    for (const u of users || []) {
      if (userIds.includes(u.id) && u.email) {
        emailMap.set(u.id, u.email);
      }
    }
  }

  const total = count || 0;
  const totalPages = Math.ceil(total / limit);

  const data: AdminReport[] = (rows || []).map(
    (row: Record<string, unknown>) => {
      const orders = row.orders as Record<string, unknown>;
      const profiles = orders?.profiles as Record<string, unknown>;
      const plans = orders?.plans as Record<string, unknown>;
      const targetUni = row.target_universities as Record<
        string,
        unknown
      > | null;
      const reviewer = row.reviewer as Record<string, unknown> | null;
      const userId = orders?.user_id as string;

      const universityParts = [
        targetUni?.university_name,
        targetUni?.department,
      ].filter(Boolean);
      const targetUniversity =
        universityParts.length > 0 ? universityParts.join(" ") : null;

      return {
        id: row.id as string,
        userName: (profiles?.name as string) || null,
        userEmail: emailMap.get(userId) || "",
        planName:
          (plans?.display_name as string) || (plans?.name as string) || "",
        targetUniversity,
        status: deriveReportStatus({
          content: row.content,
          ai_generated_at: row.ai_generated_at as string | null,
          reviewed_at: row.reviewed_at as string | null,
          delivered_at: row.delivered_at as string | null,
        }),
        aiGeneratedAt: (row.ai_generated_at as string) || null,
        reviewedBy: (reviewer?.name as string) || null,
        reviewedAt: (row.reviewed_at as string) || null,
        deliveredAt: (row.delivered_at as string) || null,
      };
    }
  );

  const response: PaginatedResponse<AdminReport> = {
    data,
    total,
    page,
    limit,
    totalPages,
  };

  return NextResponse.json(response);
};
