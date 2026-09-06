import { describe, it, expect } from "vitest";
import {
  executeGetMarketPrices,
  executeCalculateMargin,
  executeSuggestPriceAction,
  executeNotifySupplier,
} from "@/lib/mcp/tools";

describe("MCP Tools Suite", () => {
  it("Tool 1: executeGetMarketPrices should return valid schema structure", async () => {
    const res = await executeGetMarketPrices({
      commodity: "ayam",
      city: "Surabaya",
    });

    expect(res.commodity).toBe("ayam_ras");
    expect(res.median_reference).toBeGreaterThan(0);
    expect(res.prices).toBeDefined();
    expect(res.unit).toBe("kg");
  });

  it("Tool 2: executeCalculateMargin should compute deterministic margin", () => {
    const res = executeCalculateMargin({
      purchase_price: 36500,
      transport_cost: 1500,
      waste_pct: 5,
      selling_price: 45000,
    });

    expect(res.effective_cost).toBe(40000);
    expect(res.gross_profit).toBe(5000);
    expect(res.gross_margin_pct).toBe(11.11);
    expect(res.status).toBe("warning");
  });

  it("Tool 3: executeSuggestPriceAction should return max 3 options and require confirmation", () => {
    const res = executeSuggestPriceAction({
      commodity: "ayam_ras",
      current_margin_pct: 11.11,
      target_margin_pct: 18,
      market_reference: 43000,
      selling_price: 45000,
      role: "warteg",
    });

    expect(res.action).toBeDefined();
    expect(res.options.length).toBeLessThanOrEqual(3);
    expect(res.requires_confirmation).toBe(true);
  });

  it("Tool 4: executeNotifySupplier should reject when confirmed is false (Responsible AI)", async () => {
    const res = await executeNotifySupplier({
      supplier_id: "SUP-01",
      message: "Mohon info potongan harga untuk 25 kg.",
      confirmed: false, // NOT CONFIRMED
    });

    expect(res.sent).toBe(false);
    expect(res.error).toBe("HUMAN_CONFIRMATION_REQUIRED");
  });

  it("Tool 4: executeNotifySupplier should succeed when confirmed is true", async () => {
    const res = await executeNotifySupplier({
      supplier_id: "SUP-01",
      message: "Mohon info potongan harga untuk 25 kg.",
      confirmed: true, // CONFIRMED BY USER
      channel: "whatsapp",
    });

    expect(res.sent).toBe(true);
    expect(res.channel).toBe("whatsapp");
    expect(res.message).toContain("berhasil dikirimkan");
  });
});
