import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/libs/supabase/server";

export const PUT = async (request: NextRequest) => {
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

  let body: { step: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const { step } = body;

  if (!step || step < 1 || step > 2) {
    return NextResponse.json(
      { error: "유효하지 않은 단계입니다." },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("profiles")
    .update({ onboarding_step: step })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json(
      { error: "단계 업데이트에 실패했습니다." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
};
