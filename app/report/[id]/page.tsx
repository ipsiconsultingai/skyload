import { notFound, redirect } from "next/navigation";

import { createClient } from "@/libs/supabase/server";
import type { ReportContent } from "@/libs/report/types";

import { ReportRenderer } from "../_templates";

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

const ReportPage = async ({ params }: ReportPageProps) => {
  const { id } = await params;
  const supabase = await createClient();

  // 인증 확인
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // 리포트 조회 (소유권 확인 포함)
  const { data: report, error: queryError } = await supabase
    .from("reports")
    .select(
      `
      id,
      content,
      ai_status,
      delivered_at,
      orders!inner (
        user_id
      )
    `
    )
    .eq("id", id)
    .single();

  if (queryError || !report) {
    notFound();
  }

  // 소유자 또는 관리자만 열람 가능
  const orders = report.orders as unknown as { user_id: string };
  if (orders.user_id !== user.id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      notFound();
    }
  }

  // 리포트 콘텐츠가 아직 없는 경우
  if (!report.content) {
    redirect(`/report/${id}/generating`);
  }

  const content = report.content as unknown as ReportContent;

  return <ReportRenderer data={content} />;
};

export default ReportPage;
