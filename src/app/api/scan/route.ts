export const runtime = "nodejs";

import { NextResponse } from "next/server";
import type { ScanResponse } from "@/lib/types";
import { scanWithAxe } from "@/lib/scanner/scanWithAxe";

export async function POST(req: Request) {
  try {
    const { url } = (await req.json()) as { url?: string };

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        {
          ok: false,
          violations: [],
          error: "Missing url",
        } satisfies ScanResponse,
        { status: 400 }
      );
    }

    const result = await scanWithAxe(url);

    if (!result.ok) {
      // ✅ return the error string in the response (you already show it in UI)
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        violations: [],
        error: `${e?.message ?? "Scan failed"}\n${e?.stack ?? ""}`,
      } satisfies ScanResponse,
      { status: 500 }
    );
  }
}
