export type PriceSource = "PIHPS" | "Bapanas" | "SP2KP" | "BPS" | "DEMO";

export interface PriceItem {
  source: PriceSource;
  value: number;
  marketName?: string;
  sourceTime?: string;
}

export interface MarketPriceResult {
  commodity: string;
  commodity_name: string;
  city: string;
  prices: PriceItem[];
  median_reference: number;
  min_price: number;
  max_price: number;
  unit: string;
  source_time: string;
  is_demo: boolean;
}
