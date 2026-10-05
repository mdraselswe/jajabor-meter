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
  Compass, 
  Sparkles,
  Flame,
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
  let winnerSub = "দুই বন্ধুই সমান মাপের পর্যটক! কেউ কারো চেয়ে কম যায় না!";

  if (myCount > challengerCount) {
    winner = "me";
    winnerTitle = `অভিনন্দন ${myProfile.name}!`;
    winnerSub = `${toBn(myCount - challengerCount)}টি জেলায় এগিয়ে থেকে এই যুদ্ধে বিজয়ী হয়েছেন!`;
  } else if (challengerCount > myCount) {
    winner = "challenger";
    winnerTitle = `${challengerName} বিজয়ী!`;
    winnerSub = `${toBn(challengerCount - myCount)}টি জেলায় এগিয়ে থেকে টেক্কা দিয়েছেন!`;
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
      className="w-full max-w-[460px] sm:max-w-[480px] bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/90 text-white rounded-3xl p-4 sm:p-5 border-2 border-amber-500/60 shadow-2xl relative select-none box-border overflow-hidden"
    >
      {/* Decorative Corner Ambient Glows */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* 1. Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-amber-500/30 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Swords className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-amber-400 font-extrabold block leading-none">
              ১v১ বন্ধু ভ্রমণ যুদ্ধ সনদ
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

      {/* 2. Duel Scoreboard (VS Arena) */}
      <div className="relative bg-slate-900/90 border border-slate-800/90 rounded-2xl p-3 sm:p-4 mb-3 relative z-10">
        {/* VS Badge in the center */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-red-600 border-2 border-slate-900 flex items-center justify-center shadow-lg shadow-amber-950/60">
            <span className="text-[11px] font-black text-slate-950 tracking-wider">VS</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 items-center">
          {/* Player 1: Me */}
          <div className="flex flex-col items-center text-center pr-2">
            <div className="relative mb-2">
              <UserAvatar
                avatarUrl={myProfile.avatarUrl}
                name={myProfile.name}
                size={54}
                className={winner === "me" ? "ring-2 ring-emerald-400" : "ring-1 ring-slate-700"}
              />
              {winner === "me" && (
                <div className="absolute -top-2 -right-1 p-1 rounded-full bg-emerald-500 text-slate-950 shadow">
                  <Trophy className="w-3 h-3" />
                </div>
              )}
            </div>

            <h4 className="text-xs sm:text-sm font-black text-white truncate max-w-[140px] leading-tight">
              {myProfile.name}
            </h4>
            <span className="text-[10px] text-emerald-400 font-bold block mt-0.5 truncate max-w-[130px]">
              {myRank.title}
            </span>

            <div className="mt-2 w-full py-1.5 px-2 bg-slate-950/70 rounded-xl border border-slate-800">
              <span className="text-xl sm:text-2xl font-black text-emerald-400 block leading-tight">
                {toBn(myCount)}
              </span>
              <span className="text-[10px] text-slate-400 block font-medium">
                জেলা ({toBn(myPercent)}%)
              </span>
            </div>
          </div>

          {/* Player 2: Challenger */}
          <div className="flex flex-col items-center text-center pl-2">
            <div className="relative mb-2">
              <UserAvatar
                avatarUrl={null}
                name={challengerName}
                size={54}
                className={winner === "challenger" ? "ring-2 ring-amber-400" : "ring-1 ring-slate-700"}
              />
              {winner === "challenger" && (
                <div className="absolute -top-2 -right-1 p-1 rounded-full bg-amber-500 text-slate-950 shadow">
                  <Trophy className="w-3 h-3" />
                </div>
              )}
            </div>

            <h4 className="text-xs sm:text-sm font-black text-white truncate max-w-[140px] leading-tight">
              {challengerName}
            </h4>
            <span className="text-[10px] text-amber-400 font-bold block mt-0.5 truncate max-w-[130px]">
              {challengerRank.title}
            </span>

            <div className="mt-2 w-full py-1.5 px-2 bg-slate-950/70 rounded-xl border border-slate-800">
              <span className="text-xl sm:text-2xl font-black text-amber-400 block leading-tight">
                {toBn(challengerCount)}
              </span>
              <span className="text-[10px] text-slate-400 block font-medium">
                জেলা ({toBn(challengerPercent)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Winner Callout Banner */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-500/15 border border-amber-500/40 text-center mb-3 relative z-10">
        <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-300">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>{winnerTitle}</span>
        </div>
        <p className="text-[11px] text-slate-200 mt-0.5 leading-tight font-medium">
          {winnerSub}
        </p>
      </div>

      {/* 4. Three Battle Stats Ribbon */}
      <div className="grid grid-cols-3 gap-2 mb-3 relative z-10">
        <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block font-medium">উভয়ের কমন</span>
          <strong className="text-xs sm:text-sm font-black text-emerald-400 mt-0.5 block">
            {toBn(commonCount)} জেলা
          </strong>
        </div>

        <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block font-medium truncate">শুধু {myProfile.name}</span>
          <strong className="text-xs sm:text-sm font-black text-teal-300 mt-0.5 block">
            {toBn(myOnlyCount)} জেলা
          </strong>
        </div>

        <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block font-medium truncate">শুধু {challengerName}</span>
          <strong className="text-xs sm:text-sm font-black text-amber-300 mt-0.5 block">
            {toBn(challengerOnlyCount)} জেলা
          </strong>
        </div>
      </div>

      {/* 5. Footer Watermark */}
      <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 relative z-10">
        <div className="flex items-center gap-1 font-semibold text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>যাযাবর মিটার অথেনটিক ১v১ ফলাফল</span>
        </div>
        <span className="font-bold text-amber-300">
          jajabor.mdrasel.site
        </span>
      </div>
    </div>
  );
}
