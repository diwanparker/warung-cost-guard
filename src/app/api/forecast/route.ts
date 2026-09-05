import { NextResponse } from "next/server";
import { fetchWeatherForecast, resolveAdm4Code } from "@/lib/bmkg/forecast";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let adm4 = searchParams.get("adm4");
  const city = searchParams.get("city");
  const district = searchParams.get("district");
  const forceRefresh = searchParams.get("forceRefresh") === "true";

  if (!adm4 && (city || district)) {
    adm4 = resolveAdm4Code(city || undefined, district || undefined);
  }

  const forecast = await fetchWeatherForecast(adm4 || "35.78.13.1001", forceRefresh);

  return NextResponse.json({
    success: Boolean(forecast),
    data: forecast,
    timestamp: new Date().toISOString(),
    source: "BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)",
  });
}
