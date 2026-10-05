import React from "react";
import { UserProfile } from "@/types";
import { DISTRICTS } from "@/data/districts";
import { calculateRank, calculatePercentage } from "@/utils/scoreCalculator";
import UserAvatar from "@/components/auth/UserAvatar";
import { toBn } from "@/utils/bengaliDigits";
import { 
  Swords, 
  Trophy, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2
} from "lucide-react";

interface BattleResultCardProps {
  cardRef: React.RefObject<HTMLDivElement>;
  myProfile: UserProfile;
  myDistrictIds: string[];
  challengerName: string;
  challengerDistrictIds: string[];
}

export default function BattleResultCard({
  cardRef,
  myProfile,
  myDistrictIds,
  challengerName,
  challengerDistrictIds,
}: BattleResultCardProps) {
  const myCount = myDistrictIds.length;
  const myPercent = calculatePercentage(myCount);
  const myRank = calculateRank(myCount);

  const challengerCount = challengerDistrictIds.length;
  const challengerPercent = calculatePercentage(challengerCount);
  const challengerRank = calculateRank(challengerCount);

  const commonCount = DISTRICTS.filter(
    (d) => myDistrictIds.includes(d.id) && challengerDistrictIds.includes(d.id)
  ).length;

  const myOnlyCount = DISTRICTS.filter(
    (d) => myDistrictIds.includes(d.id) && !challengerDistrictIds.includes(d.id)
  ).length;

  const challengerOnlyCount = DISTRICTS.filter(
    (d) => challengerDistrictIds.includes(d.id) && !myDistrictIds.includes(d.id)
  ).length;

  let winner: "me" | "challenger" | "tie" = "tie";
  let winnerTitle = "সমানে সমান টক্কর!";
  let winnerSub = "দুই বন্ধুই সমান মাপের যাযাবর! কেউ কারো চেয়ে কম যায় না!";

  if (myCount > challengerCount) {
    winner = "me";
    winnerTitle = `অভিনন্দন ${myProfile.name}!`;
    winnerSub = `${toBn(myCount - challengerCount)}টি জেলায় এগিয়ে থেকে এই যুদ্ধে বিজয়ী হয়েছেন!`;
  } else if (challengerCount > myCount) {
    winner = "challenger";
    winnerTitle = `অভিনন্দন ${challengerName}!`;
    winnerSub = `${toBn(challengerCount - myCount)}টি জেলায় এগিয়ে থেকে এই যুদ্ধে বিজয়ী হয়েছেন!`;
  }

  const todayDate = new Date().toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      ref={cardRef}
      data-battle-card="true"
      style={{
        fontFamily: "var(--font-noto-bengali), 'Noto Sans Bengali', 'Hind Siliguri', 'Nirmala UI', 'Kohinoor Bangla', system-ui, -apple-system, sans-serif",
      }}
      className="w-full max-w-[560px] mx-auto bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white rounded-3xl p-4 sm:p-6 border-2 border-amber-500/70 shadow-2xl relative select-none box-border"
    >
      {/* Decorative Corner Ambient Glows */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header */}
      <div className="flex items-center justify-between pb-3.5 mb-3.5 sm:pb-4 sm:mb-4 border-b border-amber-500/30 relative z-10 gap-2">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Swords className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-amber-400 font-extrabold leading-normal mb-0.5 whitespace-nowrap block">
              ১v১ বন্ধু ভ্রমণ যুদ্ধ সনদ
            </span>
            <h3 className="text-sm sm:text-base font-black text-white leading-normal whitespace-nowrap">
              যাযাবর মিটার ২০২৬
            </h3>
          </div>
        </div>

        {/* Clean, Premium Themed Date Badge */}
        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-amber-300 font-bold bg-amber-500/15 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-amber-500/35 shrink-0 whitespace-nowrap shadow-sm shadow-amber-950/40 leading-normal">
          <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{todayDate}</span>
        </div>
      </div>

      {/* 2. Duel Scoreboard (VS Arena) */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-3.5 sm:p-5 mb-3.5 sm:mb-4 relative z-10">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Player 1: Me */}
          <div className="flex-1 flex flex-col items-center text-center min-w-0">
            <div className="relative mb-2">
              <UserAvatar
                avatarUrl={myProfile.avatarUrl}
                name={myProfile.name}
                size={56}
                className={winner === "me" ? "ring-2 ring-emerald-400" : "ring-1 ring-slate-700"}
              />
              {winner === "me" && (
                <div className="absolute -top-1 -right-1 p-1 rounded-full bg-emerald-500 text-slate-950 shadow-md">
                  <Trophy className="w-3 h-3" />
                </div>
              )}
            </div>

            <div className="text-xs sm:text-sm font-black text-white text-center leading-normal block mb-1 break-words w-full px-1">
              {myProfile.name}
            </div>
            <div className="text-[10px] sm:text-xs text-emerald-400 font-bold leading-normal text-center block mb-2 sm:mb-2.5 px-1">
              {myRank.title}
            </div>

            <div className="w-full py-2 sm:py-2.5 px-2 bg-slate-950/80 rounded-xl border border-slate-800 text-center block">
              <span className="text-xl sm:text-2xl font-black text-emerald-400 block leading-tight">
                {toBn(myCount)}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 block font-medium leading-normal mt-1 whitespace-nowrap">
                জেলা ({toBn(myPercent)}%)
              </span>
            </div>
          </div>

          {/* Center Column: VS Badge */}
          <div className="w-10 sm:w-14 shrink-0 flex flex-col items-center justify-center">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 border-2 border-slate-900 flex items-center justify-center shadow-lg shadow-amber-950/60">
              <span className="text-[10px] sm:text-xs font-black text-slate-950 tracking-wider">VS</span>
            </div>
          </div>

          {/* Player 2: Challenger */}
          <div className="flex-1 flex flex-col items-center text-center min-w-0">
            <div className="relative mb-2">
              <UserAvatar
                avatarUrl={null}
                name={challengerName}
                size={56}
                className={winner === "challenger" ? "ring-2 ring-amber-400" : "ring-1 ring-slate-700"}
              />
              {winner === "challenger" && (
                <div className="absolute -top-1 -right-1 p-1 rounded-full bg-amber-500 text-slate-950 shadow-md">
                  <Trophy className="w-3 h-3" />
                </div>
              )}
            </div>

            <div className="text-xs sm:text-sm font-black text-white text-center leading-normal block mb-1 break-words w-full px-1">
              {challengerName}
            </div>
            <div className="text-[10px] sm:text-xs text-amber-400 font-bold leading-normal text-center block mb-2 sm:mb-2.5 px-1">
              {challengerRank.title}
            </div>

            <div className="w-full py-2 sm:py-2.5 px-2 bg-slate-950/80 rounded-xl border border-slate-800 text-center block">
              <span className="text-xl sm:text-2xl font-black text-amber-400 block leading-tight">
                {toBn(challengerCount)}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 block font-medium leading-normal mt-1 whitespace-nowrap">
                জেলা ({toBn(challengerPercent)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Winner Callout Banner */}
      <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-500/15 border border-amber-500/40 text-center mb-3.5 sm:mb-4 relative z-10">
        <div className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-black text-amber-300 leading-normal mb-1">
          <Trophy className="w-4 h-4 text-amber-400 shrink-0 inline-block mr-1" />
          <span>{winnerTitle}</span>
        </div>
        <div className="text-[11px] sm:text-xs text-slate-200 leading-normal font-medium block">
          {winnerSub}
        </div>
      </div>

      {/* 4. Battle Stats Highlights */}
      <div className="space-y-2.5 sm:space-y-3 mb-3.5 sm:mb-4 relative z-10">
        {/* Row 1: Common Districts */}
        <div className="px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-300 flex items-center gap-1.5 sm:gap-2 font-medium text-[11px] sm:text-xs leading-normal">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0 inline-block" />
            উভয়ের কমন জেলাসমূহ:
          </span>
          <span className="font-black text-emerald-300 whitespace-nowrap text-xs sm:text-sm leading-normal">
            {toBn(commonCount)}টি জেলা
          </span>
        </div>

        {/* Row 2: Exclusive Districts */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <div className="p-2.5 sm:p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center block min-w-0">
            <div className="text-[11px] sm:text-xs text-slate-300 font-medium leading-normal block mb-1 break-words">
              শুধু <span className="font-bold text-white">{myProfile.name}</span>
            </div>
            <div className="text-xs sm:text-sm font-black text-teal-300 block leading-normal">
              {toBn(myOnlyCount)}টি জেলা
            </div>
          </div>

          <div className="p-2.5 sm:p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center block min-w-0">
            <div className="text-[11px] sm:text-xs text-slate-300 font-medium leading-normal block mb-1 break-words">
              শুধু <span className="font-bold text-white">{challengerName}</span>
            </div>
            <div className="text-xs sm:text-sm font-black text-amber-300 block leading-normal">
              {toBn(challengerOnlyCount)}টি জেলা
            </div>
          </div>
        </div>
      </div>

      {/* 5. Footer Watermark */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] sm:text-xs text-slate-400 relative z-10 leading-normal">
        <div className="flex items-center gap-1.5 font-semibold text-slate-300 whitespace-nowrap">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>যাযাবর মিটার অথেনটিক ১v১ ফলাফল সনদ</span>
        </div>
        <span className="font-bold text-amber-300 whitespace-nowrap">
          jajabor.mdrasel.site
        </span>
      </div>
    </div>
  );
}
