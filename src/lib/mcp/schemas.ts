import { z } from "zod";

// Tool 1: get_market_prices
export const getMarketPricesInputSchema = z.object({
  commodity: z.string().describe("Nama komoditas (contoh: ayam, cabai_rawit_merah, beras_medium)"),
  city: z.string().default("Surabaya").describe("Kota/Kabupaten pemantauan pasar"),
  date: z.string().optional().describe("Tanggal acuan harga (YYYY-MM-DD)"),
});

export const getMarketPricesOutputSchema = z.object({
  commodity: z.string(),
  commodity_name: z.string(),
  city: z.string(),
  prices: z.array(
    z.object({
      source: z.string(),
      value: z.number(),
      marketName: z.string().optional(),
      sourceTime: z.string().optional(),
    })
  ),
  median_reference: z.number(),
  min_price: z.number(),
  max_price: z.number(),
  unit: z.string(),
  source_time: z.string(),
  is_demo: z.boolean(),
});

// Tool 2: calculate_margin
export const calculateMarginInputSchema = z.object({
  purchase_price: z.number().positive().describe("Harga beli / modal kulakan awal"),
  transport_cost: z.number().nonnegative().default(0).describe("Biaya transportasi atau bensin kulakan per unit"),
  waste_pct: z.number().min(0).max(95).default(0).describe("Persentase susut fisik / penyusutan timbangan (0-95%)"),
  selling_price: z.number().positive().describe("Harga jual yang direncanakan atau yang berlaku saat ini"),
});

export const calculateMarginOutputSchema = z.object({
  purchase_price: z.number(),
  transport_cost: z.number(),
  waste_pct: z.number(),
  selling_price: z.number(),
  effective_cost: z.number(),
  gross_profit: z.number(),
  gross_margin_pct: z.number(),
  markup_pct: z.number(),
  status: z.enum(["healthy", "warning", "critical"]),
});

// Tool 3: suggest_price_action
export const suggestPriceActionInputSchema = z.object({
  commodity: z.string().describe("Nama komoditas"),
  current_margin_pct: z.number().describe("Margin riil saat ini (%)"),
  target_margin_pct: z.number().default(15).describe("Target margin pedagang (%)"),
  market_reference: z.number().positive().describe("Harga acuan pasar lokal (median dari SP2KP/PIHPS/Bapanas)"),
  selling_price: z.number().positive().describe("Harga jual aktual pedagang"),
  effective_cost: z.number().optional().describe("Biaya efektif per unit"),
  role: z.enum(["warung_kelontong", "warteg", "pedagang_pasar", "umkm_kuliner"]).default("warteg"),
});

export const suggestPriceActionOutputSchema = z.object({
  action: z.enum(["HOLD", "OPTIMIZE", "REVIEW_COST", "REVIEW_PRICE", "PORTION_CONTROL", "SUPPLIER_SWITCH"]),
  headline: z.string(),
  options: z.array(z.string()),
  confidence: z.enum(["high", "medium", "low"]),
  requires_confirmation: z.literal(true),
  reasoning: z.string(),
  het_warning: z.string().optional(),
  suggested_supplier_msg: z.string().optional(),
});

// Tool 4: notify_supplier
export const notifySupplierInputSchema = z.object({
  supplier_id: z.string().describe("ID supplier tujuan (contoh: SUP-01)"),
  message: z.string().min(5).describe("Isi draf pesan negosiasi / konfirmasi"),
  confirmed: z.boolean().describe("Wajib true. Aksi hanya diproses jika pengguna mengonfirmasi tombol eksplisit."),
  commodity: z.string().optional().describe("Nama komoditas terkait"),
  channel: z.enum(["whatsapp", "email", "mock"]).default("whatsapp"),
});

export const notifySupplierOutputSchema = z.object({
  sent: z.boolean(),
  channel: z.string(),
  timestamp: z.string(),
  message: z.string(),
  error: z.string().optional(),
});
