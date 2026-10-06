import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { calculateRank, calculatePercentage } from "@/utils/scoreCalculator";
import { toBn } from "@/utils/bengaliDigits";
import { DISTRICTS } from "@/data/districts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // 1. Parse query params
    const rawName = searchParams.get("n") || searchParams.get("name") || "অতিথি যাযাবর";
    let name = "অতিথি যাযাবর";
    try {
      name = rawName.includes("%") ? decodeURIComponent(rawName) : rawName;
    } catch {
      name = rawName;
    }

    const rawDistricts = searchParams.get("d") || searchParams.get("districts") || searchParams.get("count") || "";
    let visitedIds: string[] = [];
    let districtCount = 0;
    if (rawDistricts) {
      if (rawDistricts.includes(",")) {
        visitedIds = rawDistricts.split(",").filter(Boolean);
        districtCount = visitedIds.length;
      } else if (!isNaN(Number(rawDistricts))) {
        districtCount = parseInt(rawDistricts, 10);
      }
    }

    const rank = calculateRank(districtCount);
    const percentage = calculatePercentage(districtCount);

    // Read fonts safely from filesystem (Node.js runtime compatible)
    const fontBold = fs.readFileSync(
      path.join(process.cwd(), "public", "fonts", "HindSiliguri-Bold.ttf")
    );
    const fontRegular = fs.readFileSync(
      path.join(process.cwd(), "public", "fonts", "HindSiliguri-Regular.ttf")
    );

    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "stretch",
            backgroundColor: "#020617",
            backgroundImage:
              "radial-gradient(circle at 100% 0%, rgba(16, 185, 129, 0.22) 0%, transparent 55%), radial-gradient(circle at 0% 100%, rgba(245, 158, 11, 0.18) 0%, transparent 55%)",
            padding: "36px 42px",
            border: "4px solid rgba(16, 185, 129, 0.6)",
            borderRadius: "28px",
            fontFamily: "'Hind Siliguri'",
            color: "#ffffff",
            boxSizing: "border-box",
            gap: "28px",
          }}
        >
          {/* Left Column: Summary, User Profile, Scores & Roast */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              flex: 1,
              minWidth: 0,
            }}
          >
            {/* Header: Visited Districts Travel Summary */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                borderBottom: "1px solid rgba(16, 185, 129, 0.3)",
                paddingBottom: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    backgroundColor: "rgba(16, 185, 129, 0.2)",
                    border: "2px solid rgba(16, 185, 129, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#34d399",
                    fontSize: "24px",
                  }}
                >
                  🧭
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span
                      style={{
                        fontSize: "24px",
                        fontWeight: 900,
                        color: "#ffffff",
                        lineHeight: 1.1,
                      }}
                    >
                      ঘুরে দেখা জেলার ভ্রমণ সারাংশ
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 800,
                        backgroundColor: "rgba(6, 78, 59, 0.7)",
                        border: "1px solid rgba(16, 185, 129, 0.5)",
                        color: "#34d399",
                        padding: "3px 8px",
                        borderRadius: "8px",
                      }}
                    >
                      যাযাবর মিটার
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: 800,
                      color: "#fcd34d",
                      marginTop: "4px",
                    }}
                  >
                    {districtCount > 0
                      ? `৬৪ জেলার মধ্যে ${toBn(districtCount)}টি জেলা ভ্রমণ সম্পন্ন (${toBn(percentage)}%)`
                      : "৬৪ জেলার ভ্রমণ মানচিত্র ও সারাংশ"}
                  </span>
                </div>
              </div>
            </div>

            {/* User Profile & Bold District Score Box */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                padding: "18px 24px",
                borderRadius: "20px",
                border: "1.5px solid #1e293b",
                gap: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0 }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(245, 158, 11, 0.2)",
                    border: "2px solid #f59e0b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "26px",
                  }}
                >
                  👤
                </div>
                <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        fontSize: "26px",
                        fontWeight: 900,
                        color: "#ffffff",
                        lineHeight: 1.1,
                      }}
                    >
                      {name}
                    </span>
                    <span style={{ color: "#34d399", fontSize: "18px" }}>✓</span>
                  </div>
                  <span
                    style={{
                      fontSize: "16px",
                      color: "#fcd34d",
                      fontWeight: 700,
                      marginTop: "2px",
                    }}
                  >
                    {`পদবী: ${rank.title}`}
                  </span>
                </div>
              </div>

              {/* District Travel Stat (Bold: X / ৬৪ জেলা) */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  backgroundColor: "rgba(2, 6, 23, 0.85)",
                  padding: "10px 18px",
                  borderRadius: "14px",
                  border: "1px solid rgba(16, 185, 129, 0.4)",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    fontSize: "36px",
                    fontWeight: 900,
                    color: "#34d399",
                    lineHeight: 1,
                  }}
                >
                  {toBn(districtCount)}
                </span>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 800,
                    color: "#cbd5e1",
                    lineHeight: 1,
                  }}
                >
                  / ৬৪ জেলা
                </span>
              </div>
            </div>

            {/* Roast Quote Box */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                padding: "14px 20px",
                borderRadius: "16px",
                border: "1px solid rgba(245, 158, 11, 0.3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "4px",
                }}
              >
                <span style={{ color: "#f59e0b", fontSize: "14px" }}>✨</span>
                <span style={{ fontSize: "13px", color: "#fcd34d", fontWeight: 800 }}>
                  অফিসিয়াল যাযাবর মূল্যায়ন:
                </span>
              </div>
              <span
                style={{
                  fontSize: "15px",
                  color: "#f1f5f9",
                  fontWeight: 600,
                  lineHeight: 1.35,
                  fontStyle: "italic",
                }}
              >
                {`"${rank.roast}"`}
              </span>
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid #1e293b",
                paddingTop: "10px",
              }}
            >
              <span style={{ fontSize: "15px", color: "#34d399", fontWeight: 800 }}>
                jajabor.mdrasel.site
              </span>
              <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 600 }}>
                যাযাবর মিটার ২০২৬
              </span>
            </div>
          </div>

          {/* Right Column: Hero Bangladesh Map */}
          <div
            style={{
              width: "440px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(2, 6, 23, 0.95)",
              borderRadius: "22px",
              border: "1.5px solid #1e293b",
              padding: "12px",
              position: "relative",
            }}
          >
            <svg
              width="416"
              height="528"
              viewBox="0 0 600 760"
            >
              {DISTRICTS.map((d) => {
                const isVisited = visitedIds.includes(d.id);
                return (
                  <path
                    key={d.id}
                    d={d.path}
                    fill={isVisited ? "#059669" : "#1e293b"}
                    stroke={isVisited ? "#f59e0b" : "#334155"}
                    strokeWidth={isVisited ? "3" : "0.8"}
                  />
                );
              })}
            </svg>
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
