export type CommodityCategory =
  | "unggas_daging"
  | "bumbu_sayur"
  | "sembako"
  | "minyak_gula";

export interface CommodityInfo {
  id: string;
  name: string;
  category: CommodityCategory;
  unit: string; // e.g. "kg", "liter", "butir"
  defaultPurchasePrice: number;
  defaultSellingPrice: number;
  defaultTransportCost: number;
  defaultWastePct: number;
  targetMarginPct: number;
  hetPrice?: number; // Harga Eceran Tertinggi if regulated (e.g. Minyakita)
  description: string;
}
