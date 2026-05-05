import type { RawClinic } from "./types";

const PLACES_BASE = "https://places.googleapis.com/v1";
const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.internationalPhoneNumber",
  "places.websiteUri",
  "places.rating",
  "places.userRatingCount",
].join(",");

export async function searchClinics(
  query: string,
  pageToken?: string
): Promise<{ clinics: RawClinic[]; nextPageToken?: string }> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_PLACES_API_KEY not set");

  const body: Record<string, unknown> = { textQuery: query, maxResultCount: 20 };
  if (pageToken) body.pageToken = pageToken;

  const res = await fetch(`${PLACES_BASE}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Places API error: ${res.status}`);
  const data = await res.json() as {
    places?: Record<string, unknown>[];
    nextPageToken?: string;
  };

  const clinics: RawClinic[] = (data.places ?? []).map((p) => ({
    placeId: p.id as string,
    clinicName: (p.displayName as { text: string })?.text ?? "",
    address: (p.formattedAddress as string) ?? "",
    phone: (p.internationalPhoneNumber as string) ?? null,
    website: (p.websiteUri as string) ?? null,
    googleRating: (p.rating as number) ?? null,
    reviewCount: (p.userRatingCount as number) ?? null,
    sourceQuery: query,
  }));

  return { clinics, nextPageToken: data.nextPageToken };
}

export async function getAllClinics(query: string): Promise<RawClinic[]> {
  const all: RawClinic[] = [];
  let pageToken: string | undefined;

  do {
    const { clinics, nextPageToken } = await searchClinics(query, pageToken);
    all.push(...clinics);
    pageToken = nextPageToken;
    // Places API requires a short delay between paginated requests
    if (pageToken) await new Promise((r) => setTimeout(r, 2000));
  } while (pageToken);

  return all;
}
