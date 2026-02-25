import { NextResponse } from "next/server";

import { createClient } from "@/libs/supabase/server";

export const POST = async () => {
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

  const { error } = await supabase
    .from("profiles")
    .update({
      onboarding_completed: true,
      onboarding_step: 2,
    })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json(
      { error: "온보딩 완료 처리에 실패했습니다." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
};
