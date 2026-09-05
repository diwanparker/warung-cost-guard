import { NextRequest, NextResponse } from "next/server";
import { fetchBmkgWarnings } from "@/lib/bmkg/client";
import { createDynamicDemoWarnings } from "@/data/demo/scenarios";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Check demo warnings first
  const demoScenarios = createDynamicDemoWarnings();
  for (const key of ["A", "B", "C"] as const) {
    const warning = demoScenarios[key].getWarning();
    if (warning && (warning.id === id || id.startsWith("BMKG-NOWCAST"))) {
      return NextResponse.json({
        warning,
        isDemo: true,
      });
    }
  }

  // Check live warnings
  const warnings = await fetchBmkgWarnings();
  const found = warnings.find((w) => w.id === id);

  if (!found) {
    return NextResponse.json(
      { error: "Peringatan tidak ditemukan" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    warning: found,
    isDemo: false,
  });
}
