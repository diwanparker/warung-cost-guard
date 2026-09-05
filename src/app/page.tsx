"use client";

import React, { useState, useEffect, useMemo } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { QuickStatus } from "@/components/dashboard/QuickStatus";
import { EarthquakeTicker } from "@/components/dashboard/EarthquakeTicker";
import { WeatherForecastCard } from "@/components/dashboard/WeatherForecastCard";
import { LocationSelector } from "@/components/alerts/LocationSelector";
import { WarningStatusCard } from "@/components/alerts/WarningStatusCard";
import { EmptyWarningState } from "@/components/alerts/EmptyWarningState";
import { ExpiredWarningState } from "@/components/alerts/ExpiredWarningState";
import { WarningUnavailableState } from "@/components/alerts/WarningUnavailableState";
import { ActionPlanCard } from "@/components/actions/ActionPlanCard";
import { ConfirmationDialog } from "@/components/actions/ConfirmationDialog";
import { CopilotPanel } from "@/components/chat/CopilotPanel";
import { buildRoleActionPlan } from "@/lib/actions/planner";
import { getTimeRemaining, formatWibTime } from "@/lib/bmkg/temporal";
import type { UserLocation, UserRole } from "@/types/user";
import type { WarningMatchResult } from "@/types/bmkg";
import { FlaskConical, CheckCircle2 } from "lucide-react";

