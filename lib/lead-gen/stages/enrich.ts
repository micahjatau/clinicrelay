import { enrichClinic } from "../sgai";
import type { RawClinic, EnrichedClinic } from "../types";

const CONCURRENCY = 5;

export async function enrich(clinics: RawClinic[]): Promise<EnrichedClinic[]> {
  const results: EnrichedClinic[] = new Array(clinics.length);

  for (let i = 0; i < clinics.length; i += CONCURRENCY) {
    const batch = clinics.slice(i, i + CONCURRENCY);
    const enriched = await Promise.all(
      batch.map(async (clinic) => {
        if (!clinic.website) {
          return { ...clinic, ownerName: null, email: null };
        }
        const { ownerName, email } = await enrichClinic(clinic.website);
        return { ...clinic, ownerName, email };
      })
    );
    enriched.forEach((c, j) => { results[i + j] = c; });
  }

  return results;
}
