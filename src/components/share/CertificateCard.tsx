import React from "react";
import { UserProfile, SpecialBadge, TitleRank } from "@/types";
import { DISTRICTS } from "@/data/districts";
import { DISTRICT_CENTERS } from "@/data/districtCenters";
import UserAvatar from "@/components/auth/UserAvatar";
import { toBn } from "@/utils/bengaliDigits";
import { 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  TrendingUp,
  Award,
  Smile
} from "lucide-react";
import { 
  calculateBonusPoints, 
  calculateTotalScore, 
  getMemoryRank 
} from "@/utils/scoreCalculator";

interface CertificateCardProps {
  cardRef?: React.RefObject<HTMLDivElement>;
  userProfile: UserProfile;
  selectedDistrictIds: string[];
  selectedMemoryIds?: string[];
  rank: TitleRank;
  percentage: number;
  unlockedBadges?: SpecialBadge[];
}

export default function CertificateCard({
  cardRef,
  userProfile,
  selectedDistrictIds,
  selectedMemoryIds = [],
  rank,
  percentage,
  unlockedBadges = [],
}: CertificateCardProps) {
  const selectedCount = selectedDistrictIds.length;
  const memoryCount = selectedMemoryIds.length;
  const bonusPoints = calculateBonusPoints(memoryCount);
  const totalScore = calculateTotalScore(selectedCount, memoryCount);
  const memoryRank = getMemoryRank(memoryCount);

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
      }}
      className="w-[580px] max-w-full mx-auto bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-500/60 shadow-2xl relative select-none box-border"
    >
      {/* Decorative Golden Corner Glows */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-44 h-44 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header */}
      <div className="flex items-center justify-between pb-3 mb-3 sm:pb-3.5 sm:mb-3.5 border-b border-emerald-500/30 gap-2 relative z-10">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-emerald-400 font-extrabold block leading-none whitespace-nowrap mb-0.5">
              অফিসিয়াল ভ্রমণ সনদপত্র
            </span>
            <h3 className="text-sm sm:text-base font-black text-white leading-normal whitespace-nowrap">
              যাযাবর মিটার ২০২৬
            </h3>
          </div>
        </div>

        {/* Clean Date Badge with Generous Safety Padding */}
        <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800 shrink-0 whitespace-nowrap leading-normal shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="whitespace-nowrap">{todayDate}</span>
        </div>
      </div>

      {/* 2. User Identity Row */}
      <div className="flex items-center gap-3.5 bg-slate-900/95 border border-slate-800 p-3.5 sm:p-4 rounded-2xl mb-3.5 relative z-10">
        <UserAvatar
          avatarUrl={userProfile.avatarUrl}
          name={userProfile.name}
          size={54}
          className="ring-2 ring-amber-400 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm sm:text-base font-black text-white truncate leading-snug">
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
          <span className="text-xs text-amber-300 font-bold block mt-1 leading-snug break-words">
            পদবী: {rank.title}
          </span>
        </div>

        {/* District Travel Progress (Core Theme Focus with Safe Padding) */}
        <div className="text-right shrink-0 bg-slate-950/70 border border-slate-800/80 px-3.5 py-2.5 rounded-xl min-w-[130px]">
          <span className="text-[10px] text-slate-400 block font-semibold leading-tight mb-1">ভ্রমণ সম্পন্ন</span>
          <div className="flex items-baseline justify-end gap-1.5 leading-normal">
            <span className="text-xl sm:text-2xl font-black text-emerald-400 leading-none">
              {toBn(selectedCount)}
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-300 leading-none whitespace-nowrap">/ ৬৪ জেলা</span>
          </div>
          <span className="text-[11px] text-amber-300 font-bold block mt-1.5 whitespace-nowrap leading-tight">
            {toBn(percentage)}% বাংলাদেশ
          </span>
        </div>
      </div>

      {/* 3. Progress Bar & District Count Ribbon */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 mb-3 relative z-10">
        <div className="flex items-center justify-between text-xs font-bold mb-2 gap-2">
          <span className="text-slate-300 flex items-center gap-1.5 text-xs whitespace-nowrap">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            বাংলাদেশ ভ্রমণ অগ্রগতি
          </span>
          <span className="text-amber-300 text-xs shrink-0 whitespace-nowrap">
            <strong className="text-white font-extrabold">{toBn(selectedCount)}</strong> / ৬৪ জেলা
          </span>
        </div>
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* 4. Compact Map Section with Highlighted Districts & Names on Map */}
      <div className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-2.5 mb-3 relative overflow-hidden">
        <div className="relative w-full aspect-[600/500] max-h-[290px] sm:max-h-[310px] flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 600 760"
            className="w-full h-full object-contain"
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
                    strokeWidth={isVisited ? 2.5 : 1}
                  />
                );
              })}
            </g>

            {/* Selected District Labels & Pins on the Map */}
            <g id="visited-district-labels">
              {selectedDistrictIds.map((id) => {
                const center = DISTRICT_CENTERS[id];
                if (!center) return null;

                return (
                  <g key={`label-${id}`} className="pointer-events-none select-none">
                    <circle
                      cx={center.x}
                      cy={center.y - 7}
                      r="4"
                      fill="#F59E0B"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
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
                      {center.nameBn}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Fallback watermark if 0 selected */}
          {selectedCount === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-400 font-semibold shadow-lg">
                ম্যাপে কোনো জেলা সিলেক্ট করা হয়নি
              </span>
            </div>
          )}

          {/* District counter badge in corner of map */}
          <div className="absolute bottom-3 right-3 text-xs text-slate-200 font-extrabold bg-slate-900/95 px-3.5 py-1.5 rounded-xl border border-slate-700/80 pointer-events-none whitespace-nowrap shadow-xl z-20">
            <span className="whitespace-nowrap">{toBn(selectedCount)} জেলা চিহ্নিত</span>
          </div>
        </div>
      </div>

      {/* 5. Roasting Quote with Explicit Header Border & Vertical Separation */}
      <div className="p-4 rounded-2xl bg-slate-900/95 border border-amber-500/40 mb-3.5 block relative z-10">
        <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-amber-500/20">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-xs font-black text-amber-300 whitespace-nowrap">
            অফিসিয়াল যাযাবর মূল্যায়ন:
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-semibold block pt-0.5">
          &quot;{rank.roast}&quot;
        </p>
      </div>

      {/* Tour Memories Achievement Badge */}
      {memoryCount > 0 && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-amber-950/40 border border-amber-500/40 flex items-center justify-between gap-3 mb-3.5 relative z-10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <Smile className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] text-slate-300 block leading-tight font-medium">
                ট্যুরের কাণ্ডকারখানা স্বীকৃতি:
              </span>
              <span className="text-xs sm:text-sm font-black text-amber-200 block truncate mt-0.5">
                {memoryRank} ({toBn(memoryCount)}টি ঘটনা)
              </span>
            </div>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/50 shrink-0 whitespace-nowrap shadow-sm">
            +{toBn(bonusPoints)} বোনাস পয়েন্ট
          </span>
        </div>
      )}

      {/* 6. Unlocked Badges (compact single row if any) */}
      {unlockedBadges.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mb-3.5 relative z-10">
          <span className="text-xs text-slate-300 font-bold mr-1 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-400" /> ট্রফি:
          </span>
          {unlockedBadges.slice(0, 3).map((badge) => (
            <span
              key={badge.id}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-200 text-[11px] font-bold border border-amber-500/40 whitespace-nowrap"
            >
              {badge.title}
            </span>
          ))}
        </div>
      )}

      {/* 7. Footer (Verification Seal) */}
      <div className="pt-3.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300 relative z-10 gap-2">
        <div className="min-w-0">
          <span className="font-extrabold text-emerald-400 block text-xs sm:text-sm leading-none whitespace-nowrap">
            jajabor.mdrasel.site
          </span>
          <span className="text-[11px] text-slate-400 leading-normal block mt-1.5 whitespace-nowrap">
            যাযাবর মিটার ২০২৬ | সনদ নং: JJB-{toBn(selectedCount)}
          </span>
        </div>
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
