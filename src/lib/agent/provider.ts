import { getEnv } from "@/lib/env";
import { normalizeCommodity } from "@/lib/market/normalizer";
import { getCommodityById } from "@/data/commodities";
import { executeGetMarketPrices, executeCalculateMargin, executeSuggestPriceAction } from "@/lib/mcp/tools";
import { formatRupiah } from "@/lib/margin/calculator";
import type { AgentProvider, ChatMessage, ChatContext } from "./types";

export class BobCopilotProvider implements AgentProvider {
  async sendMessage(
    userMessage: string,
    history: ChatMessage[],
    context: ChatContext
  ): Promise<ChatMessage> {
    const env = getEnv();
    const city = context.city || "Surabaya";
    const commodityId = context.activeCommodityId || normalizeCommodity(userMessage);
    const commodityInfo = getCommodityById(commodityId);

    // 1. Tool execution (deterministic, non-LLM)
    const purchasePrice = context.purchasePrice || commodityInfo?.defaultPurchasePrice || 36500;
    const transportCost = context.transportCost ?? commodityInfo?.defaultTransportCost ?? 1500;
    const wastePct = context.wastePct ?? commodityInfo?.defaultWastePct ?? 5;
    const sellingPrice = context.sellingPrice || commodityInfo?.defaultSellingPrice || 45000;

    const marginResult = executeCalculateMargin({
      purchase_price: purchasePrice,
      transport_cost: transportCost,
      waste_pct: wastePct,
      selling_price: sellingPrice,
    });

    const marketPrices = await executeGetMarketPrices({
      commodity: commodityId,
      city,
    });

    const actionResult = executeSuggestPriceAction({
      commodity: commodityId,
      current_margin_pct: marginResult.gross_margin_pct,
      target_margin_pct: commodityInfo?.targetMarginPct || 15,
      market_reference: marketPrices.median_reference,
      selling_price: sellingPrice,
      effective_cost: marginResult.effective_cost,
      role: context.role || "warteg",
    });

    const toolCalls = [
      {
        toolName: "calculate_margin",
        params: { purchase_price: purchasePrice, transport_cost: transportCost, waste_pct: wastePct, selling_price: sellingPrice },
        result: marginResult as unknown as Record<string, unknown>,
      },
      {
        toolName: "get_market_prices",
        params: { commodity: commodityId, city },
        result: marketPrices as unknown as Record<string, unknown>,
      },
      {
        toolName: "suggest_price_action",
        params: {
          commodity: commodityId,
          current_margin_pct: marginResult.gross_margin_pct,
          target_margin_pct: commodityInfo?.targetMarginPct || 15,
          market_reference: marketPrices.median_reference,
          selling_price: sellingPrice,
        },
        result: actionResult as unknown as Record<string, unknown>,
      },
    ];

    // 2. Try calling configured OpenAI-Compatible LLM (OpenAI, Groq, Ollama, etc.)
    try {
      const systemPrompt = `Anda adalah Warung Cost Guard, Copilot Harga Pangan & Margin untuk pedagang kecil Indonesia.
ATURAN UTAMA:
- Gunakan HANYA angka harga, biaya, dan margin yang diberikan oleh tool.
- JANGAN menciptakan harga pasar sendiri.
- JANGAN menghitung ulang angka finansial dengan perkiraan (hasil perhitungan kalkulator sudah final).
- JANGAN memerintahkan user menetapkan harga tertentu tanpa menjelaskan dasar.
- Pisahkan secara tegas:
  1. FAKTA DATA PASAR
  2. HASIL PERHITUNGAN MARGIN RIIL
  3. REKOMENDASI TINDAKAN (Maksimal 3 opsi rasional)
- Selalu patuhi batas HET jika ada.
- Jawab dalam Bahasa Indonesia yang santun, praktis, dan memberdayakan pedagang kecil.`;

      const userContent = `Pesan pedagang: "${userMessage}"

DATA HASIL TOOL MCP:
- Komoditas: ${marketPrices.commodity_name} (${marketPrices.unit}) di ${city}
- Modal Beli: ${formatRupiah(purchasePrice)}
- Ongkos Angkut: ${formatRupiah(transportCost)}
- Susut Fisik: ${wastePct}%
- Biaya Efektif (Yield-Adjusted): ${formatRupiah(marginResult.effective_cost)}
- Harga Jual Saat Ini: ${formatRupiah(sellingPrice)}
- Laba Kotor: ${formatRupiah(marginResult.gross_profit)}
- Margin Riil: ${marginResult.gross_margin_pct}% (Target: ${commodityInfo?.targetMarginPct || 15}%)
- Harga Pasar Lokal (Median SP2KP/PIHPS/Bapanas): ${formatRupiah(marketPrices.median_reference)}
${actionResult.het_warning ? `- Catatan Regulasi: ${actionResult.het_warning}` : ""}
- Rekomendasi Mesin Keputusan: ${actionResult.action} - ${actionResult.headline}
- Opsi Aksi: ${actionResult.options.join("; ")}
${actionResult.suggested_supplier_msg ? `- Draf Pesan Negosiasi: "${actionResult.suggested_supplier_msg}"` : ""}

Susun respons terstruktur untuk pedagang sesuai format wajib di atas.`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(`${env.OPENAI_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: env.OPENAI_MODEL || "Free",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userContent },
          ],
          max_tokens: 600,
          temperature: 0.3,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text && typeof text === "string" && text.trim().length > 20) {
          return {
            id: `msg-${Date.now()}`,
            role: "assistant",
            content: text.trim(),
            timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
            toolCalls,
          };
        }
      }
    } catch (e) {
      console.warn("LLM endpoint unavailable or timed out, using structured template fallback:", e);
    }

    // 3. Fallback: High-quality structured response adhering strictly to the prompt guidelines
    const optionsText = actionResult.options.map((opt, i) => `${i + 1}. **${opt}**`).join("\n");
    const hetNotice = actionResult.het_warning
      ? `\n> ⚠️ **Peringatan Regulasi:** ${actionResult.het_warning}\n`
      : "";

    const supplierSnippet = actionResult.suggested_supplier_msg
      ? `\n\n💬 **Draf Pesan Negosiasi Siap Kirim (Perlu Konfirmasi Anda):**\n> "*${actionResult.suggested_supplier_msg}*"`
      : "";

    const fallbackContent = `Halo! Saya sudah menghitung struktur margin riil dan membandingkannya dengan data pasar lokal resmi untuk **${marketPrices.commodity_name}** di **${city}**.

### 1. Fakta Data Pasar
* **Harga Pasar Lokal (Median):** ${formatRupiah(marketPrices.median_reference)} / ${marketPrices.unit}
* **Rentang Pasar:** ${formatRupiah(marketPrices.min_price)} – ${formatRupiah(marketPrices.max_price)}
* **Sumber Data:** PIHPS Bank Indonesia, Bapanas, & SP2KP Kemendag (per ${marketPrices.source_time})

### 2. Hasil Perhitungan Margin Riil (Deterministik)
* **Modal Beli Dasar:** ${formatRupiah(purchasePrice)} + Transport: ${formatRupiah(transportCost)}
* **Susut Fisik:** ${wastePct}%
* **Biaya Efektif Nyata:** **${formatRupiah(marginResult.effective_cost)}** / ${marketPrices.unit}
* **Harga Jual Saat Ini:** ${formatRupiah(sellingPrice)}
* **Laba Kotor Riil:** **${formatRupiah(marginResult.gross_profit)}** per ${marketPrices.unit}
* **Margin:** **${marginResult.gross_margin_pct}%** (Target: ${commodityInfo?.targetMarginPct || 15}%) — Status: **${marginResult.status === "healthy" ? "✅ Sehat" : marginResult.status === "warning" ? "⚠️ Waspada" : "🔴 Kritis"}**
${hetNotice}
### 3. Rekomendasi Tindakan AI (${actionResult.action})
${actionResult.reasoning}

**Opsi Tindakan Paling Rasional:**
${optionsText}${supplierSnippet}`;

    return {
      id: `msg-${Date.now()}`,
      role: "assistant",
      content: fallbackContent,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      toolCalls,
    };
  }
}

export const defaultAgentProvider = new BobCopilotProvider();
