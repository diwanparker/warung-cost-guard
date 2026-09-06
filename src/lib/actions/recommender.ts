import { getCommodityById } from "@/data/commodities";
import { normalizeCommodity } from "@/lib/market/normalizer";
import { formatRupiah } from "@/lib/margin/calculator";
import { getSuppliersForCommodity } from "@/data/demo/suppliers";
import type { PriceActionInput, PriceActionOutput, PriceActionType } from "@/types/action";

export function suggestPriceAction(input: PriceActionInput): PriceActionOutput {
  const normalizedId = normalizeCommodity(input.commodity);
  const commodityInfo = getCommodityById(normalizedId);
  const targetMargin = input.target_margin_pct ?? commodityInfo?.targetMarginPct ?? 15;
  const currentMargin = input.current_margin_pct;
  const sellingPrice = input.selling_price;
  const marketRef = input.market_reference;
  const role = input.role || "warteg";

  const isMarginCritical = currentMargin < 8;
  const isMarginUnderTarget = currentMargin < targetMargin;
  const isPriceAboveMarket = sellingPrice > marketRef * 1.05;
  const isPriceBelowMarket = sellingPrice < marketRef * 0.92;

  let hetWarning: string | undefined;
  if (commodityInfo?.hetPrice) {
    if (sellingPrice > commodityInfo.hetPrice) {
      hetWarning = `PERINGATAN REGULASI: Harga jual ${formatRupiah(sellingPrice)} melebihi HET resmi pemerintah (${formatRupiah(commodityInfo.hetPrice)}). Berisiko sanksi peredaran.`;
    } else if (sellingPrice === commodityInfo.hetPrice) {
      hetWarning = `Harga jual Anda tepat di batas tertinggi HET resmi (${formatRupiah(commodityInfo.hetPrice)}). Margin tidak dapat dinaikkan melalui harga jual.`;
    }
  }

  let action: PriceActionType = "HOLD";
  let headline = "";
  const options: string[] = [];
  let reasoning = "";
  let confidence: "high" | "medium" | "low" = "medium";
  let suggestedSupplierMsg: string | undefined;

  const suppliers = getSuppliersForCommodity(normalizedId);
  const topSupplier = suppliers[0];

  if (hetWarning && isMarginUnderTarget) {
    action = "REVIEW_COST";
    headline = "Batas HET Tercapai — Efisiensi Modal Kulakan & Negosiasi Supplier";
    options.push("Negosiasikan potongan harga volume kulakan ke distributor");
    options.push("Minimalisir ongkos angkut & waktu transit pengiriman");
    options.push("Tahan harga jual di batas HET untuk mempertahankan loyalitas pembeli");
    reasoning = `Harga jual terikat batas HET resmi (${formatRupiah(commodityInfo?.hetPrice || 0)}). Keputusan paling rasional adalah menekan biaya perolehan, bukan melanggar harga eceran tertinggi.`;
    confidence = "high";
    if (topSupplier) {
      suggestedSupplierMsg = `Selamat siang ${topSupplier.contactPerson} (${topSupplier.name}), mohon info harga grosir terbaik untuk ${commodityInfo?.name || "barang"} jika kami ambil kuantiti rutin. Terima kasih.`;
    }
  } else if (isMarginCritical) {
    action = "REVIEW_COST";
    headline = "Margin Kritis di Bawah 8% — Perlu Tindakan Segera Pada Biaya & Porsi";
    options.push("Negosiasi ulang harga beli ke supplier utama atau bandingkan supplier alternatif");
    if (role === "warteg" || role === "umkm_kuliner") {
      options.push("Sesuaikan gramasi/porsi olahan tanpa menurunkan kualitas rasa");
    } else {
      options.push("Evaluasi bundel produk (cross-selling) dengan komoditas ber-margin tinggi");
    }
    if (!isPriceAboveMarket) {
      options.push(`Pertimbangkan penyesuaian harga jual bertahap (pasar Surabaya: ${formatRupiah(marketRef)})`);
    } else {
      options.push("Tahan harga jual sementara karena harga Anda sudah di atas median pasar lokal");
    }

    reasoning = `Margin riil Anda saat ini (${currentMargin.toFixed(1)}%) berada pada zona bahaya operasional. Mengingat harga pasar lokal berada di ${formatRupiah(marketRef)}, menaikkan harga langsung berisiko menurunkan omzet harian.`;
    confidence = "high";
    if (topSupplier) {
      suggestedSupplierMsg = `Halo ${topSupplier.contactPerson}, kami sedang evaluasi biaya operasional. Apakah ada skema potongan khusus untuk pembelian ${commodityInfo?.name || "bahan"} minggu ini?`;
    }
  } else if (isMarginUnderTarget) {
    if (isPriceBelowMarket) {
      action = "REVIEW_PRICE";
      headline = "Margin Di Bawah Target — Ruang Penyesuaian Harga Jual Terbuka";
      options.push(`Naikkan harga jual bertahap mendekati referensi pasar lokal (${formatRupiah(marketRef)})`);
      options.push("Pantau respons pelanggan selama 3-5 hari sebelum penyesuaian penuh");
      options.push("Audit susut fisik (waste) saat penyimpanan");
      reasoning = `Harga jual Anda (${formatRupiah(sellingPrice)}) masih lebih rendah daripada median pasar lokal (${formatRupiah(marketRef)}). Anda memiliki ruang kompetitif untuk menaikkan harga tanpa ditinggalkan pembeli.`;
      confidence = "high";
    } else {
      action = "OPTIMIZE";
      headline = "Margin Tertekan — Prioritaskan Negosiasi Supplier & Pengendalian Susut";
      options.push("Minta potongan harga supplier atau cari supplier alternatif di pasar induk");
      options.push("Tahan harga jual saat ini untuk menjaga daya saing terhadap warung sekitar");
      options.push("Tinjau ulang biaya transportasi kulakan");
      reasoning = `Margin (${currentMargin.toFixed(1)}%) masih di bawah target (${targetMargin}%), namun harga jual Anda sudah sebanding atau di atas median pasar (${formatRupiah(marketRef)}). Menaikkan harga jual berisiko kehilangan pelanggan.`;
      confidence = "medium";
      if (topSupplier) {
        suggestedSupplierMsg = `Halo ${topSupplier.contactPerson}, kami bermaksud repeat order ${commodityInfo?.name || "komoditas"}. Bisakah dapat harga spesial untuk pembelian berikutnya?`;
      }
    }
  } else {
    action = "HOLD";
    headline = "Struktur Margin Sehat — Pertahankan Strategi & Jaga Pasokan";
    options.push("Pertahankan harga jual dan kualitas layanan saat ini");
    options.push("Kunci pasokan dengan supplier terpercaya agar terhindar dari lonjakan musiman");
    options.push("Pantau pergerakan harga pasar lokal mingguan via SP2KP & PIHPS");
    reasoning = `Margin riil Anda (${currentMargin.toFixed(1)}%) telah melampaui target (${targetMargin}%). Posisi harga Anda kompetitif terhadap pasar lokal (${formatRupiah(marketRef)}).`;
    confidence = "high";
  }

  return {
    action,
    headline,
    options: options.slice(0, 3),
    confidence,
    requires_confirmation: true,
    reasoning,
    het_warning: hetWarning,
    suggested_supplier_msg: suggestedSupplierMsg,
  };
}
