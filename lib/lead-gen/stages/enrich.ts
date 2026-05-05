import { enrichClinic } from "../sgai";
import type { RawClinic, EnrichedClinic } from "../types";

export async function enrich(clinics: RawClinic[]): Promise<EnrichedClinic[]> {
  return Promise.all(
    clinics.map(async (clinic) => {
      if (!clinic.website) {
        return { ...clinic, ownerName: null, email: null };
      }
      const { ownerName, email } = await enrichClinic(clinic.website);
      return { ...clinic, ownerName, email };
    })
  );
}
