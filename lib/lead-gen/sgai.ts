import type { EnrichmentResult } from "./types";

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[a-z]{2,}/i;
// Matches "Dr. Jane Smith" or "Owner: Jane Smith" — name part uses strict [A-Z][a-z]+ to avoid sentence fragments
const DR_RE = /Dr\.\s+([A-Z][a-z]+(?: [A-Z][a-z]+)+)/;
const KEYWORD_RE = /(?:owner|manager|director|contact)[:\s]+\s*([A-Z][a-z]+(?: [A-Z][a-z]+)+)/i;

export async function enrichClinic(websiteUrl: string): Promise<EnrichmentResult> {
  const apiKey = process.env.SGAI_API_KEY;
  if (!apiKey) throw new Error("SGAI_API_KEY not set");

  try {
    const res = await fetch("https://v2-api.scrapegraphai.com/api/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "SGAI-APIKEY": apiKey,
      },
      body: JSON.stringify({
        url: websiteUrl,
        formats: [{ type: "markdown", mode: "normal" }],
        fetchConfig: { mode: "auto", stealth: false, timeout: 30000, wait: 0, scrolls: 0, mock: false },
      }),
    });

    if (!res.ok) return { ownerName: null, email: null };

    const data = (await res.json()) as Record<string, unknown>;
    const markdown = extractMarkdown(data);
    if (!markdown) return { ownerName: null, email: null };

    return {
      ownerName: DR_RE.exec(markdown)?.[1] ?? KEYWORD_RE.exec(markdown)?.[1] ?? null,
      email: EMAIL_RE.exec(markdown)?.[0] ?? null,
    };
  } catch {
    return { ownerName: null, email: null };
  }
}

function extractMarkdown(data: Record<string, unknown>): string | null {
  if (typeof data.content === "string") return data.content;
  if (Array.isArray(data.result)) {
    const md = (data.result as Array<Record<string, unknown>>).find((r) => r.type === "markdown");
    if (typeof md?.content === "string") return md.content;
  }
  if (Array.isArray(data.formats)) {
    const md = (data.formats as Array<Record<string, unknown>>).find((r) => r.type === "markdown");
    if (typeof md?.content === "string") return md.content;
  }
  return null;
}
