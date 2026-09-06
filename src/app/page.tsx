"use client";

import React, { useState, useEffect, useMemo } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { QuickStatus } from "@/components/dashboard/QuickStatus";
import { RoleSelector } from "@/components/dashboard/RoleSelector";
import { InflationTicker } from "@/components/dashboard/InflationTicker";
import { CommodityGrid } from "@/components/dashboard/CommodityGrid";
import { MarginCalculator } from "@/components/margin/MarginCalculator";
import { ActionRecommendationCard } from "@/components/actions/ActionRecommendationCard";
import { SupplierNegotiateModal } from "@/components/actions/SupplierNegotiateModal";
import { CopilotPanel } from "@/components/chat/CopilotPanel";
import { MASTER_COMMODITIES, getCommodityById } from "@/data/commodities";
import { DEMO_SCENARIOS, type DemoScenario } from "@/data/demo/scenarios";
import { DEMO_MARKET_PRICES } from "@/data/demo/market-prices";
import { getSupplierById, getSuppliersForCommodity } from "@/data/demo/suppliers";
import { calculateMargin } from "@/lib/margin/calculator";
import { suggestPriceAction } from "@/lib/actions/recommender";
import type { BusinessRole } from "@/types/user";
import type { MarginInput, MarginResult } from "@/types/margin";
import type { MarketPriceResult } from "@/types/market";
import { FlaskConical, CheckCircle2 } from "lucide-react";

