import { NextRequest, NextResponse } from "next/server";

import { env } from "@/env";

interface NeisSchoolRow {
  SCHUL_NM: string;
  SCHUL_KND_SC_NM: string;
  ORG_RDNMA: string;
}

interface NeisResponse {
  schoolInfo?: [{ head: unknown[] }, { row: NeisSchoolRow[] }];
}

export const GET = async (request: NextRequest) => {
  const q = request.nextUrl.searchParams.get("q");

  if (!q || q.length < 2) {
    return NextResponse.json(
      { error: "검색어는 2자 이상 입력해주세요." },
      { status: 400 }
    );
  }

  const apiKey = env.NEIS_API_KEY;

  if (!apiKey) {
    return NextResponse.json([]);
  }

  const url = new URL("https://open.neis.go.kr/hub/schoolInfo");
  url.searchParams.set("KEY", apiKey);
  url.searchParams.set("Type", "json");
  url.searchParams.set("pIndex", "1");
  url.searchParams.set("pSize", "20");
  url.searchParams.set("SCHUL_NM", q);
  url.searchParams.set("SCHUL_KND_SC_NM", "고등학교");

  try {
    const response = await fetch(url.toString());
    const data: NeisResponse = await response.json();

    const rows = data.schoolInfo?.[1]?.row;

    if (!rows) {
      return NextResponse.json([]);
    }

    const schools = rows.map((row) => ({
      name: row.SCHUL_NM,
      type: row.SCHUL_KND_SC_NM,
      address: row.ORG_RDNMA,
    }));

    return NextResponse.json(schools);
  } catch {
    return NextResponse.json([]);
  }
};
