import { NextResponse } from "next/server";
import { fetchLatestEarthquake } from "@/lib/bmkg/earthquake";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get("forceRefresh") === "true";

  const earthquake = await fetchLatestEarthquake(forceRefresh);

  return NextResponse.json({
    success: Boolean(earthquake),
    data: earthquake,
    timestamp: new Date().toISOString(),
    source: "BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)",
  });
}
