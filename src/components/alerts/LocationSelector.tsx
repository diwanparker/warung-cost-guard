import React, { useState } from "react";
import { MapPin, Navigation, ChevronDown } from "lucide-react";
import type { UserLocation } from "@/types/user";

interface LocationSelectorProps {
  currentLocation: UserLocation;
  onLocationChange: (location: UserLocation) => void;
  className?: string;
}

const PRESET_LOCATIONS: { label: string; location: UserLocation; badge?: string }[] = [
  {
    label: "Kampus PENS / ITS (Sukolilo)",
    badge: "Matching Demo",
    location: {
      province: "Jawa Timur",
      city: "Surabaya",
      district: "Sukolilo",
    },
  },
  {
    label: "Kec. Rungkut, Surabaya",
    location: {
      province: "Jawa Timur",
      city: "Surabaya",
      district: "Rungkut",
    },
  },
  {
    label: "Kec. Gubeng, Surabaya",
    location: {
      province: "Jawa Timur",
      city: "Surabaya",
      district: "Gubeng",
    },
  },
  {
    label: "Klojen, Kota Malang",
    badge: "Mismatch Demo",
    location: {
      province: "Jawa Timur",
      city: "Malang",
      district: "Klojen",
    },
  },
];

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  currentLocation,
  onLocationChange,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [districtInput, setDistrictInput] = useState(currentLocation.district);
  const [cityInput, setCityInput] = useState(currentLocation.city);
  const [provinceInput, setProvinceInput] = useState(currentLocation.province);

  const handleCustomApply = (e: React.FormEvent) => {
    e.preventDefault();
    onLocationChange({
      province: provinceInput.trim() || "Jawa Timur",
      city: cityInput.trim() || "Surabaya",
      district: districtInput.trim() || "Sukolilo",
    });
    setIsOpen(false);
  };

  const selectPreset = (loc: UserLocation) => {
    setDistrictInput(loc.district);
    setCityInput(loc.city);
    setProvinceInput(loc.province);
    onLocationChange(loc);
    setIsOpen(false);
  };

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-xs ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Lokasi Terpantau
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>
                Kec. {currentLocation.district}, {currentLocation.city}
              </span>
              <span className="text-xs font-normal text-slate-400">
                ({currentLocation.province})
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition"
          aria-expanded={isOpen}
        >
          <Navigation className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Ganti Lokasi</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
      </div>

      {/* Preset shortcuts */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-medium">Shortcut Uji Lokasi:</span>
        {PRESET_LOCATIONS.map((preset, idx) => {
          const isSelected =
            preset.location.district.toLowerCase() === currentLocation.district.toLowerCase() &&
            preset.location.city.toLowerCase() === currentLocation.city.toLowerCase();

          return (
            <button
              key={idx}
              type="button"
              onClick={() => selectPreset(preset.location)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${
                isSelected
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              <span>{preset.label}</span>
              {preset.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                  isSelected
                    ? "bg-blue-700 text-blue-100"
                    : "bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-200"
                }`}>
                  {preset.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Expandable Custom Location Form */}
      {isOpen && (
        <form onSubmit={handleCustomApply} className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
              Kecamatan
            </label>
            <input
              type="text"
              value={districtInput}
              onChange={(e) => setDistrictInput(e.target.value)}
              placeholder="Contoh: Sukolilo"
              className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
              Kota / Kabupaten
            </label>
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="Contoh: Surabaya"
              className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              required
            />
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Provinsi
              </label>
              <input
                type="text"
                value={provinceInput}
                onChange={(e) => setProvinceInput(e.target.value)}
                placeholder="Contoh: Jawa Timur"
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                required
              />
            </div>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition h-[38px]"
            >
              Terapkan
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