export default function DashboardPage() {
  const [selectedRole, setSelectedRole] = useState<BusinessRole>("warteg");
  const [activeCommodityId, setActiveCommodityId] = useState<string>("ayam_ras");
  const [scenario, setScenario] = useState<"A" | "B" | "C" | "CUSTOM">("A");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNegotiateModalOpen, setIsNegotiateModalOpen] = useState(false);
  const [notificationSent, setNotificationSent] = useState<string | null>(null);

  // Active commodity inputs state
  const activeCommodity = useMemo(
    () => getCommodityById(activeCommodityId) || MASTER_COMMODITIES[0],
    [activeCommodityId]
  );

  const [marginInputs, setMarginInputs] = useState<Record<string, MarginInput>>(() => {
    const initial: Record<string, MarginInput> = {};
    for (const c of MASTER_COMMODITIES) {
      initial[c.id] = {
        purchase_price: c.defaultPurchasePrice,
        transport_cost: c.defaultTransportCost,
        waste_pct: c.defaultWastePct,
        selling_price: c.defaultSellingPrice,
      };
    }
    return initial;
  });

  // Apply scenario when clicked
  const handleSelectScenario = (scId: "A" | "B" | "C" | "CUSTOM") => {
    setScenario(scId);
    if (scId !== "CUSTOM") {
      const sc = DEMO_SCENARIOS[scId];
      setSelectedRole(sc.role);
      setActiveCommodityId(sc.commodityId);
      setMarginInputs((prev) => ({
        ...prev,
        [sc.commodityId]: {
          purchase_price: sc.purchasePrice,
          transport_cost: sc.transportCost,
          waste_pct: sc.wastePct,
          selling_price: sc.sellingPrice,
        },
      }));
    }
  };

  const currentInput: MarginInput = marginInputs[activeCommodityId] || {
    purchase_price: activeCommodity.defaultPurchasePrice,
    transport_cost: activeCommodity.defaultTransportCost,
    waste_pct: activeCommodity.defaultWastePct,
    selling_price: activeCommodity.defaultSellingPrice,
  };

  const handleInputChange = (newInput: MarginInput) => {
    setMarginInputs((prev) => ({
      ...prev,
      [activeCommodityId]: newInput,
    }));
  };

  const handleResetInput = () => {
    setMarginInputs((prev) => ({
      ...prev,
      [activeCommodityId]: {
        purchase_price: activeCommodity.defaultPurchasePrice,
        transport_cost: activeCommodity.defaultTransportCost,
        waste_pct: activeCommodity.defaultWastePct,
        selling_price: activeCommodity.defaultSellingPrice,
      },
    }));
  };

  // Deterministic margin results map for all commodities
  const allMargins = useMemo(() => {
    const res: Record<string, MarginResult> = {};
    for (const c of MASTER_COMMODITIES) {
      const input = marginInputs[c.id] || {
        purchase_price: c.defaultPurchasePrice,
        transport_cost: c.defaultTransportCost,
        waste_pct: c.defaultWastePct,
        selling_price: c.defaultSellingPrice,
      };
      res[c.id] = calculateMargin(input, c.targetMarginPct);
    }
    return res;
  }, [marginInputs]);

  const activeMarginResult = allMargins[activeCommodityId] || calculateMargin(currentInput);

  // Market prices map
  const marketPrices: Record<string, MarketPriceResult> = DEMO_MARKET_PRICES;
  const activeMarketPrice = marketPrices[activeCommodityId] || marketPrices["ayam_ras"];

  // Action recommendation
  const actionResult = useMemo(() => {
    return suggestPriceAction({
      commodity: activeCommodityId,
      current_margin_pct: activeMarginResult.gross_margin_pct,
      target_margin_pct: activeCommodity.targetMarginPct,
      market_reference: activeMarketPrice.median_reference,
      selling_price: activeMarginResult.selling_price,
      effective_cost: activeMarginResult.effective_cost,
      role: selectedRole,
    });
  }, [activeCommodityId, activeMarginResult, activeCommodity, activeMarketPrice, selectedRole]);

  // Quick metrics calculations
  const totalCommodities = MASTER_COMMODITIES.length;
  const alertCount = Object.values(allMargins).filter(
    (m) => m.status === "warning" || m.status === "critical"
  ).length;
  const avgMarginPct =
    Object.values(allMargins).reduce((acc, m) => acc + m.gross_margin_pct, 0) /
    totalCommodities;

  // Supplier info for active commodity
  const suppliers = getSuppliersForCommodity(activeCommodityId);
  const activeSupplier = suppliers[0];

  const handleConfirmSupplierNegotiation = async (supplierId: string, message: string) => {
    const res = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        supplier_id: supplierId,
        commodity: activeCommodity.name,
        message,
        confirmed: true,
        channel: "whatsapp",
      }),
    });

    const data = await res.json();
    if (data.sent) {
      setNotificationSent(data.message);
      setTimeout(() => setNotificationSent(null), 8000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col">
      <DashboardHeader
        isDemoMode={true}
        scenarioName={scenario !== "CUSTOM" ? DEMO_SCENARIOS[scenario].title : "Mode Bebas"}
        city="Surabaya"
        onOpenChat={() => setIsChatOpen(true)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* BPS Macro Food Inflation Ribbon */}
        <InflationTicker />

        {/* Hackathon Evaluation Scenario Selector Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <FlaskConical className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span>Skenario Demo Evaluasi Hackathon:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleSelectScenario("A")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                scenario === "A"
                  ? "bg-emerald-600 text-white shadow-xs font-semibold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              Skenario A (Ayam Warteg Naik)
            </button>
            <button
              type="button"
              onClick={() => handleSelectScenario("B")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                scenario === "B"
                  ? "bg-emerald-600 text-white shadow-xs font-semibold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              Skenario B (Minyakita HET)
            </button>
            <button
              type="button"
              onClick={() => handleSelectScenario("C")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                scenario === "C"
                  ? "bg-emerald-600 text-white shadow-xs font-semibold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              Skenario C (Nego Cabai Rawit)
            </button>
            <button
              type="button"
              onClick={() => handleSelectScenario("CUSTOM")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                scenario === "CUSTOM"
                  ? "bg-purple-600 text-white shadow-xs font-semibold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              Eksplorasi Bebas
            </button>
          </div>
        </div>

        {/* Business Profile Selector */}
        <RoleSelector selectedRole={selectedRole} onSelectRole={setSelectedRole} />

        {/* Quick Metrics Bar */}
        <QuickStatus
          totalCommodities={totalCommodities}
          alertCount={alertCount}
          avgMarginPct={avgMarginPct}
          targetMarginPct={activeCommodity.targetMarginPct}
        />

        {/* Notification Feedback Toast Banner */}
        {notificationSent && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 flex items-center justify-between gap-3 animate-in fade-in duration-300">
            <div className="flex items-center gap-2.5 text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
              <div>
                <strong>Aksi Terverifikasi:</strong> {notificationSent}
              </div>
            </div>
          </div>
        )}

        {/* Interactive Deterministic Margin Calculator for Active Commodity */}
        <div id="calculator-section">
          <MarginCalculator
            commodity={activeCommodity}
            marginInput={currentInput}
            marginResult={activeMarginResult}
            marketPrice={activeMarketPrice}
            onInputChange={handleInputChange}
            onReset={handleResetInput}
            onAskBob={() => setIsChatOpen(true)}
          />
        </div>

        {/* AI Action Recommendation Card */}
        <ActionRecommendationCard
          actionResult={actionResult}
          commodityName={activeCommodity.name}
          onOpenNegotiation={() => setIsNegotiateModalOpen(true)}
        />

        {/* Commodity Grid (All 12 items) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Pantauan Seluruh Komoditas Pokok ({totalCommodities} Bahan Pangan)
            </h2>
            <span className="text-xs text-slate-500">
              Pilih komoditas untuk simulasi kalkulator di atas
            </span>
          </div>

          <CommodityGrid
            margins={allMargins}
            marketPrices={marketPrices}
            selectedCommodityId={activeCommodityId}
            onSelectCommodity={(id) => {
              setActiveCommodityId(id);
              const el = document.getElementById("calculator-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            onAskBob={(id) => {
              setActiveCommodityId(id);
              setIsChatOpen(true);
            }}
          />
        </div>
      </main>

      {/* Human-in-the-loop Supplier Negotiation Confirmation Modal */}
      <SupplierNegotiateModal
        isOpen={isNegotiateModalOpen}
        supplier={activeSupplier}
        commodityName={activeCommodity.name}
        initialMessage={
          actionResult.suggested_supplier_msg ||
          `Halo ${activeSupplier?.contactPerson || "Supplier"}, mohon info harga grosir terbaik untuk ${activeCommodity.name}. Terima kasih.`
        }
        onClose={() => setIsNegotiateModalOpen(false)}
        onConfirm={handleConfirmSupplierNegotiation}
      />

      {/* IBM Bob Copilot Slide-out Drawer */}
      <CopilotPanel
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        role={selectedRole}
        city="Surabaya"
        activeCommodityId={activeCommodityId}
        purchasePrice={currentInput.purchase_price}
        transportCost={currentInput.transport_cost}
        wastePct={currentInput.waste_pct}
        sellingPrice={currentInput.selling_price}
        scenarioId={scenario !== "CUSTOM" ? scenario : undefined}
      />
    </div>
  );
}
