"use client";

import React, { Suspense, useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useJajaborStore } from "@/hooks/useJajaborStore";
import { decodeCompareData, encodeCompareData, getBaseUrl } from "@/utils/urlEncoder";
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
  Sparkles, 
  Compass, 
  Copy, 
  Check, 
  Share2,
  RotateCcw,
  MessageCircle,
  Send,
  ArrowRight,
  Flame,
  Link2
} from "lucide-react";

interface ChallengerData {
  name: string;
  districtIds: string[];
}

const STORAGE_CHALLENGER_KEY = "jajabor_active_challenger_v1";

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedDistrictIds: myDistrictIds, userProfile: myProfile, isLoaded } = useJajaborStore();

  const [activeChallenger, setActiveChallenger] = useState<ChallengerData | null>(null);
  const [pasteLinkInput, setPasteLinkInput] = useState("");
  const [copyDone, setCopyDone] = useState(false);
  const [pasteError, setPasteError] = useState("");

  // 1. Resolve challenger from URL parameters or persistent storage
  useEffect(() => {
    const hasParamN = searchParams.has("n");
    const hasParamD = searchParams.has("d");

    if (hasParamN || hasParamD) {
      let paramName = searchParams.get("n") || "বন্ধু যাযাবর";
      try {
        if (paramName.includes("%")) {
          paramName = decodeURIComponent(paramName);
        }
      } catch (e) {}

      const rawD = searchParams.get("d") || "";
      const districtIds = rawD
        ? rawD
            .split(",")
            .map((id) => id.trim().toLowerCase().replace(/[^a-z0-9_-]/g, ""))
            .filter(Boolean)
        : [];

      const challengerData: ChallengerData = {
        name: paramName.trim() || "বন্ধু যাযাবর",
        districtIds,
      };

      setActiveChallenger(challengerData);
      try {
        localStorage.setItem(STORAGE_CHALLENGER_KEY, JSON.stringify(challengerData));
      } catch (e) {
        // ignore storage errors
      }
    } else {
      // If no parameters in URL, check if there is an active challenger saved in localStorage
      try {
        const saved = localStorage.getItem(STORAGE_CHALLENGER_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed.name === "string" && Array.isArray(parsed.districtIds)) {
            setActiveChallenger(parsed);
          }
        }
      } catch (e) {
        // ignore
      }
    }
  }, [searchParams]);

  const hasChallenger = Boolean(activeChallenger);

  const myCount = myDistrictIds.length;
  const myPercent = calculatePercentage(myCount);
  const myRank = calculateRank(myCount);

  const challengerCount = activeChallenger?.districtIds.length || 0;
  const challengerPercent = calculatePercentage(challengerCount);
  const challengerRank = calculateRank(challengerCount);

  // Common districts
  const commonDistricts = useMemo(() => {
    if (!activeChallenger) return [];
    return DISTRICTS.filter(
      (d) => myDistrictIds.includes(d.id) && activeChallenger.districtIds.includes(d.id)
    );
  }, [myDistrictIds, activeChallenger]);

  // Friend's exclusive
  const challengerOnlyDistricts = useMemo(() => {
    if (!activeChallenger) return [];
    return DISTRICTS.filter(
      (d) => activeChallenger.districtIds.includes(d.id) && !myDistrictIds.includes(d.id)
    );
  }, [myDistrictIds, activeChallenger]);

  // My exclusive
  const myOnlyDistricts = useMemo(() => {
    if (!activeChallenger) return [];
    return DISTRICTS.filter(
      (d) => myDistrictIds.includes(d.id) && !activeChallenger.districtIds.includes(d.id)
    );
  }, [myDistrictIds, activeChallenger]);

  // Battle status message
  let battleStatus = "টাই হয়েছে! দুই বন্ধুই সমানে সমান যাযাবর!";
  let winner: "me" | "challenger" | "tie" = "tie";

  if (hasChallenger && activeChallenger) {
    if (myCount > challengerCount) {
      battleStatus = `অভিনন্দন ${myProfile.name}! আপনি ${toBn(myCount - challengerCount)}টি জেলায় এগিয়ে আছেন!`;
      winner = "me";
    } else if (challengerCount > myCount) {
      battleStatus = `${activeChallenger.name} ${toBn(challengerCount - myCount)}টি জেলায় এগিয়ে আছেন! আরও ঘোরাঘুরি দরকার!`;
      winner = "challenger";
    }
  }

  // Generate my shareable challenge URL
  const myChallengeUrl = useMemo(() => {
    const query = encodeCompareData(myProfile.name, myDistrictIds);
    return `${getBaseUrl()}/compare?${query}`;
  }, [myProfile.name, myDistrictIds]);

  const challengeShareText = useMemo(() => {
    return `যাযাবর মিটার ১v১ যুদ্ধ চ্যালেঞ্জ!\nআমি (${myProfile.name}) বাংলাদেশের ${toBn(myCount)}টি জেলায় ভ্রমণ করেছি (${myRank.title})।\nআমার সাথে টেক্কা দেওয়ার সাহস আছে? নিচের লিংকে ঢুকে তোমার যাযাবর মিটার মেপে দেখাও:\n👉 ${myChallengeUrl}\n\n#JajaborMeter #যাযাবরমিটার`;
  }, [myProfile.name, myCount, myRank.title, myChallengeUrl]);

  const handleCopyMyChallenge = async () => {
    try {
      await navigator.clipboard.writeText(challengeShareText);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 3000);
    } catch (e) {
      alert("লিংক কপি করতে সমস্যা হয়েছে।");
    }
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(challengeShareText);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  };

  const handleFacebookShare = () => {
    handleCopyMyChallenge();
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(myChallengeUrl)}&quote=${encodeURIComponent(challengeShareText)}`,
      "_blank"
    );
  };

  const handleTelegramShare = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(myChallengeUrl)}&text=${encodeURIComponent(challengeShareText)}`,
      "_blank"
    );
  };

  // Handle manual paste of a friend's link or code
  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasteError("");
    const input = pasteLinkInput.trim();
    if (!input) return;

    const parsed = decodeCompareData(input);
    if (!parsed || parsed.districtIds.length === 0) {
      setPasteError("সঠিক চ্যালেঞ্জ লিংক পাওয়া যায়নি। লিংকে অবশ্যই ?n=... এবং &d=... থাকতে হবে।");
      return;
    }

    const challengerData: ChallengerData = {
      name: parsed.name || "বন্ধু যাযাবর",
      districtIds: parsed.districtIds,
    };
    setActiveChallenger(challengerData);
    try {
      localStorage.setItem(STORAGE_CHALLENGER_KEY, JSON.stringify(challengerData));
    } catch (err) {
      // ignore
    }
    setPasteLinkInput("");
    router.replace(`/compare?${encodeCompareData(challengerData.name, challengerData.districtIds)}`);
  };

  const handleResetChallenger = () => {
    try {
      localStorage.removeItem(STORAGE_CHALLENGER_KEY);
    } catch (e) {
      // ignore
    }
    setActiveChallenger(null);
    router.replace("/compare");
  };

  if (!isLoaded) {
    return <CompareSkeleton />;
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* ───────────────────────────────────────────────────────── */}
      {/* CASE 1: ACTIVE CHALLENGER BATTLE ARENA (When challenger exists) */}
      {/* ───────────────────────────────────────────────────────── */}
      {hasChallenger && activeChallenger && (
        <div>
          {/* Battle Hero Header */}
          <section className="text-center max-w-2xl mx-auto mb-8 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-3">
              <Swords className="w-3.5 h-3.5 text-amber-400" />
              <span>১ বনাম ১ বন্ধু ভ্রমণ যুদ্ধ</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
              {myProfile.name} <span className="text-amber-400 font-black">VS</span> {activeChallenger.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              কার যাযাবর মিটার কতটুকু আর কে আন্তর্জাতিক ফাঁপরবাজ? নিচে লাইভ তুলনা দেখুন!
            </p>

            {/* Winner Banner */}
            <div className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 border border-amber-500/60 text-amber-300 text-xs sm:text-sm font-extrabold shadow-xl">
              <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{battleStatus}</span>
            </div>
          </section>

          {/* Dual Player Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Player 1: Me */}
            <div
              className={`p-6 rounded-3xl border flex flex-col items-center text-center relative overflow-hidden backdrop-blur-xl transition-all shadow-xl ${
                winner === "me"
                  ? "bg-emerald-950/40 border-emerald-500/80 shadow-emerald-950/40"
                  : "bg-slate-900/90 border-slate-800"
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

              <h3 className="text-lg font-black text-white mb-1 truncate max-w-[260px]">{myProfile.name}</h3>
              <span className="text-xs text-emerald-400 font-bold mb-4">
                পদবী: {myRank.title}
              </span>

              <div className="w-full py-4 bg-slate-950/70 rounded-2xl border border-slate-800 mb-4">
                <div className="text-4xl sm:text-5xl font-black text-emerald-400">
                  {toBn(myCount)}
                </div>
                <span className="text-xs text-slate-300 font-medium mt-1 block">
                  ৬৪ জেলা ({toBn(myPercent)}% বাংলাদেশ)
                </span>
              </div>

              <p className="text-xs text-slate-200 italic bg-slate-900/80 p-3 rounded-xl border border-slate-800 w-full leading-relaxed">
                &quot;{myRank.roast}&quot;
              </p>
            </div>

            {/* Player 2: Challenger */}
            <div
              className={`p-6 rounded-3xl border flex flex-col items-center text-center relative overflow-hidden backdrop-blur-xl transition-all shadow-xl ${
                winner === "challenger"
                  ? "bg-amber-950/40 border-amber-500/80 shadow-amber-950/40"
                  : "bg-slate-900/90 border-slate-800"
              }`}
            >
              {winner === "challenger" && (
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50 text-xs font-black inline-flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>এগিয়ে আছেন</span>
                </div>
              )}

              <UserAvatar
                avatarUrl={null}
                name={activeChallenger.name}
                size={76}
                className="mb-3 ring-4 ring-slate-800"
              />

              <h3 className="text-lg font-black text-white mb-1 truncate max-w-[260px]">{activeChallenger.name}</h3>
              <span className="text-xs text-amber-300 font-bold mb-4">
                পদবী: {challengerRank.title}
              </span>

              <div className="w-full py-4 bg-slate-950/70 rounded-2xl border border-slate-800 mb-4">
                <div className="text-4xl sm:text-5xl font-black text-amber-400">
                  {toBn(challengerCount)}
                </div>
                <span className="text-xs text-slate-300 font-medium mt-1 block">
                  ৬৪ জেলা ({toBn(challengerPercent)}% বাংলাদেশ)
                </span>
              </div>

              <p className="text-xs text-slate-200 italic bg-slate-900/80 p-3 rounded-xl border border-slate-800 w-full leading-relaxed">
                &quot;{challengerRank.roast}&quot;
              </p>
            </div>
          </div>

          {/* Comparison District Analysis */}
          <div className="space-y-4 mb-8">
            {/* Common Districts */}
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-3xl shadow-lg">
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
              <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-3xl shadow-lg">
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

            {/* Challenger's Exclusive */}
            {challengerOnlyDistricts.length > 0 && (
              <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-3xl shadow-lg">
                <div className="flex items-center gap-2 mb-2 text-sm font-extrabold text-amber-300">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>শুধু {activeChallenger.name} ঘুরেছেন ({toBn(challengerOnlyDistricts.length)}টি জেলা):</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {challengerOnlyDistricts.map((d) => (
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

          {/* Action Footer for Active Battle */}
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleCopyMyChallenge}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-950/40 transition active:scale-95 cursor-pointer"
              >
                {copyDone ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>পাল্টা চ্যালেঞ্জ লিংক কপি হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>আমার পাল্টা চ্যালেঞ্জ লিংক কপি ({toBn(myCount)} জেলা)</span>
                  </>
                )}
              </button>

              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 transition active:scale-95"
              >
                <Compass className="w-4 h-4" />
                <span>আমার ম্যাপে আরও জেলা যোগ করুন</span>
              </Link>

              <button
                onClick={handleResetChallenger}
                title="বর্তমান প্রতিপক্ষ রিসেট করুন"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 border border-slate-700 text-slate-300 font-semibold text-xs transition active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>নতুন যুদ্ধ / রিসেট</span>
              </button>
            </div>

            {/* Quick counter-challenge social share */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-slate-400 font-medium">পাল্টা চ্যালেঞ্জ পাঠান:</span>
              <button
                onClick={handleWhatsAppShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-200 text-xs font-bold transition cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={handleFacebookShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/80 hover:bg-blue-900 border border-blue-700/60 text-blue-200 text-xs font-bold transition cursor-pointer"
              >
                <span>Facebook</span>
              </button>
              <button
                onClick={handleTelegramShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-950/80 hover:bg-sky-900 border border-sky-700/60 text-sky-200 text-xs font-bold transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-sky-400" />
                <span>Telegram</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────── */}
      {/* CASE 2: CHALLENGE HUB (When NO challenger is loaded yet) */}
      {/* ───────────────────────────────────────────────────────── */}
      {!hasChallenger && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Hero Explainer Header */}
          <section className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-3">
              <Swords className="w-3.5 h-3.5" />
              <span>১ বনাম ১ বন্ধু ভ্রমণ যুদ্ধ হাব</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
              বন্ধুর সাথে টেক্কা দেওয়ার <span className="text-amber-400">সাহস আছে?</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              আপনার বর্তমান স্কোর নিয়ে বন্ধুকে সরাসরি ১v১ চ্যালেঞ্জ পাঠান অথবা বন্ধুর পাঠানো চ্যালেঞ্জ লিংক নিচে পেস্ট করে মুখোমুখি লড়াইয়ে নামুন!
            </p>

            {/* My Current Standings Ribbon */}
            <div className="mt-5 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 max-w-md mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserAvatar avatarUrl={myProfile.avatarUrl} name={myProfile.name} size={48} />
                <div className="text-left">
                  <strong className="text-sm text-white font-black block">{myProfile.name}</strong>
                  <span className="text-xs text-amber-300 font-medium">{myRank.title}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-400 leading-none block">{toBn(myCount)}</span>
                <span className="text-[11px] text-slate-400 font-semibold">/ ৬৪ জেলা ({toBn(myPercent)}%)</span>
              </div>
            </div>
          </section>

          {/* 2 Action Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card A: Create and Send Challenge Link */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/40 shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3">
                  <Share2 className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-white mb-2">
                  ১। বন্ধুকে চ্যালেঞ্জ লিংক পাঠান
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  আপনার বর্তমান ভ্রমণ স্কোর ({toBn(myCount)} জেলা) সহ চ্যালেঞ্জ লিংক তৈরি করে বন্ধুদের হোয়াটসঅ্যাপ, ফেসবুক বা টেলিগ্রামে পাঠিয়ে দিন। বন্ধু লিংকে ঢুকলে লাইভ ১v১ লড়াই দেখতে পাবে!
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800">
                <button
                  onClick={handleCopyMyChallenge}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-950/40 transition active:scale-95 cursor-pointer"
                >
                  {copyDone ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>চ্যালেঞ্জ লিংক কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>আমার চ্যালেঞ্জ লিংক কপি করুন</span>
                    </>
                  )}
                </button>

                {/* Social Sharing Shortcuts */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={handleWhatsAppShare}
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-200 text-xs font-bold transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={handleFacebookShare}
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-950/80 hover:bg-blue-900 border border-blue-700/60 text-blue-200 text-xs font-bold transition"
                  >
                    <span>Facebook</span>
                  </button>

                  <button
                    onClick={handleTelegramShare}
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-sky-950/80 hover:bg-sky-900 border border-sky-700/60 text-sky-200 text-xs font-bold transition"
                  >
                    <Send className="w-3.5 h-3.5 text-sky-400" />
                    <span>Telegram</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Card B: Paste Friend's Challenge Link */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-3">
                  <Link2 className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-white mb-2">
                  ২। বন্ধুর চ্যালেঞ্জ লিংক পেস্ট করুন
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  কোনো বন্ধু কি আপনাকে তার যাযাবর মিটার চ্যালেঞ্জ পাঠিয়েছে? সেই পুরো লিংকটি নিচের বক্সে পেস্ট করে যুদ্ধ শুরু করুন!
                </p>
              </div>

              <form onSubmit={handlePasteSubmit} className="space-y-3 pt-3 border-t border-slate-800">
                <input
                  type="text"
                  placeholder="বন্ধুর পাঠানো লিংক পেস্ট করুন (যেমন: https://.../compare?n=...)"
                  value={pasteLinkInput}
                  onChange={(e) => setPasteLinkInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />

                {pasteError && (
                  <p className="text-xs text-rose-400 font-medium">{pasteError}</p>
                )}

                <button
                  type="submit"
                  disabled={!pasteLinkInput.trim()}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm shadow-lg shadow-emerald-950/40 transition active:scale-95 cursor-pointer"
                >
                  <Swords className="w-4 h-4" />
                  <span>যুদ্ধ শুরু করুন</span>
                </button>
              </form>
            </div>
          </div>

          {/* Quick Map Link */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-300">
              এখনো নিজের কোনো জেলা চিহ্নিত করেননি? আগে ম্যাপে ঘুরে আসুন!
            </span>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-emerald-300 font-bold border border-slate-700 transition"
            >
              <Compass className="w-4 h-4" />
              <span>আমার ম্যাপে জেলা সিলেক্ট করুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
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
