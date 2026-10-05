import React from "react";
import { UserProfile, TitleRank, SpecialBadge } from "@/types";
import { DISTRICTS } from "@/data/districts";
import { DISTRICT_CENTERS } from "@/data/districtCenters";
import { toBn } from "@/utils/bengaliDigits";
import { 
  Compass, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2,
  MapPin,
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
      className="w-[580px] max-w-full mx-auto text-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-500/70 shadow-2xl relative select-none box-border"
    >
      {/* 1. Clean Header */}
      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-emerald-500/30 gap-2 relative z-10">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
            <Compass className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-emerald-400 font-extrabold block leading-none whitespace-nowrap mb-0.5">
              অফিসিয়াল ভ্রমণ সনদপত্র
            </span>
            <h3 className="text-base font-black text-white leading-normal whitespace-nowrap">
              যাযাবর মিটার ২০২৬
            </h3>
          </div>
        </div>

        {/* Date Badge */}
        <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800 shrink-0 whitespace-nowrap shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="whitespace-nowrap">{todayDate}</span>
        </div>
      </div>

      {/* 2. Hero Section: User Identity + Focused Travel Score */}
      <div className="bg-slate-900/95 border border-slate-800 p-4 rounded-2xl mb-3.5 relative z-10 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          {/* User Profile */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Pristine Circular Avatar with clean standard border (NO Tailwind ring classes to prevent canvas artifact) */}
            <div
              className="rounded-full overflow-hidden border-2 border-amber-400 shrink-0 bg-slate-800 flex items-center justify-center"
              style={{ width: 56, height: 56, minWidth: 56, minHeight: 56 }}
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
                  <Compass className="w-7 h-7" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="text-base font-black text-white truncate leading-snug">
                  {userProfile.name}
                </h4>
                {userProfile.isLoggedIn ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 shrink-0 font-medium">
                    গেস্ট
                  </span>
                )}
              </div>
              <span className="text-xs text-amber-300 font-bold block mt-0.5 leading-snug break-words">
                পদবী: {rank.title}
              </span>
            </div>
          </div>

          {/* Focused Travel Metric Box */}
          <div className="text-right shrink-0 bg-slate-950/80 border border-emerald-500/30 px-4 py-2.5 rounded-xl min-w-[150px] shadow-inner">
            <span className="text-[10px] text-slate-400 block font-semibold leading-tight mb-1">
              ভ্রমণ সম্পন্ন
            </span>
            <div className="flex items-baseline justify-end gap-1.5 leading-normal">
              <span className="text-2xl font-black text-emerald-400 leading-none">
                {toBn(selectedCount)}
              </span>
              <span className="text-xs font-bold text-slate-300 leading-none whitespace-nowrap">
                / ৬৪ জেলা
              </span>
            </div>
            <div className="flex items-center justify-end gap-1.5 mt-1.5">
              <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-[11px] text-amber-300 font-black leading-none whitespace-nowrap">
                {toBn(percentage)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. The Hero Bangladesh Map (Generous and Visually Striking) */}
      <div className="w-full bg-slate-950/95 border border-slate-800 rounded-2xl p-3 mb-3.5 relative overflow-hidden shadow-inner">
        <div className="relative w-full aspect-[600/510] max-h-[350px] flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 600 760"
            className="w-full h-full object-contain filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)]"
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

          {/* District counter badge in corner of map */}
          <div className="absolute bottom-3 right-3 text-xs text-slate-200 font-extrabold bg-slate-900/95 px-3.5 py-1.5 rounded-xl border border-slate-700/80 pointer-events-none whitespace-nowrap shadow-xl z-20 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span className="whitespace-nowrap">{toBn(selectedCount)} জেলা ভ্রমণ সম্পন্ন</span>
          </div>
        </div>
      </div>

      {/* 4. Official Roast Quote (Minimal & Fun) */}
      <div className="px-4 py-3 rounded-2xl bg-slate-900/90 border border-amber-500/30 mb-3.5 relative z-10 shadow-md">
        <div className="flex items-center gap-1.5 mb-1 text-[11px] font-black text-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>অফিসিয়াল যাযাবর মূল্যায়ন:</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-semibold italic">
          &quot;{rank.roast}&quot;
        </p>
      </div>

      {/* 5. Clean Footer (Verification Seal) */}
      <div className="pt-3 border-t border-slate-800/90 flex items-center justify-between text-xs text-slate-300 relative z-10 gap-2">
        <div className="min-w-0">
          <span className="font-extrabold text-emerald-400 block text-xs sm:text-sm leading-none whitespace-nowrap">
            jajabor.mdrasel.site
          </span>
          <span className="text-[10px] sm:text-[11px] text-slate-400 leading-normal block mt-1 whitespace-nowrap">
            যাযাবর মিটার ২০২৬ | সনদ নং: JJB-{toBn(selectedCount)}
          </span>
        </div>
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
          <ShieldCheck className="w-4.5 h-4.5" />
        </div>
      </div>
    </div>
  );
}
