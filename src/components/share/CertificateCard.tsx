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
  cardRef: React.RefObject<HTMLDivElement>;
  userProfile: UserProfile;
  selectedDistrictIds: string[];
  selectedMemoryIds?: string[];
  rank: TitleRank;
  percentage: number;
  unlockedBadges: SpecialBadge[];
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
      className="w-full max-w-[440px] sm:max-w-[460px] bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-4 sm:p-5 border-2 border-emerald-500/60 shadow-2xl relative select-none box-border overflow-hidden"
    >
      {/* Decorative Golden Corner Glows */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header (Compact) */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-emerald-500/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-extrabold block leading-none">
              অফিসিয়াল ভ্রমণ সনদপত্র
            </span>
            <h3 className="text-xs sm:text-sm font-black text-white leading-tight mt-0.5">
              যাযাবর মিটার ২০২৬
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-300 font-medium bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800">
          <Calendar className="w-3 h-3 text-amber-400" />
          <span>{todayDate}</span>
        </div>
      </div>

      {/* 2. User Identity Row */}
      <div className="flex items-center gap-3 bg-slate-900/95 border border-slate-800 p-2.5 sm:p-3 rounded-2xl mb-2.5">
        <UserAvatar
          avatarUrl={userProfile.avatarUrl}
          name={userProfile.name}
          size={48}
          className="ring-2 ring-amber-400"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm sm:text-base font-black text-white truncate">
              {userProfile.name}
            </h4>
            {userProfile.isLoggedIn ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                গেস্ট
              </span>
            )}
          </div>
          <span className="text-[11px] sm:text-xs text-amber-300 font-bold block mt-0.5 truncate">
            পদবী: {rank.title}
          </span>
        </div>

        {/* Total Score & Completion */}
        <div className="text-right shrink-0">
          <span className="text-[10px] text-amber-300/90 block font-bold leading-tight">মোট স্কোর</span>
          <div className="flex items-baseline justify-end gap-1">
            <span className="text-lg sm:text-xl font-black text-amber-400 leading-none">
              {toBn(totalScore)}
            </span>
            <span className="text-[10px] font-bold text-amber-200">পয়েন্ট</span>
          </div>
          <span className="text-[10px] text-emerald-400 block font-semibold mt-0.5">
            {toBn(percentage)}% সম্পন্ন
          </span>
        </div>
      </div>

      {/* 3. Progress Bar & District Count Ribbon */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 mb-2.5">
        <div className="flex items-center justify-between text-xs font-bold mb-1.5">
          <span className="text-slate-300 flex items-center gap-1 text-[11px]">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            বাংলাদেশ ভ্রমণ অগ্রগতি
          </span>
          <span className="text-amber-300 text-xs">
            <strong className="text-white font-extrabold">{toBn(selectedCount)}</strong> / ৬৪ জেলা
          </span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* 4. Compact Map Section with Highlighted Districts & Names on Map */}
      <div className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-2 mb-2.5 relative overflow-hidden">
        <div className="relative w-full aspect-[600/540] max-h-[250px] sm:max-h-[270px] flex items-center justify-center">
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
          <div className="absolute bottom-1 right-2 text-[10px] text-slate-300 font-bold bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-800 pointer-events-none">
            {toBn(selectedCount)} জেলা চিহ্নিত
          </div>
        </div>
      </div>

      {/* 5. Roasting Quote (Compact & Crisp) */}
      <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-900/95 border border-amber-500/40 mb-2.5">
        <div className="flex items-center gap-1 text-[11px] font-black text-amber-300 mb-0.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>অফিসিয়াল যাযাবর মূল্যায়ন:</span>
        </div>
        <p className="text-xs sm:text-[13px] text-slate-100 leading-snug font-semibold">
          &quot;{rank.roast}&quot;
        </p>
      </div>

      {/* Tour Memories Achievement Badge */}
      {memoryCount > 0 && (
        <div className="p-2 sm:p-2.5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-amber-950/40 border border-amber-500/40 flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
              <Smile className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-300 block leading-tight font-medium">ট্যুরের কাণ্ডকারখানা স্বীকৃতি:</span>
              <span className="text-[11px] sm:text-xs font-black text-amber-200 truncate block">
                {memoryRank} ({toBn(memoryCount)}টি ঘটনা)
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/50 shrink-0 whitespace-nowrap">
            +{toBn(bonusPoints)} বোনাস পয়েন্ট
          </span>
        </div>
      )}

      {/* 6. Unlocked Badges (compact single row if any) */}
      {unlockedBadges.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
          <span className="text-[11px] text-slate-300 font-bold mr-1 flex items-center gap-1">
            <Award className="w-3 h-3 text-amber-400" /> ট্রফি:
          </span>
          {unlockedBadges.slice(0, 3).map((badge) => (
            <span
              key={badge.id}
              className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-200 text-[10px] font-bold border border-amber-500/40"
            >
              {badge.title}
            </span>
          ))}
        </div>
      )}

      {/* 7. Footer (Verification Seal) */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
        <div>
          <span className="font-extrabold text-emerald-400 block text-xs leading-none">
            jajabor.mdrasel.site
          </span>
          <span className="text-[10px] text-slate-400 leading-tight">
            যাযাবর মিটার ২০২৬ | সনদ নং: JJB-{toBn(totalScore)}-{toBn(selectedCount)}
          </span>
        </div>
        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
