import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getAnalytics } from "@/lib/firestore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "jajabor2026";
const SECRET_KEY = process.env.NEXTAUTH_SECRET || "jajabor-secret-key-2026-admin-access";

function generateAdminToken(): string {
  return crypto.createHmac("sha256", SECRET_KEY).update(ADMIN_PASSWORD).digest("hex");
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("jajabor_admin_auth")?.value;
    const expectedToken = generateAdminToken();

    if (!token || token !== expectedToken) {
      return NextResponse.json(
        { error: "Unauthorized access! Admin login required." },
        { status: 401 }
      );
    }

    const data = await getAnalytics();
    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error: any) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: error.message || "Failed to load stats" }, { status: 500 });
  }
}
