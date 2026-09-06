export type BusinessRole =
  | "warung_kelontong"
  | "warteg"
  | "pedagang_pasar"
  | "umkm_kuliner";

export interface BusinessRoleInfo {
  id: BusinessRole;
  label: string;
  description: string;
  defaultTargetMarginPct: number;
}

export const BUSINESS_ROLES: BusinessRoleInfo[] = [
  {
    id: "warteg",
    label: "Warteg / Kedai Makan",
    description: "Mengolah bahan baku mentah menjadi menu makanan siap saji",
    defaultTargetMarginPct: 20,
  },
  {
    id: "warung_kelontong",
    label: "Warung Kelontong",
    description: "Menjual sembako dan barang kebutuhan pokok eceran",
    defaultTargetMarginPct: 12,
  },
  {
    id: "pedagang_pasar",
    label: "Pedagang Pasar Tradisional",
    description: "Membeli grosir / partai besar dan menjual eceran di pasar",
    defaultTargetMarginPct: 15,
  },
  {
    id: "umkm_kuliner",
    label: "UMKM Makanan Olahan",
    description: "Produksi makanan ringan, katering, dan olahan komoditas",
    defaultTargetMarginPct: 25,
  },
];

export interface UserLocation {
  province: string;
  city: string;
  market?: string;
}
