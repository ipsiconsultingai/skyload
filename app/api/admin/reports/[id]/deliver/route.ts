import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { createClient } from "@/libs/supabase/server";
import { createAdminClient } from "@/libs/supabase/admin";
import { sendReportEmail } from "@/libs/email/send-report";

import { verifyAdmin } from "../../helpers";

interface DeliverBody {
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

  let body: DeliverBody = {};
  try {
    body = await request.json();
  } catch {
    // Empty body is acceptable
  }

  // Fetch report with order and user info
  const { data: report, error: fetchError } = await supabase
    .from("reports")
    .select(
      `
      id,
      content,
      order_id,
      reviewed_at,
      delivered_at,
      orders!inner (
        id,
        user_id,
        profiles!inner (
          name
        ),
        plans!inner (
          name,
          display_name
        )
      )
    `
    )
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

  if (report.delivered_at) {
    return NextResponse.json(
      { error: "이미 발송된 리포트입니다." },
      { status: 409 }
    );
  }

  // If not already reviewed, do review first
  if (!report.reviewed_at) {
    const { error: reviewError } = await supabase
      .from("reports")
      .update({
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
        review_notes: body.reviewNotes || null,
      })
      .eq("id", id);

    if (reviewError) {
      console.error("Review update error:", reviewError);
      return NextResponse.json(
        { error: "검수 처리에 실패했습니다." },
        { status: 500 }
      );
    }
  }

  // Get user email via admin client
  const orders = report.orders as unknown as Record<string, unknown>;
  const userProfile = orders.profiles as unknown as Record<string, unknown>;
  const plan = orders.plans as unknown as Record<string, unknown>;
  const targetUserId = orders.user_id as string;

  const adminClient = createAdminClient();
  let userEmail = "";
  if (adminClient) {
    try {
      const {
        data: { user: authUser },
      } = await adminClient.auth.admin.getUserById(targetUserId);
      userEmail = authUser?.email || "";
    } catch {
      // Email not available
    }
  }

  // Send email
  let emailSent = true;
  try {
    if (!userEmail) {
      throw new Error("사용자 이메일을 찾을 수 없습니다.");
    }

    await sendReportEmail({
      to: userEmail,
      userName: (userProfile.name as string) || "고객",
      planName: (plan.display_name as string) || (plan.name as string) || "",
    });
  } catch (emailError) {
    console.error("Email send error:", emailError);
    emailSent = false;
  }

  // Update delivered_at regardless of email result (review was already saved)
  const { error: deliverError } = await supabase
    .from("reports")
    .update({
      delivered_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (deliverError) {
    console.error("Deliver update error:", deliverError);
    return NextResponse.json(
      { error: "발송 상태 업데이트에 실패했습니다." },
      { status: 500 }
    );
  }

  // Update order status
  const { error: orderError } = await supabase
    .from("orders")
    .update({ status: "delivered" })
    .eq("id", report.order_id);

  if (orderError) {
    console.error("Order status update error:", orderError);
  }

  if (!emailSent) {
    return NextResponse.json(
      {
        success: true,
        warning: "이메일 발송에 실패했습니다. 다시 시도해주세요.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
};
