export interface BpsDataset {
  subject_id: string;
  subject_name: string;
  category_id?: string | null;
  category_name?: string | null;
}

export interface BpsTimeSeriesPoint {
  period: string;
  value: number;
}

export interface BpsIndicator {
  indicator_id: string;
  region_code: string;
  table_id?: string | null;
  title: string;
  note?: string | null;
  last_updated?: string | null;
  record_count: number;
  time_series: BpsTimeSeriesPoint[];
}

export interface BpsRegion {
  region_code: string;
  region_name: string;
  level?: string | null;
}
