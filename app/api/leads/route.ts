import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

const LeadSchema = z.object({
  name:           z.string().min(1),
  clinic_name:    z.string().min(1),
  email:          z.string().email(),
  role:           z.string().optional(),
  phone:          z.string().optional(),
  clinic_type:    z.string().optional(),
  location_count: z.string().optional(),
  website_url:    z.string().optional(),
  pain_points:    z.array(z.string()).optional(),
  interest:       z.array(z.string()).optional(),
  message:        z.string().optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid fields.", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Unable to submit. Please try again." }, { status: 500 });
  }

  const { error } = await supabase.from("clinicrelay_leads").insert(parsed.data);
  if (error) {
    return NextResponse.json({ error: "Unable to submit. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
