"use client";

import React, { useState, useEffect } from "react";
import type { LocationForecast } from "@/types/forecast";
import { CloudSun, Droplets, Wind, RefreshCw } from "lucide-react";
import Image from "next/image";

interface WeatherForecastCardProps {
  city: string;
  district: string;
}

export function WeatherForecastCard({ city, district }: WeatherForecastCardProps) {
  const [forecast, setForecast] = useState<LocationForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/forecast?city=${encodeURIComponent(city)}&district=${encodeURIComponent(
            district
          )}`
        );
        const json = await res.json();
        if (!ignore && json.data) {
          setForecast(json.data);
        }
      } catch (err) {
        console.error("Failed to load forecast:", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      ignore = true;
    };
  }, [city, district, refreshKey]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs animate-pulse space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
        <div className="h-16 bg-slate-100 dark:bg-slate-700/50 rounded-xl" />
      </div>
    );
  }

  if (!forecast || !forecast.current) {
    return null;
  }

  const current = forecast.current;

  return (
    <section aria-labelledby="forecast-heading" className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <h2 id="forecast-heading" className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Prakiraan Cuaca Resmi BMKG (per 3 Jam)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {forecast.village}, Kec. {forecast.district}, {forecast.city}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
            Baseline Non-Darurat
          </span>
          <button
            type="button"
            onClick={() => setRefreshKey((k) => k + 1)}
            title="Perbarui data prakiraan"
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Current Highlight & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-2 flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-blue-50/70 to-indigo-50/70 dark:from-slate-900/60 dark:to-slate-900/40 border border-blue-100 dark:border-slate-700">
          <div className="w-14 h-14 relative flex-shrink-0 bg-white/80 dark:bg-slate-800 rounded-full p-2 shadow-xs">
            <Image
              src={current.iconUrl}
              alt={current.weatherDesc}
              fill
              unoptimized
              className="object-contain p-1"
            />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
                {current.temperature}°C
              </span>
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                {current.weatherDesc}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Waktu Observasi: {current.timeFormatted} ({current.dateFormatted})
            </p>
          </div>
        </div>

        {/* Metric 1: Humidity & Cloud */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Droplets className="w-3.5 h-3.5 text-blue-500" />
            <span>Kelembapan Udara</span>
          </div>
          <span className="text-base font-bold text-slate-900 dark:text-slate-100">
            {current.humidity}%
          </span>
          <span className="text-[10px] text-slate-400">Tutupan Awan {current.cloudCover}%</span>
        </div>

        {/* Metric 2: Wind & Visibility */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Wind className="w-3.5 h-3.5 text-teal-500" />
            <span>Kecepatan Angin</span>
          </div>
          <span className="text-base font-bold text-slate-900 dark:text-slate-100">
            {current.windSpeed} km/jam
          </span>
          <span className="text-[10px] text-slate-400">
            Arah {current.windDirection} • Jarak Pandang {current.visibility}
          </span>
        </div>
      </div>

      {/* 3-Hour Interval Ribbon */}
      <div>
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-2">
          Tren Prakiraan 24 Jam ke Depan:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {forecast.intervals.map((item, idx) => (
            <div
              key={`${item.datetime}-${idx}`}
              className="flex-shrink-0 w-24 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700/70 text-center space-y-1.5"
            >
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                {item.timeFormatted.replace(" WIB", "")}
              </span>
              <div className="w-8 h-8 mx-auto relative">
                <Image
                  src={item.iconUrl}
                  alt={item.weatherDesc}
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
              <span className="text-xs font-black text-slate-900 dark:text-slate-100 block">
                {item.temperature}°
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block">
                {item.weatherDesc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
