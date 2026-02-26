import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { createClient } from "@/libs/supabase/server";

import { verifyAdmin } from "../../helpers";

interface ReviewBody {
  reviewNotes?: string;
}

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const supabase = await createClient();

  const { userId, error: authError } = await verifyAdmin(supabase);
  if (authError) return authError;

  let body: ReviewBody = {};
  try {
    body = await request.json();
  } catch {
    // Empty body is acceptable
  }

  // Check report exists and has content
  const { data: report, error: fetchError } = await supabase
    .from("reports")
    .select("id, content, order_id, reviewed_at")
    .eq("id", id)
    .single();

  if (fetchError || !report) {
    return NextResponse.json(
      { error: "리포트를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  if (report.content === null) {
    return NextResponse.json(
      { error: "AI가 아직 리포트를 생성하지 않았습니다." },
      { status: 400 }
    );
  }

  // Update report with review info
  const { error: updateError } = await supabase
    .from("reports")
    .update({
      reviewed_by: userId,
      reviewed_at: new Date().toISOString(),
      review_notes: body.reviewNotes || null,
    })
    .eq("id", id);

  if (updateError) {
    console.error("Review update error:", updateError);
    return NextResponse.json(
      { error: "검수 처리에 실패했습니다." },
      { status: 500 }
    );
  }

  // Update order status
  const { error: orderError } = await supabase
    .from("orders")
    .update({ status: "review_complete" })
    .eq("id", report.order_id);

  if (orderError) {
    console.error("Order status update error:", orderError);
  }

  return NextResponse.json({ success: true });
};
