import { NextRequest, NextResponse } from "next/server";
import { recordVisitor } from "@/lib/firestore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { visitorId, userType, name, avatarUrl, path } = body;

    if (!visitorId) {
      return NextResponse.json({ error: "Missing visitorId" }, { status: 400 });
    }

    const userAgent = req.headers.get("user-agent") || "";
    let device: "mobile" | "desktop" | "tablet" = "desktop";
    if (/tablet|ipad/i.test(userAgent)) {
      device = "tablet";
    } else if (/mobile|iphone|android/i.test(userAgent)) {
      device = "mobile";
    }

    const result = await recordVisitor({
      visitorId,
      userType: userType === "logged_in" ? "logged_in" : "guest",
      name,
      avatarUrl,
      device: body.device || device,
      path: path || "/",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Tracking API error:", error);
    return NextResponse.json({ error: error.message || "Failed to track" }, { status: 500 });
  }
}
