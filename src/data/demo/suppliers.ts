import type { Supplier } from "@/types/supplier";

export const DEMO_SUPPLIERS: Supplier[] = [
  {
    id: "SUP-01",
    name: "CV Barokah Unggas Jaya",
    contactPerson: "Pak Slamet",
    phone: "0812-3456-7890",
    commodities: ["ayam_ras", "telur_ayam_ras"],
    lastPrice: {
      ayam_ras: 36500,
      telur_ayam_ras: 26500,
    },
    rating: 4.8,
    location: "Krian, Sidoarjo",
  },
  {
    id: "SUP-02",
    name: "UD Hasil Bumi Nusantara",
    contactPerson: "Haji Munir",
    phone: "0813-9876-5432",
    commodities: ["cabai_rawit_merah", "cabai_merah_keriting", "bawang_merah", "bawang_putih"],
    lastPrice: {
      cabai_rawit_merah: 58000,
      cabai_merah_keriting: 42000,
      bawang_merah: 32000,
      bawang_putih: 36000,
    },
    rating: 4.6,
    location: "Pasar Induk Keputran, Surabaya",
  },
  {
    id: "SUP-03",
    name: "Grosir Sembako Rejeki Baru",
    contactPerson: "Koh Welly",
    phone: "0811-2233-4455",
    commodities: ["minyak_goreng_curah", "minyak_goreng_kemasan", "beras_medium", "beras_premium", "gula_pasir"],
    lastPrice: {
      minyak_goreng_curah: 14500,
      minyak_goreng_kemasan: 18500,
      beras_medium: 11800,
      beras_premium: 14200,
      gula_pasir: 16000,
    },
    rating: 4.9,
    location: "Kawasan Pergudangan Margomulyo, Surabaya",
  },
  {
    id: "SUP-04",
    name: "Sentra Daging Halal Surabaya",
    contactPerson: "Pak Darsono",
    phone: "0852-7788-9900",
    commodities: ["daging_sapi"],
    lastPrice: {
      daging_sapi: 115000,
    },
    rating: 4.7,
    location: "Pegirian, Semampir, Surabaya",
  },
];

export function getSupplierById(id: string): Supplier | undefined {
  return DEMO_SUPPLIERS.find((s) => s.id.toUpperCase() === id.toUpperCase());
}

export function getSuppliersForCommodity(commodityId: string): Supplier[] {
  return DEMO_SUPPLIERS.filter((s) => s.commodities.includes(commodityId));
}
