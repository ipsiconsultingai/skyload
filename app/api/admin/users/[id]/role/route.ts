import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/libs/supabase/server";

interface RoleChangeBody {
  role: "user" | "admin";
}

export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<{ success: boolean } | { error: string }>> => {
  const { id } = await params;

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

  let body: RoleChangeBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const { role } = body;

  if (role !== "user" && role !== "admin") {
    return NextResponse.json(
      { error: "유효하지 않은 역할입니다." },
      { status: 400 }
    );
  }

  // Check if target user exists (admin RLS allows reading all profiles)
  const { data: targetProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", id)
    .single();

  if (!targetProfile) {
    return NextResponse.json(
      { error: "사용자를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  // If demoting an admin to user, ensure at least one admin remains
  if (targetProfile.role === "admin" && role === "user") {
    const { count } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");

    if (count !== null && count <= 1) {
      return NextResponse.json(
        {
          error:
            "마지막 관리자의 역할을 변경할 수 없습니다. " +
            "최소 1명의 관리자가 필요합니다.",
        },
        { status: 400 }
      );
    }
  }

  // Update role (admin RLS allows updating profiles)
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", id);

  if (updateError) {
    console.error("역할 변경 오류:", updateError);
    return NextResponse.json(
      { error: "역할 변경에 실패했습니다." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
};
