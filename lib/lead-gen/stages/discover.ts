import { getAllClinics } from "../places";
import type { RawClinic } from "../types";

export async function discover(cities: string[], types: string[]): Promise<RawClinic[]> {
  const all: RawClinic[] = [];

  for (const city of cities) {
    for (const type of types) {
      const query = `${type} clinic in ${city}`;
      try {
        const clinics = await getAllClinics(query);
        all.push(...clinics);
      } catch (err) {
        console.error(`discover: failed for query "${query}":`, err);
      }
    }
  }

  return all;
}
