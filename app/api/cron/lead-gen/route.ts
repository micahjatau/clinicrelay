import { NextResponse } from "next/server";
import { runPipeline } from "@/lib/lead-gen/pipeline";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cities = process.env.LEAD_GEN_CITIES?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  const types = process.env.LEAD_GEN_TYPES?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];

  if (!cities.length || !types.length) {
    return NextResponse.json(
      { error: "LEAD_GEN_CITIES and LEAD_GEN_TYPES must be configured" },
      { status: 400 }
    );
  }

  try {
    const results = await runPipeline({ cities, types });
    return NextResponse.json({ ok: true, results });
  } catch (err) {
    console.error("[cron/lead-gen] Pipeline failed:", err);
    return NextResponse.json({ error: "Pipeline failed" }, { status: 500 });
  }
}
