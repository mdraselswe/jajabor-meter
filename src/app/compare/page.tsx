"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useJajaborStore } from "@/hooks/useJajaborStore";
import { decodeCompareData, encodeCompareData } from "@/utils/urlEncoder";
import { calculateRank, calculatePercentage } from "@/utils/scoreCalculator";
import { DISTRICTS } from "@/data/districts";
import { toBn } from "@/utils/bengaliDigits";
import CompareSkeleton from "@/components/skeletons/CompareSkeleton";
import UserAvatar from "@/components/auth/UserAvatar";
import { 
  Swords, 
  Trophy, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Users,
  Compass,
  Copy,
  Check,
  Share2
} from "lucide-react";

function CompareContent() {
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();
  const [copyDone, setCopyDone] = useState(false);

  const { selectedDistrictIds: myDistrictIds, userProfile: myProfile } = useJajaborStore();

  // Decode friend's data from URL
  const friendData = useMemo(() => {
    return decodeCompareData(searchString);
  }, [searchString]);

  const hasFriendData = friendData.districtIds.length > 0;

  // If no friend data in URL, provide a fun default sample challenger so it never stays boring 0
  const activeFriendData = useMemo(() => {
    if (hasFriendData) return friendData;
    return {
      name: "চ্যালেঞ্জার যাযাবর",
      districtIds: ["dhaka", "chattogram", "sylhet", "coxs-bazar", "bogra", "rajshahi", "bandarban"],
    };
  }, [hasFriendData, friendData]);

  const friendCount = activeFriendData.districtIds.length;
  const myCount = myDistrictIds.length;

  const friendRank = calculateRank(friendCount);
  const myRank = calculateRank(myCount);

  const friendPercent = calculatePercentage(friendCount);
  const myPercent = calculatePercentage(myCount);

  // Common districts
  const commonDistricts = useMemo(() => {
    return DISTRICTS.filter(
      (d) => myDistrictIds.includes(d.id) && activeFriendData.districtIds.includes(d.id)
    );
  }, [myDistrictIds, activeFriendData.districtIds]);

  // Friend's exclusive
  const friendOnlyDistricts = useMemo(() => {
    return DISTRICTS.filter(
      (d) => activeFriendData.districtIds.includes(d.id) && !myDistrictIds.includes(d.id)
    );
  }, [myDistrictIds, activeFriendData.districtIds]);

  // My exclusive
  const myOnlyDistricts = useMemo(() => {
    return DISTRICTS.filter(
      (d) => myDistrictIds.includes(d.id) && !activeFriendData.districtIds.includes(d.id)
    );
  }, [myDistrictIds, activeFriendData.districtIds]);

  // Battle winner determination
  let battleStatus = "টাই হয়েছে! দুই বন্ধুই সমান সমান যাযাবর!";
  let winner = "tie";

  if (myCount > friendCount) {
    battleStatus = `অভিনন্দন ${myProfile.name}! আপনি ${toBn(myCount - friendCount)}টি জেলায় এগিয়ে আছেন!`;
    winner = "me";
  } else if (friendCount > myCount) {
    battleStatus = `${activeFriendData.name} এগিয়ে আছেন! আপনার আরও ঘোরাঘুরি দরকার!`;
    winner = "friend";
  }

  // Handle copying battle link to challenge a friend
  const handleCopyChallengeLink = async () => {
    const query = encodeCompareData(myProfile.name, myDistrictIds);
    const link = `http://jajabor.mdrasel.site/compare?${query}`;
    const text = `যাযাবর মিটার যুদ্ধ চ্যালেঞ্জ!\nআমি (${myProfile.name}) ${toBn(myCount)}টি জেলায় ভ্রমণ করেছি। দম থাকলে আমাকে টেক্কা দিয়ে দেখাও:\n👉 ${link}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 3000);
    } catch (e) {
      alert("লিংক কপি করতে সমস্যা হয়েছে।");
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* If opened without a friend's link, show helpful explainer card */}
      {!hasFriendData && (
        <div className="mb-8 p-5 bg-gradient-to-r from-amber-950/50 via-slate-900 to-emerald-950/50 border border-amber-500/40 rounded-3xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>বন্ধুকে ১v১ চ্যালেঞ্জ পাঠানোর নিয়ম</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white mb-2">
            বন্ধুর স্কোর এখনো পাননি? আপনার চ্যালেঞ্জ লিংক তৈরি করে বন্ধুকে পাঠান!
          </h2>
          <p className="text-xs text-slate-300 max-w-xl mx-auto mb-4">
            নিচের বাটনে চাপ দিয়ে আপনার বর্তমান ভ্রমণ স্কোর ({toBn(myCount)} জেলা) সহ চ্যালেঞ্জ লিংক কপি করুন এবং বন্ধুকে হোয়াটসঅ্যাপ বা মেসেঞ্জারে পাঠিয়ে দিন। বন্ধু লিংকে ক্লিক করলে তার সাথে আপনার লাইভ তুলনা দেখা যাবে!
          </p>
          <button
            onClick={handleCopyChallengeLink}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-950/40 transition active:scale-95"
          >
            {copyDone ? (
              <>
                <Check className="w-4 h-4" />
                <span>চ্যালেঞ্জ লিংক কপি হয়েছে! বন্ধুকে পাঠিয়ে দিন!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>আমার চ্যালেঞ্জ লিংক কপি করুন ({toBn(myCount)} জেলা সহ)</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Battle Hero Header */}
      <section className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-3">
          <Swords className="w-3.5 h-3.5 text-amber-400" />
          <span>১ বনাম ১ বন্ধু ভ্রমণ যুদ্ধ</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
          {myProfile.name} <span className="text-amber-400">VS</span> {activeFriendData.name}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          দেখুন কার ঘোরাঘুরি কতটুকু এবং কে আসল যাযাবর!
        </p>

        {/* Winner Banner */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 border border-amber-500/50 text-amber-300 text-xs sm:text-sm font-extrabold shadow-lg">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>{battleStatus}</span>
        </div>
      </section>

      {/* Dual Player Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Player 1: Me */}
        <div
          className={`p-6 rounded-3xl border flex flex-col items-center text-center relative overflow-hidden backdrop-blur-xl transition-all ${
            winner === "me"
              ? "bg-emerald-950/40 border-emerald-500/80 shadow-xl shadow-emerald-950/50"
              : "bg-slate-900/80 border-slate-800"
          }`}
        >
          {winner === "me" && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 text-xs font-black inline-flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-emerald-400" />
              <span>এগিয়ে আছেন</span>
            </div>
          )}

          <UserAvatar
            avatarUrl={myProfile.avatarUrl}
            name={myProfile.name}
            size={76}
            className="mb-3 ring-4 ring-slate-800"
          />

          <h3 className="text-lg font-black text-white mb-1">{myProfile.name}</h3>
          <span className="text-xs text-emerald-400 font-bold mb-4">
            {myRank.title}
          </span>

          <div className="w-full py-4 bg-slate-950/70 rounded-2xl border border-slate-800 mb-4">
            <div className="text-4xl font-black text-emerald-400">
              {toBn(myCount)}
            </div>
            <span className="text-xs text-slate-300 font-medium">
              ৬৪ জেলা ({toBn(myPercent)}% বাংলাদেশ)
            </span>
          </div>

          <p className="text-xs text-slate-200 italic bg-slate-900/80 p-3 rounded-xl border border-slate-800 w-full leading-relaxed">
            &quot;{myRank.roast}&quot;
          </p>
        </div>

        {/* Player 2: Friend */}
        <div
          className={`p-6 rounded-3xl border flex flex-col items-center text-center relative overflow-hidden backdrop-blur-xl transition-all ${
            winner === "friend"
              ? "bg-amber-950/40 border-amber-500/80 shadow-xl shadow-amber-950/50"
              : "bg-slate-900/80 border-slate-800"
          }`}
        >
          {winner === "friend" && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50 text-xs font-black inline-flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>এগিয়ে আছেন</span>
            </div>
          )}

          <UserAvatar
            avatarUrl={null}
            name={activeFriendData.name}
            size={76}
            className="mb-3 ring-4 ring-slate-800"
          />

          <h3 className="text-lg font-black text-white mb-1">{activeFriendData.name}</h3>
          <span className="text-xs text-amber-300 font-bold mb-4">
            {friendRank.title}
          </span>

          <div className="w-full py-4 bg-slate-950/70 rounded-2xl border border-slate-800 mb-4">
            <div className="text-4xl font-black text-amber-400">
              {toBn(friendCount)}
            </div>
            <span className="text-xs text-slate-300 font-medium">
              ৬৪ জেলা ({toBn(friendPercent)}% বাংলাদেশ)
            </span>
          </div>

          <p className="text-xs text-slate-200 italic bg-slate-900/80 p-3 rounded-xl border border-slate-800 w-full leading-relaxed">
            &quot;{friendRank.roast}&quot;
          </p>
        </div>
      </div>

      {/* Comparison Analysis */}
      <div className="space-y-4 mb-8">
        {/* Common Districts */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-3xl">
          <div className="flex items-center gap-2 mb-2 text-sm font-extrabold text-white">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>দুইজনেই ঘুরেছেন ({toBn(commonDistricts.length)}টি জেলা):</span>
          </div>
          {commonDistricts.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {commonDistricts.map((d) => (
                <span
                  key={d.id}
                  className="px-3 py-1 rounded-xl bg-emerald-950/50 border border-emerald-700/60 text-emerald-200 text-xs font-bold"
                >
                  {d.nameBn}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              দুইজনের কোনো কমন জেলা এখনো মেলেনি!
            </p>
          )}
        </div>

        {/* My Exclusive */}
        {myOnlyDistricts.length > 0 && (
          <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-3xl">
            <div className="flex items-center gap-2 mb-2 text-sm font-extrabold text-emerald-300">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>শুধু {myProfile.name} ঘুরেছেন ({toBn(myOnlyDistricts.length)}টি জেলা):</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {myOnlyDistricts.map((d) => (
                <span
                  key={d.id}
                  className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold"
                >
                  {d.nameBn}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Friend's Exclusive */}
        {friendOnlyDistricts.length > 0 && (
          <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-3xl">
            <div className="flex items-center gap-2 mb-2 text-sm font-extrabold text-amber-300">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>শুধু {activeFriendData.name} ঘুরেছেন ({toBn(friendOnlyDistricts.length)}টি জেলা):</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {friendOnlyDistricts.map((d) => (
                <span
                  key={d.id}
                  className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold"
                >
                  {d.nameBn}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
        <button
          onClick={handleCopyChallengeLink}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-950/40 transition active:scale-95"
        >
          <Share2 className="w-4 h-4 text-slate-950" />
          <span>বন্ধুকে চ্যালেঞ্জ লিংক পাঠান</span>
        </button>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 transition active:scale-95"
        >
          <Compass className="w-4 h-4" />
          <span>আমার ম্যাপ এডিট করুন</span>
        </Link>
      </div>
    </main>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<CompareSkeleton />}>
      <CompareContent />
    </Suspense>
  );
}
