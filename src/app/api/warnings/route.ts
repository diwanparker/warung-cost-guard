import { NextRequest, NextResponse } from "next/server";
import { getEnv } from "@/lib/env";
import { fetchBmkgWarnings } from "@/lib/bmkg/client";
import { matchLocation } from "@/lib/bmkg/matcher";
import { getWarningStatus } from "@/lib/bmkg/temporal";
import { createDynamicDemoWarnings } from "@/data/demo/scenarios";
import type { UserLocation } from "@/types/user";
import type { WarningMatchResult, BmkgWarning } from "@/types/bmkg";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const province = searchParams.get("province") || "Jawa Timur";
  const city = searchParams.get("city") || "Surabaya";
  const district = searchParams.get("district") || "Sukolilo";
  const scenarioParam = searchParams.get("scenario") as "A" | "B" | "C" | "D" | null;
  const forceRefresh = searchParams.get("forceRefresh") === "true";

  const userLocation: UserLocation = { province, city, district };
  const env = getEnv();

  // 1. Explicit Scenario Selection (for Hackathon live demos)
  if (scenarioParam && ["A", "B", "C", "D"].includes(scenarioParam)) {
    const demoScenarios = createDynamicDemoWarnings();
    const selected = demoScenarios[scenarioParam];
    const matchResult = selected.getMatchResult(userLocation);

    return NextResponse.json({
      isDemo: true,
      scenario: scenarioParam,
      scenarioName: selected.name,
      matchResult,
      location: userLocation,
      timestamp: new Date().toISOString(),
    });
  }

  // 2. Live BMKG Feed Request
  let liveWarnings: BmkgWarning[] = [];
  let isFetchError = false;

  try {
    liveWarnings = await fetchBmkgWarnings(undefined, forceRefresh);
  } catch (err) {
    console.error("API route error fetching BMKG:", err);
    isFetchError = true;
  }

  // If live data exists, process it
  if (liveWarnings.length > 0) {
    let bestMatch: WarningMatchResult | null = null;

    for (const warning of liveWarnings) {
      const matchDetail = matchLocation(warning, userLocation);
      const status = getWarningStatus(warning);

      if (matchDetail.matched) {
        bestMatch = {
          matched: true,
          status,
          warning,
          matchedLocation: matchDetail.matchedLocation,
          confidence: matchDetail.confidence,
          matchedField: matchDetail.matchedField,
          reason: matchDetail.reason,
          source: "BMKG",
        };
        break; // prioritize first active match
      }
    }

    if (!bestMatch) {
      bestMatch = {
        matched: false,
        status: "no_match",
        warning: null,
        matchedLocation: null,
        confidence: "no_match",
        matchedField: null,
        reason: `Tidak ditemukan peringatan dini BMKG yang mencakup Kec. ${district}, ${city}.`,
        source: "BMKG",
      };
    }

    return NextResponse.json({
      isDemo: false,
      scenario: null,
      matchResult: bestMatch,
      totalLiveWarnings: liveWarnings.length,
      location: userLocation,
      timestamp: new Date().toISOString(),
    });
  }

  // 3. Fallback when DEMO_MODE is true and no live warnings or offline
  if (env.DEMO_MODE) {
    const demoScenarios = createDynamicDemoWarnings();

    // Check if user location matches Sukolilo or Rungkut -> Scenario A
    const isSurabayaCampus =
      city.toLowerCase().includes("surabaya") &&
      (district.toLowerCase().includes("sukolilo") ||
        district.toLowerCase().includes("rungkut") ||
        district.toLowerCase().includes("gubeng"));

    const scenarioKey = isFetchError
      ? "D"
      : isSurabayaCampus
      ? "A"
      : "B";

    const scenario = demoScenarios[scenarioKey];
    const matchResult = scenario.getMatchResult(userLocation);

    return NextResponse.json({
      isDemo: true,
      scenario: scenarioKey,
      scenarioName: scenario.name,
      matchResult,
      location: userLocation,
      timestamp: new Date().toISOString(),
      note: "Live BMKG feed kosong atau offline. Sistem beralih ke simulasi DEMO_MODE resmi.",
    });
  }

  // 4. Live mode but BMKG returned nothing or errored
  return NextResponse.json({
    isDemo: false,
    scenario: null,
    matchResult: {
      matched: false,
      status: isFetchError ? "unavailable" : "no_match",
      warning: null,
      matchedLocation: null,
      confidence: "no_match",
      matchedField: null,
      reason: isFetchError
        ? "Layanan BMKG CAP tidak dapat dihubungi saat ini."
        : "Tidak ada peringatan aktif yang cocok.",
      source: "BMKG",
    },
    location: userLocation,
    timestamp: new Date().toISOString(),
  });
}
