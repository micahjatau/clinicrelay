export interface RawClinic {
  placeId: string;
  clinicName: string;
  address: string;
  phone: string | null;
  website: string | null;
  googleRating: number | null;
  reviewCount: number | null;
  sourceQuery: string;
}

export interface EnrichedClinic extends RawClinic {
  ownerName: string | null;
  email: string | null;
}

export interface PipelineConfig {
  cities: string[];
  types: string[];
}

export interface RunResult {
  city: string;
  clinicType: string;
  discovered: number;
  enriched: number;
}
