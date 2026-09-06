import type { BusinessRole } from "@/types/user";

export interface DemoScenario {
  id: "A" | "B" | "C";
  title: string;
  tag: string;
  commodityId: string;
  role: BusinessRole;
  purchasePrice: number;
  transportCost: number;
  wastePct: number;
  sellingPrice: number;
  targetMarginPct: number;
  storyDescription: string;
  userPrompt: string;
  suggestedSupplierId?: string;
  negotiationDraft?: string;
}

export const DEMO_SCENARIOS: Record<"A" | "B" | "C", DemoScenario> = {
  A: {
    id: "A",
    title: "Skenario A: Supplier Naik → Margin Tertekan",
    tag: "Ayam Ras (Warteg)",
    commodityId: "ayam_ras",
    role: "warteg",
    purchasePrice: 36500,
    transportCost: 1500,
    wastePct: 5,
    sellingPrice: 45000,
    targetMarginPct: 18,
    storyDescription:
      "Harga ayam potong dari Pak Slamet melonjak dari Rp32.000 ke Rp36.500/kg. Warteg menjual menu ayam Rp45.000/ekor (atau porsi olahan). Margin anjlok ke 11,1% (target 18%). Bob merekomendasikan negosiasi supplier atau kontrol porsi sebelum menaikkan harga jual.",
    userPrompt:
      "Harga ayam supplier saya dari Rp32.000 jadi Rp36.500/kg. Saya jual ayam olahan Rp45.000. Margin saya sekarang bagaimana? Perlu naikkan harga tidak?",
    suggestedSupplierId: "SUP-01",
    negotiationDraft:
      "Halo Pak Slamet (CV Barokah), terkait kenaikan harga ayam jadi Rp36.500/kg, apakah ada potongan harga volume jika kami ambil rutin 25 kg/hari? Mohon infonya ya pak.",
  },
  B: {
    id: "B",
    title: "Skenario B: Harga Pasar Stabil / Batas HET",
    tag: "Minyakita (Warung Kelontong)",
    commodityId: "minyak_goreng_curah",
    role: "warung_kelontong",
    purchasePrice: 14800,
    transportCost: 400,
    wastePct: 1,
    sellingPrice: 15700,
    targetMarginPct: 10,
    storyDescription:
      "Supplier menawarkan Minyakita Rp14.800/liter. Pedagang tergoda menaikkan harga jual jadi Rp16.500. Namun Bob mengingatkan batas HET resmi pemerintah adalah Rp15.700/liter dan harga pasar lokal Rp15.700. Menaikkan harga melanggar regulasi dan ditinggal pelanggan.",
    userPrompt:
      "Minyakita modal beli saya Rp14.800. Mau saya jual Rp16.500 biar untung lumayan, aman tidak ya?",
    suggestedSupplierId: "SUP-03",
    negotiationDraft:
      "Selamat siang Koh Welly, harga Minyakita Rp14.800 agak mepet dengan HET eceran Rp15.700. Bisa dapat harga grosir kartonan Rp14.200 untuk ambil 5 karton?",
  },
  C: {
    id: "C",
    title: "Skenario C: Negosiasi Supplier Alternatif",
    tag: "Cabai Rawit (Pedagang Pasar)",
    commodityId: "cabai_rawit_merah",
    role: "pedagang_pasar",
    purchasePrice: 60000,
    transportCost: 2000,
    wastePct: 8,
    sellingPrice: 70000,
    targetMarginPct: 20,
    storyDescription:
      "Harga cabai rawit merah grosir melonjak ke Rp60.000. Margin tersisa 4,8% (kritis). Bob membandingkan supplier, mendeteksi harga pasar Surabaya Rp62.000, dan menyiapkan draf pesan negosiasi WhatsApp dengan otorisasi manusia.",
    userPrompt:
      "Cabai rawit merah kulakan Rp60.000/kg. Susut timbangan 8%. Jual Rp70.000 hampir gak ada sisa untung. Ada saran?",
    suggestedSupplierId: "SUP-02",
    negotiationDraft:
      "Assalamu'alaikum Haji Munir, cabai rawit merah Rp60.000 modalnya berat sekali dengan susut 8%. Bisakah dapat sortiran grade B di Rp54.000 atau diskon Rp56.000 untuk 20 kg besok?",
  },
};
