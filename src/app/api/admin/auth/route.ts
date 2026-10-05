import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "jajabor2026";
const SECRET_KEY = process.env.NEXTAUTH_SECRET || "jajabor-secret-key-2026-admin-access";

function generateAdminToken(): string {
  return crypto.createHmac("sha256", SECRET_KEY).update(ADMIN_PASSWORD).digest("hex");
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("jajabor_admin_auth")?.value;
  const expectedToken = generateAdminToken();

  const isAuthenticated = Boolean(token && token === expectedToken);
  return NextResponse.json({ isAuthenticated });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, password } = body;

    if (action === "logout") {
      const res = NextResponse.json({ success: true, message: "Logged out" });
      res.cookies.set("jajabor_admin_auth", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
      });
      return res;
    }

    if (action === "login") {
      if (!password || password !== ADMIN_PASSWORD) {
        return NextResponse.json(
          { success: false, error: "ভুল পাসওয়ার্ড! দয়া করে সঠিক অ্যাডমিন পাসওয়ার্ড দিন।" },
          { status: 401 }
        );
      }

      const token = generateAdminToken();
      const res = NextResponse.json({ success: true, message: "Logged in successfully" });

      res.cookies.set("jajabor_admin_auth", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return res;
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
