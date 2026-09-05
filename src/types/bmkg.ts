export type WarningStatus =
  | "active"
  | "expired"
  | "upcoming"
  | "no_match"
  | "unavailable"
  | "ambiguous";

export type MatchConfidence =
  | "exact"
  | "normalized"
  | "probable"
  | "ambiguous"
  | "no_match";

export interface BmkgWarning {
  id: string;
  event: string;
  headline: string;
  description: string;
  effective: Date;
  expires: Date;
  senderName: string;
  areas: string[];
  polygon?: string;
  sourceUrl?: string;
  severity?: string;
  urgency?: string;
  certainty?: string;
  sent: Date;
}

export interface WarningMatchResult {
  matched: boolean;
  status: WarningStatus;
  warning: BmkgWarning | null;
  matchedLocation: string | null;
  confidence: MatchConfidence;
  matchedField: string | null;
  reason: string;
  source: "BMKG";
}
