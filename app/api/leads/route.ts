import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { notifyNewLead } from "@/lib/email/notify";
import { getLeadsRatelimit, getClientIp } from "@/lib/ratelimit/leads";

const optionalText = z.string().trim().min(1).optional().or(z.literal(""));

const LeadSchema = z.object({
  name:           z.string().trim().min(1),
  clinic_name:    z.string().trim().min(1),
  email:          z.string().trim().email(),
  role:           optionalText,
  phone:          optionalText,
  clinic_type:    optionalText,
  location_count: optionalText,
  website_url:    optionalText,
  pain_points:    z.array(z.string().trim().min(1)).optional(),
  interest:       z.array(z.string().trim().min(1)).optional(),
  message:        optionalText,
  company:        optionalText,
});

export async function POST(request: Request) {
  const limiter = getLeadsRatelimit();
  if (limiter) {
    const ip = getClientIp(request);
    const { success, reset } = await limiter.limit(ip);
    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      process.env.NODE_ENV === "development"
        ? { error: "Invalid fields.", issues: parsed.error.issues }
        : { error: "Invalid fields." },
      { status: 422 }
    );
  }

  if (parsed.data.company && parsed.data.company.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const { ...rawLead } = parsed.data;
  const lead = Object.fromEntries(
    Object.entries(rawLead).filter(([key, value]) => {
      if (key === "company") return false;
      if (value === "") return false;
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null;
    })
  );

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    console.error("Lead submission failed: Supabase admin client unavailable (missing env vars)");
    return NextResponse.json({ error: "Unable to submit. Please try again." }, { status: 500 });
  }

  const { error } = await supabase.from("clinicrelay_leads").insert(lead);
  if (error) {
    console.error("Lead insert failed:", error);
    return NextResponse.json({ error: "Unable to submit. Please try again." }, { status: 500 });
  }

  notifyNewLead(parsed.data as Parameters<typeof notifyNewLead>[0]).catch(() => {});

  return NextResponse.json({ ok: true });
}
