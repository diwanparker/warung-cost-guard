import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildRoleActionPlan } from "@/lib/actions/planner";
import type { UserRole } from "@/types/user";

const requestSchema = z.object({
  warning: z.any(),
  role: z.string().default("campus_operations"),
  context: z
    .object({
      outdoor_event: z.boolean().optional(),
      participants: z.number().optional(),
      notes: z.string().optional(),
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = requestSchema.parse(body);

    const plan = buildRoleActionPlan({
      warning: parsed.warning,
      role: parsed.role as UserRole,
      context: parsed.context,
    });

    return NextResponse.json({
      success: true,
      actionPlan: plan,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Action plan API error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyusun rencana tindakan." },
      { status: 400 }
    );
  }
}
