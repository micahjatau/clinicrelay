import type { EnrichmentResult } from "./types";

export async function enrichClinic(websiteUrl: string): Promise<EnrichmentResult> {
  const apiKey = process.env.SGAI_API_KEY;
  if (!apiKey) throw new Error("SGAI_API_KEY not set");

  try {
    const res = await fetch("https://api.scrapegraphai.com/v1/smartscraper", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "SGAI-APIKEY": apiKey,
      },
      body: JSON.stringify({
        website_url: websiteUrl,
        user_prompt:
          "Find the practice owner, practice manager, or medical director name and any contact email address. Return owner_name (string or null) and email (string or null).",
      }),
    });

    if (!res.ok) return { ownerName: null, email: null };

    const data = await res.json() as { result?: Record<string, unknown> };
    const result = data.result ?? {};
    return {
      ownerName: (result.owner_name as string) || null,
      email: (result.email as string) || null,
    };
  } catch {
    return { ownerName: null, email: null };
  }
}