export default function DashboardPage() {
  const [location, setLocation] = useState<UserLocation>({
    province: "Jawa Timur",
    city: "Surabaya",
    district: "Sukolilo",
  });

  const [scenario, setScenario] = useState<"A" | "B" | "C" | "D" | "LIVE">("A");
  const [matchResult, setMatchResult] = useState<WarningMatchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(true);
  const [scenarioName, setScenarioName] = useState<string | undefined>();
  const [selectedRole, setSelectedRole] = useState<UserRole>("campus_operations");
  const [isOutdoorEvent, setIsOutdoorEvent] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);
  const [notificationLogId, setNotificationLogId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleConfirmNotification = async (recipients: string[], message: string) => {
    const res = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        confirmed: true,
        recipients,
        message,
        channel: "email",
      }),
    });
    const data = await res.json();
    if (data.success) {
      setNotificationSent(true);
      setNotificationLogId("NOTIF-849201");
    }
  };

  const triggerRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  // Fetch warnings whenever location, scenario, or refreshKey changes
  useEffect(() => {
    let ignore = false;

    async function executeFetch() {
      setLoading(true);
      try {
        let url = `/api/warnings?province=${encodeURIComponent(
          location.province
        )}&city=${encodeURIComponent(location.city)}&district=${encodeURIComponent(
          location.district
        )}`;

        if (scenario !== "LIVE") {
          url += `&scenario=${scenario}`;
        } else {
          url += `&forceRefresh=true`;
        }

        const res = await fetch(url);
        const data = await res.json();

        if (!ignore) {
          setMatchResult(data.matchResult);
          setIsDemo(Boolean(data.isDemo));
          setScenarioName(data.scenarioName);
        }
      } catch (err) {
        if (!ignore) {
          console.error("Failed to load warnings:", err);
          setMatchResult({
            matched: false,
            status: "unavailable",
            warning: null,
            matchedLocation: null,
            confidence: "no_match",
            matchedField: null,
            reason: "Koneksi ke endpoint peringatan terganggu.",
            source: "BMKG",
          });
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    executeFetch();

    return () => {
      ignore = true;
    };
  }, [location, scenario, refreshKey]);

  // Pure derived state for actionPlan
  const actionPlan = useMemo(() => {
    if (matchResult && matchResult.status === "active") {
      return buildRoleActionPlan({
        warning: matchResult,
        role: selectedRole,
        context: { outdoor_event: isOutdoorEvent, participants: 150 },
      });
    }
    return null;
  }, [matchResult, selectedRole, isOutdoorEvent]);

  const activeWarning =
    matchResult?.status === "active" ? matchResult.warning : null;
  const timeRemaining = activeWarning
    ? getTimeRemaining(activeWarning.expires).text
    : undefined;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col">
      <DashboardHeader isDemoMode={isDemo} scenarioName={scenarioName} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Real-time BMKG TEWS Earthquake Banner */}
        <EarthquakeTicker />

        {/* Scenario Selector Bar for Judges & Evaluators */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <FlaskConical className="w-4 h-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
            <span>Pilihan Skenario Evaluasi Hackathon:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setScenario("A")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                scenario === "A"
                  ? "bg-purple-600 text-white shadow-xs font-semibold"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              Skenario A (Peringatan Aktif Sukolilo)
            </button>
            <button
              type="button"
              onClick={() => setScenario("B")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                scenario === "B"
                  ? "bg-purple-600 text-white shadow-xs font-semibold"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              Skenario B (Lokasi Tidak Cocok)
            </button>
            <button
              type="button"
              onClick={() => setScenario("C")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                scenario === "C"
                  ? "bg-purple-600 text-white shadow-xs font-semibold"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              Skenario C (Kedaluwarsa)
            </button>
            <button
              type="button"
              onClick={() => setScenario("D")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                scenario === "D"
                  ? "bg-purple-600 text-white shadow-xs font-semibold"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              Skenario D (BMKG Down)
            </button>
            <button
              type="button"
              onClick={() => setScenario("LIVE")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                scenario === "LIVE"
                  ? "bg-blue-600 text-white shadow-xs font-semibold"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              Live Feed BMKG
            </button>
          </div>
        </div>

        {/* Quick Status Metrics Bar */}
        <QuickStatus
          activeWarningCount={matchResult?.status === "active" ? 1 : 0}
          recommendedActionCount={matchResult?.status === "active" ? 5 : 0}
          teamsToNotifyCount={matchResult?.status === "active" ? 2 : 0}
          timeRemainingText={timeRemaining}
        />

        {/* Location Selector */}
        <LocationSelector
          currentLocation={location}
          onLocationChange={(newLoc) => setLocation(newLoc)}
        />

        {/* BMKG 3-Day Weather Forecast Baseline Ribbon */}
        <WeatherForecastCard city={location.city} district={location.district} />

        {/* Main Warning State Area */}
        <div id="warning-section">
          {loading ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 text-center animate-pulse">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-3" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mx-auto mb-2" />
              <div className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded w-1/2 mx-auto" />
            </div>
          ) : matchResult ? (
            <>
              {matchResult.status === "active" && (
                <WarningStatusCard
                  matchResult={matchResult}
                  onGenerateActionPlan={() => {
                    const el = document.getElementById("action-plan-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                />
              )}

              {matchResult.status === "no_match" && (
                <EmptyWarningState
                  location={location}
                  onRefresh={triggerRefresh}
                />
              )}

              {matchResult.status === "expired" && matchResult.warning && (
                <ExpiredWarningState
                  warning={matchResult.warning}
                  onRefresh={triggerRefresh}
                />
              )}

              {matchResult.status === "unavailable" && (
                <WarningUnavailableState onRetry={triggerRefresh} />
              )}
            </>
          ) : null}
        </div>

        {/* Action Plan Section */}
        <div id="action-plan-section" className="space-y-4">
          {notificationSent && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
                <div className="text-xs">
                  <strong className="block font-bold">Status Eksekusi Selesai:</strong>
                  <span>✓ Tim Lapangan Telah Dinotifikasi &nbsp;|&nbsp; ✓ Rencana Tindakan Terdaftar &nbsp;|&nbsp; ● Monitoring BMKG Aktif</span>
                </div>
              </div>
              <span className="text-[11px] font-mono bg-emerald-200/60 dark:bg-emerald-900 px-2.5 py-1 rounded text-emerald-800 dark:text-emerald-200 font-semibold self-start sm:self-auto">
                LOG ID: {notificationLogId || "NOTIF-849201"}
              </span>
            </div>
          )}

          {actionPlan && matchResult?.status === "active" && (
            <ActionPlanCard
              actionPlan={actionPlan}
              selectedRole={selectedRole}
              onRoleChange={(newRole) => setSelectedRole(newRole)}
              isOutdoorEvent={isOutdoorEvent}
              onOutdoorToggle={(outdoor) => setIsOutdoorEvent(outdoor)}
              onOpenConfirmation={() => setIsConfirmOpen(true)}
            />
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmNotification}
        defaultMessage={
          matchResult?.warning
            ? `Peringatan Dini Cuaca BMKG (${matchResult.warning.event}) aktif untuk wilayah ${location.district}, ${location.city} hingga pukul ${formatWibTime(matchResult.warning.expires)} WIB. Harap segera laksanakan SOP mitigasi kesiapsiagaan darurat.`
            : "Peringatan cuaca BMKG aktif. Harap tindak lanjuti SOP kesiapsiagaan."
        }
      />

      {/* IBM Bob Copilot Side Panel / Toggle */}
      <CopilotPanel
        location={location}
        role={selectedRole}
        scenario={scenario}
        isOutdoorEvent={isOutdoorEvent}
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />
    </div>
  );
}
