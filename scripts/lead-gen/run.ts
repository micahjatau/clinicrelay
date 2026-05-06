import { runPipeline } from "../../lib/lead-gen/pipeline";

function parseArg(args: string[], flag: string): string[] {
  const idx = args.indexOf(flag);
  if (idx === -1 || idx + 1 >= args.length) return [];
  return args[idx + 1].split(",").map((s) => s.trim()).filter(Boolean);
}

async function main() {
  const args = process.argv.slice(2);
  const cities = parseArg(args, "--cities");
  const types = parseArg(args, "--types");

  if (!cities.length || !types.length) {
    console.error("Usage: npm run lead-gen -- --cities \"Austin TX,Dallas TX\" --types dental,medical");
    process.exit(1);
  }

  console.log(`[lead-gen] Starting run for cities: ${cities.join(", ")} | types: ${types.join(", ")}`);

  try {
    const results = await runPipeline({ cities, types });
    console.log("\n[lead-gen] Run complete:");
    for (const r of results) {
      console.log(`  ${r.city} / ${r.clinicType}: ${r.discovered} discovered, ${r.enriched} enriched`);
    }
  } catch (err) {
    console.error("[lead-gen] Fatal error:", err);
    process.exit(1);
  }
}

main();
