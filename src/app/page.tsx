"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { QuickStatus } from "@/components/dashboard/QuickStatus";
import { LocationSelector } from "@/components/alerts/LocationSelector";
import { WarningStatusCard } from "@/components/alerts/WarningStatusCard";
import { EmptyWarningState } from "@/components/alerts/EmptyWarningState";
import { ExpiredWarningState } from "@/components/alerts/ExpiredWarningState";
import { WarningUnavailableState } from "@/components/alerts/WarningUnavailableState";
import { ActionPlanCard } from "@/components/actions/ActionPlanCard";
import { CopilotPanel } from "@/components/chat/CopilotPanel";
import { buildRoleActionPlan } from "@/lib/actions/planner";
import { getTimeRemaining } from "@/lib/bmkg/temporal";
import type { UserLocation, UserRole } from "@/types/user";
import type { WarningMatchResult } from "@/types/bmkg";
import type { ActionPlan } from "@/types/action";
import { FlaskConical, MessageSquare, ShieldAlert } from "lucide-react";

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
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Fetch warnings whenever location or scenario changes
  const loadWarnings = useCallback(async () => {
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

      setMatchResult(data.matchResult);
      setIsDemo(Boolean(data.isDemo));
      setScenarioName(data.scenarioName);
    } catch (err) {
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
    } finally {
      setLoading(false);
    }
  }, [location, scenario]);

  useEffect(() => {
    loadWarnings();
  }, [loadWarnings]);

  useEffect(() => {
    if (matchResult && matchResult.status === "active") {
      const plan = buildRoleActionPlan({
        warning: matchResult,
        role: selectedRole,
        context: { outdoor_event: isOutdoorEvent, participants: 150 },
      });
      setActionPlan(plan);
    } else {
      setActionPlan(null);
    }
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
                  onRefresh={loadWarnings}
                />
              )}

              {matchResult.status === "expired" && matchResult.warning && (
                <ExpiredWarningState
                  warning={matchResult.warning}
                  onRefresh={loadWarnings}
                />
              )}

              {matchResult.status === "unavailable" && (
                <WarningUnavailableState onRetry={loadWarnings} />
              )}
            </>
          ) : null}
        </div>

        {/* Action Plan Section */}
        <div id="action-plan-section">
          {actionPlan && matchResult?.status === "active" && (
            <ActionPlanCard
              actionPlan={actionPlan}
              selectedRole={selectedRole}
              onRoleChange={(newRole) => setSelectedRole(newRole)}
              isOutdoorEvent={isOutdoorEvent}
              onOutdoorToggle={(outdoor) => setIsOutdoorEvent(outdoor)}
              onOpenConfirmation={() => {
                alert(
                  "Konfirmasi Dibutuhkan:\nPesan akan dikirim ke Tim Keamanan & Panitia Acara.\n(Fitur ini terhubung penuh pada modal Task 13)"
                );
              }}
            />
          )}
        </div>
      </main>

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
