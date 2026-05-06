import { discover } from "./stages/discover";
import { enrich } from "./stages/enrich";
import { persistClinics } from "./stages/persist";
import type { PipelineConfig, RunResult } from "./types";

export async function runPipeline(config: PipelineConfig): Promise<RunResult[]> {
  const { cities, types } = config;
  const results: RunResult[] = [];

  for (const city of cities) {
    for (const type of types) {
      console.log(`[lead-gen] Discovering ${type} clinics in ${city}...`);
      const raw = await discover([city], [type]);
      console.log(`[lead-gen] Found ${raw.length} clinics. Enriching...`);

      const enriched = await enrich(raw);
      const enrichedCount = enriched.filter((c) => c.ownerName || c.email).length;
      console.log(`[lead-gen] Enriched ${enrichedCount}/${raw.length}. Persisting...`);

      const result = await persistClinics(enriched, city, type);
      results.push(result);
      console.log(`[lead-gen] Done: ${city} / ${type} — ${result.discovered} discovered, ${result.enriched} enriched.`);
    }
  }

  return results;
}
