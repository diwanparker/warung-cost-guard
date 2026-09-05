"use client";

import React, { useState, useEffect } from "react";
import type { EarthquakeData } from "@/types/earthquake";
import {
  Activity,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen,
} from "lucide-react";

export function EarthquakeTicker() {
  const [earthquake, setEarthquake] = useState<EarthquakeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSop, setShowSop] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function loadEarthquake() {
      try {
        const res = await fetch("/api/earthquake");
        const json = await res.json();
        if (!ignore && json.data) {
          setEarthquake(json.data);
        }
      } catch (err) {
        console.error("Failed to load earthquake data:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadEarthquake();
    const interval = setInterval(loadEarthquake, 120000); // 2 minutes
    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 rounded-xl flex items-center justify-between border border-slate-800 animate-pulse">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-slate-500 animate-spin" />
          <span>Memeriksa info gempabumi real-time BMKG...</span>
        </div>
      </div>
    );
  }

  if (!earthquake) {
    return null;
  }

  const isHighRisk = earthquake.isSignificant || earthquake.isTsunamiPotential;

  return (
    <aside aria-label="Informasi Gempabumi Terkini" className="space-y-2">
      <div
        className={`rounded-xl p-3 border transition-colors ${
          isHighRisk
            ? "bg-amber-950/40 border-amber-500/40 text-amber-200"
            : "bg-slate-900/90 border-slate-800 text-slate-200"
        } shadow-sm`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          {/* Left: Indicator & Magnitude Badge */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="flex h-2.5 w-2.5 relative">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isHighRisk ? "bg-red-400" : "bg-emerald-400"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isHighRisk ? "bg-red-500" : "bg-emerald-500"
                }`}
              />
            </span>

            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              BMKG TEWS Gempabumi Terkini:
            </span>

            <span
              className={`px-2 py-0.5 rounded text-xs font-black font-mono ${
                isHighRisk
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              }`}
            >
              M {earthquake.magnitude.toFixed(1)}
            </span>

            <span className="text-xs font-medium text-slate-200">
              {earthquake.region}
            </span>

            <span className="text-[11px] text-slate-400 font-mono">
              • Kedalaman {earthquake.depth} • {earthquake.time}
            </span>
          </div>

          {/* Right: Tsunami Potential & SOP Toggle */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                earthquake.isTsunamiPotential
                  ? "bg-red-900/60 text-red-200 border border-red-700"
                  : "bg-emerald-950/60 text-emerald-300 border border-emerald-800/40"
              }`}
            >
              {earthquake.potential}
            </span>

            <button
              type="button"
              onClick={() => setShowSop(!showSop)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>SOP Gempa Kampus</span>
              {showSop ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable Campus Earthquake SOP Guide */}
        {showSop && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2 text-amber-300 font-semibold">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Panduan Tanggap Darurat Gempabumi Kampus (K3L)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <strong className="block text-slate-100 font-bold mb-1">
                  1. Saat Guncangan (Drop-Cover-Hold)
                </strong>
                <p className="text-slate-300 text-[11px]">
                  Berlutut di bawah meja kokoh, lindungi kepala & leher, pegang erat kaki meja hingga guncangan berhenti total.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <strong className="block text-slate-100 font-bold mb-1">
                  2. Pasca Guncangan (Evakuasi)
                </strong>
                <p className="text-slate-300 text-[11px]">
                  Evakuasi lewat tangga darurat menuju Titik Kumpul Aman (*Assembly Point*).{" "}
                  <strong className="text-red-300">DILARANG PAKAI LIFT!</strong>
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <strong className="block text-slate-100 font-bold mb-1">
                  3. Pengamanan Fasilitas
                </strong>
                <p className="text-slate-300 text-[11px]">
                  Matikan sakelar listrik utama, tutup katup gas lab, laporkan kerusakan struktur ke tim K3L kampus.
                </p>
              </div>
            </div>

            {earthquake.shakemapUrl && (
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Peta Guncangan (Shakemap) BMKG:</span>
                <a
                  href={earthquake.shakemapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 hover:underline"
                >
                  Buka Gambar Shakemap <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
