import React, { useState } from "react";
import { MASTER_COMMODITIES } from "@/data/commodities";
import { CommodityCard } from "./CommodityCard";
import type { MarginResult } from "@/types/margin";
import type { MarketPriceResult } from "@/types/market";
import type { CommodityCategory } from "@/types/commodity";

interface CommodityGridProps {
  margins: Record<string, MarginResult>;
  marketPrices: Record<string, MarketPriceResult>;
  selectedCommodityId: string;
  onSelectCommodity: (id: string) => void;
  onAskBob: (id: string) => void;
}

export function CommodityGrid({
  margins,
  marketPrices,
  selectedCommodityId,
  onSelectCommodity,
  onAskBob,
}: CommodityGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories: { id: string; label: string }[] = [
    { id: "all", label: "Semua Komoditas" },
    { id: "unggas_daging", label: "Unggas & Daging" },
    { id: "bumbu_sayur", label: "Cabai & Bawang" },
    { id: "minyak_gula", label: "Minyak & Gula" },
    { id: "sembako", label: "Beras & Sembako" },
  ];

  const filtered = MASTER_COMMODITIES.filter((c) => {
    if (activeCategory === "all") return true;
    return c.category === activeCategory;
  });

  return (
    <div className="space-y-4">
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition ${
              activeCategory === cat.id
                ? "bg-emerald-600 text-white shadow-xs font-semibold"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((commodity) => {
          const margin =
            margins[commodity.id] || {
              purchase_price: commodity.defaultPurchasePrice,
              transport_cost: commodity.defaultTransportCost,
              waste_pct: commodity.defaultWastePct,
              selling_price: commodity.defaultSellingPrice,
              effective_cost: commodity.defaultPurchasePrice + commodity.defaultTransportCost,
              gross_profit: commodity.defaultSellingPrice - (commodity.defaultPurchasePrice + commodity.defaultTransportCost),
              gross_margin_pct: 15,
              markup_pct: 17,
              status: "healthy",
            };

          const marketPrice = marketPrices[commodity.id];

          return (
            <CommodityCard
              key={commodity.id}
              commodity={commodity}
              marginResult={margin}
              marketPrice={marketPrice}
              isSelected={selectedCommodityId === commodity.id}
              onSelect={onSelectCommodity}
              onAskBob={onAskBob}
            />
          );
        })}
      </div>
    </div>
  );
}
