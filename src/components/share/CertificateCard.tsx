import React from "react";
import { UserProfile, TitleRank, SpecialBadge } from "@/types";
import { DISTRICTS } from "@/data/districts";
import { DISTRICT_CENTERS } from "@/data/districtCenters";
import { toBn } from "@/utils/bengaliDigits";
import { 
  Compass, 
  Calendar, 
  CheckCircle2,
  Sparkles
} from "lucide-react";

interface CertificateCardProps {
  cardRef?: React.RefObject<HTMLDivElement>;
  userProfile: UserProfile;
  selectedDistrictIds: string[];
  selectedMemoryIds?: string[];
  rank: TitleRank;
  percentage: number;
  unlockedBadges?: SpecialBadge[];
  showDistrictNames?: boolean;
}

export default function CertificateCard({
  cardRef,
  userProfile,
  selectedDistrictIds,
  rank,
  percentage,
  showDistrictNames = true,
}: CertificateCardProps) {
  const selectedCount = selectedDistrictIds.length;

  const todayDate = new Date().toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      ref={cardRef}
      data-certificate-card="true"
      style={{
        fontFamily: "var(--font-noto-bengali), 'Noto Sans Bengali', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        background: "radial-gradient(ellipse at top right, rgba(5, 150, 105, 0.16), transparent 55%), radial-gradient(ellipse at bottom left, rgba(245, 158, 11, 0.12), transparent 55%), #020617",
      }}
      className="w-[580px] max-w-full mx-auto text-white rounded-2xl p-4 sm:p-5 border-2 border-emerald-500/70 shadow-2xl relative select-none box-border"
    >
      {/* 1. Header: Explicit Visited Districts Travel Summary */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-emerald-500/30 gap-2 relative z-10">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
            <Compass className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-white leading-none whitespace-nowrap">
                ঘুরে দেখা জেলার ভ্রমণ সারাংশ
              </h3>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-1.5 py-0.5 rounded leading-none whitespace-nowrap">
                যাযাবর মিটার
              </span>
            </div>
            <span className="text-[10.5px] text-amber-300 font-bold block leading-tight mt-1 whitespace-nowrap">
              {selectedCount > 0
                ? `৬৪ জেলার মধ্যে ${toBn(selectedCount)}টি জেলা ভ্রমণ সম্পন্ন (${toBn(percentage)}%)`
                : "৬৪ জেলার ভ্রমণ মানচিত্র ও সারাংশ"}
            </span>
          </div>
        </div>

        {/* Date Badge */}
        <div className="flex items-center gap-1 text-[11px] text-amber-300/90 font-bold bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800 shrink-0 whitespace-nowrap">
          <Calendar className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="whitespace-nowrap">{todayDate}</span>
        </div>
      </div>

      {/* 2. Compact User Identity + Focused Travel Score */}
      <div className="bg-slate-900/90 border border-slate-800 px-3.5 py-2.5 rounded-xl mb-2.5 relative z-10 shadow-md">
        <div className="flex items-center justify-between gap-3">
          {/* User Profile */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {/* Pristine Circular Avatar with clean standard border */}
            <div
              className="rounded-full overflow-hidden border-2 border-amber-400 shrink-0 bg-slate-800 flex items-center justify-center"
              style={{ width: 44, height: 44, minWidth: 44, minHeight: 44 }}
            >
              {userProfile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.name}
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover rounded-full block"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-emerald-800 via-teal-700 to-amber-600 flex items-center justify-center text-amber-200">
                  <Compass className="w-5 h-5" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-black text-white truncate leading-tight">
                  {userProfile.name}
                </h4>
                {userProfile.isLoggedIn ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 shrink-0 font-medium leading-none">
                    গেস্ট
                  </span>
                )}
              </div>
              <span className="text-[11px] text-amber-300 font-bold block mt-0.5 leading-tight truncate">
                পদবী: {rank.title}
              </span>
            </div>
          </div>

          {/* Bold and Compact District Count */}
          <div className="shrink-0 bg-slate-950/80 border border-emerald-500/30 px-3 py-1.5 rounded-xl shadow-inner flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 leading-none">
              {toBn(selectedCount)}
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-slate-200 leading-none whitespace-nowrap">
              / ৬৪ জেলা
            </span>
          </div>
        </div>
      </div>

      {/* 3. The Hero Bangladesh Map (Compact & Sharp) */}
      <div className="w-full bg-slate-950/95 border border-slate-800 rounded-xl p-2 sm:p-2.5 mb-2.5 relative overflow-hidden shadow-inner">
        <div className="relative w-full h-[260px] sm:h-[275px] flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 600 760"
            className="w-full h-full object-contain filter drop-shadow-[0_6px_16px_rgba(0,0,0,0.5)]"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* 64 Districts Paths */}
            <g id="certificate-districts">
              {DISTRICTS.map((d) => {
                const isVisited = selectedDistrictIds.includes(d.id);
                return (
                  <path
                    key={d.id}
                    d={d.path}
                    fill={isVisited ? "#059669" : "#1E293B"}
                    stroke={isVisited ? "#F59E0B" : "#334155"}
                    strokeWidth={isVisited ? 2.5 : 0.8}
                  />
                );
              })}
            </g>

            {/* Selected District Labels & Pins on the Map */}
            <g id="visited-district-labels">
              {selectedDistrictIds.map((id) => {
                const center = DISTRICT_CENTERS[id];
                if (!center) return null;
                const district = DISTRICTS.find((d) => d.id === id);
                const displayNameBn = district?.nameBn || center.nameBn;

                return (
                  <g key={`cert-label-${id}`} className="pointer-events-none select-none">
                    <circle
                      cx={center.x}
                      cy={center.y - (showDistrictNames ? 7 : 0)}
                      r={showDistrictNames ? "4" : "3.5"}
                      fill="#F59E0B"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                    {showDistrictNames && (
                      <text
                        x={center.x}
                        y={center.y + 8}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#FFFFFF"
                        stroke="#022c22"
                        strokeWidth="3.5"
                        strokeLinejoin="round"
                        paintOrder="stroke fill"
                        fontSize="12"
                        fontWeight="900"
                      >
                        {displayNameBn}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Fallback watermark if 0 selected */}
          {selectedCount === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-400 font-semibold shadow-lg">
                ম্যাপে কোনো জেলা সিলেক্ট করা হয়নি
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 4. Official Roast Quote (Compact & Fun) */}
      <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-amber-500/25 mb-2.5 relative z-10 shadow-sm flex items-start gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-[11px] sm:text-xs text-slate-200 leading-snug font-medium italic">
          &quot;{rank.roast}&quot;
        </p>
      </div>

      {/* 5. Minimal Compact Footer: just website link in small text */}
      <div className="pt-2 border-t border-slate-800/80 text-center relative z-10">
        <span className="text-[11px] font-bold text-emerald-400/90 tracking-wider">
          jajabor.mdrasel.site
        </span>
      </div>
    </div>
  );
}
