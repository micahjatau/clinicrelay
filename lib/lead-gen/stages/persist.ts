import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { EnrichedClinic, RunResult } from "../types";

export async function persistClinics(
  clinics: EnrichedClinic[],
  city: string,
  clinicType: string
): Promise<RunResult> {
  const db = getSupabaseAdminClient();
  if (!db) throw new Error("Supabase admin client unavailable");

  const rows = clinics.map((c) => ({
    place_id: c.placeId,
    clinic_name: c.clinicName,
    address: c.address,
    phone: c.phone,
    website: c.website,
    google_rating: c.googleRating,
    review_count: c.reviewCount,
    owner_name: c.ownerName,
    email: c.email,
    source_query: c.sourceQuery,
    updated_at: new Date().toISOString(),
  }));

  const { error: upsertError } = await db
    .from("outbound_prospects")
    .upsert(rows, {
      onConflict: "place_id",
      ignoreDuplicates: false,
    });

  if (upsertError) throw new Error(upsertError.message);

  const enriched = clinics.filter((c) => c.ownerName !== null || c.email !== null).length;

  const { error: insertError } = await db.from("prospect_runs").insert({
    city,
    clinic_type: clinicType,
    count_discovered: clinics.length,
    count_enriched: enriched,
  });

  if (insertError) throw new Error(insertError.message);

  return { city, clinicType, discovered: clinics.length, enriched };
}
