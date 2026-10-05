import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { calculateRank, calculatePercentage, calculateBonusPoints, getMemoryRank } from "@/utils/scoreCalculator";
import { toBn } from "@/utils/bengaliDigits";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // 1. Parse query params
    const rawName = searchParams.get("n") || searchParams.get("name") || "অতিথি যাযাবর";
    const name = decodeURIComponent(rawName);

    const rawDistricts = searchParams.get("d") || searchParams.get("districts") || searchParams.get("count") || "";
    let districtCount = 0;
    if (rawDistricts) {
      if (rawDistricts.includes(",")) {
        districtCount = rawDistricts.split(",").filter(Boolean).length;
      } else if (!isNaN(Number(rawDistricts))) {
        districtCount = parseInt(rawDistricts, 10);
      }
    }

    const rawMemories = searchParams.get("m") || searchParams.get("memories") || "";
    let memoryCount = 0;
    if (rawMemories) {
      if (rawMemories.includes(",")) {
        memoryCount = rawMemories.split(",").filter(Boolean).length;
      } else if (!isNaN(Number(rawMemories))) {
        memoryCount = parseInt(rawMemories, 10);
      }
    }

    const rank = calculateRank(districtCount);
    const percentage = calculatePercentage(districtCount);
    const bonusPoints = calculateBonusPoints(memoryCount);
    const memoryRank = getMemoryRank(memoryCount);

    const todayDate = new Date().toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // 2. Fetch local fonts as ArrayBuffer (Edge runtime compatible)
    const fontBold = await fetch(
      new URL("../../../../public/fonts/HindSiliguri-Bold.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer());

    const fontRegular = await fetch(
      new URL("../../../../public/fonts/HindSiliguri-Regular.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#020617",
            backgroundImage:
              "radial-gradient(circle at 100% 0%, rgba(16, 185, 129, 0.25) 0%, transparent 55%), radial-gradient(circle at 0% 100%, rgba(245, 158, 11, 0.2) 0%, transparent 55%)",
            padding: "44px 52px",
            border: "6px solid rgba(16, 185, 129, 0.5)",
            borderRadius: "28px",
            fontFamily: "'Hind Siliguri'",
            color: "#ffffff",
            boxSizing: "border-box",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "18px",
                  backgroundColor: "rgba(16, 185, 129, 0.2)",
                  border: "2px solid rgba(16, 185, 129, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#34d399",
                  fontSize: "28px",
                }}
              >
                🧭
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontSize: "15px",
                    color: "#34d399",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  অফিসিয়াল ভ্রমণ সনদপত্র
                </span>
                <span style={{ fontSize: "30px", fontWeight: 900, color: "#ffffff", lineHeight: 1.1 }}>
                  যাযাবর মিটার ২০২৬
                </span>
              </div>
            </div>

            {/* Date Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                padding: "10px 22px",
                borderRadius: "16px",
                border: "1px solid #334155",
                color: "#fcd34d",
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              <span>{`📅 ${todayDate}`}</span>
            </div>
          </div>

          {/* User Profile & Score Card */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "rgba(15, 23, 42, 0.95)",
              padding: "22px 30px",
              borderRadius: "22px",
              border: "2px solid #1e293b",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              <div
                style={{
                  width: "68px",
                  height: "68px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(245, 158, 11, 0.2)",
                  border: "3px solid #f59e0b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "34px",
                }}
              >
                🎒
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "32px", fontWeight: 900, color: "#ffffff" }}>
                    {name}
                  </span>
                  <span style={{ color: "#34d399", fontSize: "22px" }}>✓</span>
                </div>
                <span style={{ fontSize: "19px", color: "#fcd34d", fontWeight: 700, marginTop: "2px" }}>
                  {`পদবী: ${rank.title}`}
                </span>
              </div>
            </div>

            {/* District Travel Stat */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                backgroundColor: "rgba(2, 6, 23, 0.8)",
                padding: "12px 26px",
                borderRadius: "18px",
                border: "1px solid #334155",
              }}
            >
              <span style={{ fontSize: "14px", color: "#94a3b8", fontWeight: 600 }}>ভ্রমণ সম্পন্ন</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span style={{ fontSize: "38px", fontWeight: 900, color: "#34d399", lineHeight: 1 }}>
                  {toBn(districtCount)}
                </span>
                <span style={{ fontSize: "20px", fontWeight: 700, color: "#cbd5e1", lineHeight: 1 }}>
                  / ৬৪ জেলা
                </span>
              </div>
              <span style={{ fontSize: "15px", color: "#fcd34d", fontWeight: 700, marginTop: "2px" }}>
                {`${toBn(percentage)}% বাংলাদেশ`}
              </span>
            </div>
          </div>

          {/* Roasting Quote Box */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "rgba(15, 23, 42, 0.95)",
              padding: "16px 26px",
              borderRadius: "18px",
              border: "1px solid rgba(245, 158, 11, 0.4)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                borderBottom: "1px solid rgba(245, 158, 11, 0.2)",
                paddingBottom: "6px",
                marginBottom: "6px",
              }}
            >
              <span style={{ color: "#f59e0b", fontSize: "16px" }}>✨</span>
              <span style={{ fontSize: "15px", color: "#fcd34d", fontWeight: 800 }}>
                অফিসিয়াল যাযাবর মূল্যায়ন:
              </span>
            </div>
            <span style={{ fontSize: "18px", color: "#f1f5f9", fontWeight: 600, lineHeight: 1.4 }}>
              {`"${rank.roast}"`}
            </span>
          </div>

          {/* Tour Memories Recognition (if any) */}
          {memoryCount > 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "rgba(69, 26, 3, 0.35)",
                padding: "10px 22px",
                borderRadius: "14px",
                border: "1px solid rgba(245, 158, 11, 0.4)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "18px" }}>🎭</span>
                <span style={{ fontSize: "15px", color: "#fde68a", fontWeight: 700 }}>
                  {`ট্যুরের কাণ্ডকারখানা স্বীকৃতি: ${memoryRank} (${toBn(memoryCount)}টি ঘটনা)`}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "rgba(245, 158, 11, 0.25)",
                  padding: "4px 14px",
                  borderRadius: "999px",
                  color: "#fcd34d",
                  fontSize: "14px",
                  fontWeight: 900,
                  border: "1px solid rgba(245, 158, 11, 0.5)",
                }}
              >
                <span>{`+${toBn(bonusPoints)} বোনাস পয়েন্ট`}</span>
              </div>
            </div>
          ) : null}

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid #1e293b",
              paddingTop: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ fontSize: "19px", color: "#34d399", fontWeight: 800 }}>
                jajabor.mdrasel.site
              </span>
              <span style={{ fontSize: "15px", color: "#94a3b8", fontWeight: 600 }}>
                যাযাবর মিটার ২০২৬ | সনদ নং: JJB-{toBn(districtCount)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                padding: "6px 14px",
                borderRadius: "12px",
                border: "1px solid rgba(16, 185, 129, 0.4)",
                color: "#34d399",
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              🛡️ অথেনটিক ভ্রমণ সনদ
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Hind Siliguri",
            data: fontBold,
            weight: 700,
            style: "normal",
          },
          {
            name: "Hind Siliguri",
            data: fontRegular,
            weight: 400,
            style: "normal",
          },
        ],
      }
    );
  } catch (error) {
    console.error("OG Image generation failed:", error);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
