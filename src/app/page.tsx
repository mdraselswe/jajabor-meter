"use client";

import React, { useState } from "react";
import BangladeshMap from "@/components/map/BangladeshMap";
import { District, DISTRICTS } from "@/data/districts";
import { useJajaborStore } from "@/hooks/useJajaborStore";
import { useSpeedDetector } from "@/hooks/useSpeedDetector";
import { useAuth } from "@/hooks/useAuth";
import { calculateRank, calculatePercentage } from "@/utils/scoreCalculator";
import { getUnlockedBadges } from "@/utils/badgeCalculator";
import { toBn } from "@/utils/bengaliDigits";
import { PHAPOR_QUIZZES } from "@/data/phaporQuizzes";
import confetti from "canvas-confetti";

import UserAvatar from "@/components/auth/UserAvatar";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import GuestProfileModal from "@/components/share/GuestProfileModal";
import ShareModal from "@/components/share/ShareModal";
import SpeedAlertModal from "@/components/quiz/SpeedAlertModal";
import PhaporDetectorModal from "@/components/quiz/PhaporDetectorModal";
import MemoryChecklist from "@/components/scorecard/MemoryChecklist";

import { 
  Gauge, 
  Sparkles, 
  CheckCircle2, 
  Award,
  Coffee,
  Fish,
  Mountain,
  Sun,
  Cake,
  Waves,
  Share2,
  Smile,
  Swords
} from "lucide-react";
import Link from "next/link";

// Lucide icon resolver for special badges
const BADGE_ICONS: Record<string, React.ElementType> = {
  Fish,
  Coffee,
  Mountain,
  Sun,
  Cake,
  Waves,
};

export default function Home() {
  const {
    isLoaded,
    selectedDistrictIds,
    selectedMemoryIds,
    userProfile,
    toggleDistrict,
    addDistrict,
    removeDistrict,
    resetAllDistricts,
    toggleMemory,
    updateProfile,
  } = useJajaborStore();

  const { isSpeedAlertOpen, registerClick, closeSpeedAlert } = useSpeedDetector();
  const { loginWithGoogle, logout, isLoading: isAuthLoading } = useAuth(
    updateProfile,
    () => setIsProfileModalOpen(true)
  );

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeQuizDistrict, setActiveQuizDistrict] = useState<District | null>(null);

  // Score & Ranking
  const selectedCount = selectedDistrictIds.length;
  const memoryCount = selectedMemoryIds.length;
  const bonusPoints = memoryCount * 5;
  const totalFunScore = selectedCount * 10 + bonusPoints;

  const percentage = calculatePercentage(selectedCount);
  const currentRank = calculateRank(selectedCount);
  const unlockedBadges = getUnlockedBadges(selectedDistrictIds);

  const fireConfetti = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (e) {
      // safe fallback
    }
  };

  const handleDistrictClick = (district: District) => {
    // Check speed spam detector
    const isSpamming = registerClick();
    if (isSpamming) return;

    // If already selected, allow instant deselect
    if (selectedDistrictIds.includes(district.id)) {
      removeDistrict(district.id);
      return;
    }

    // Check if district has a Phapor lie-detector quiz
    if (PHAPOR_QUIZZES[district.id]) {
      setActiveQuizDistrict(district);
      return;
    }

    // Normal direct select
    addDistrict(district.id);
    if ((selectedCount + 1) % 10 === 0 || selectedCount + 1 === 64) {
      fireConfetti();
    }
  };

  const handleQuizSuccess = () => {
    if (activeQuizDistrict) {
      addDistrict(activeQuizDistrict.id);
      fireConfetti();
    }
    setActiveQuizDistrict(null);
  };

  const handleQuizFail = () => {
    setActiveQuizDistrict(null);
  };

  const handleOpenShare = () => {
    fireConfetti();
    setIsShareModalOpen(true);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Header with Profile and Auth Bar */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-slate-900/80 p-4 sm:p-5 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <UserAvatar
            avatarUrl={userProfile.avatarUrl}
            name={userProfile.name}
            size={56}
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white leading-tight">
                {userProfile.name}
              </h2>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30">
                {userProfile.isLoggedIn ? "যাচাইকৃত পর্যটক" : "গেস্ট যাযাবর"}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5 font-medium">
              পদবী: <span className="text-emerald-400 font-bold">{currentRank.title}</span>
            </p>
          </div>
        </div>

        <GoogleAuthButton
          isLoggedIn={userProfile.isLoggedIn}
          isLoading={isAuthLoading}
          onLogin={loginWithGoogle}
          onLogout={logout}
          onOpenGuestProfile={() => setIsProfileModalOpen(true)}
        />
      </section>

      {/* Hero Tagline */}
      <section className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>৬৪ জেলার ভ্রমণ পরীক্ষা ও ফাঁপর ডিটেক্টর</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-2">
          বাংলাদেশের কোন কোন জেলায় <span className="text-emerald-400 underline decoration-amber-400 decoration-wavy">গেছেন?</span>
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
          ম্যাপে ক্লিক করে জেলা সিলেক্ট করুন অথবা জেলা তালিকা ব্যবহার করুন। ফাঁপর ডিটেক্টরে সত্যি উত্তর দিন এবং নিজের সনদপত্র ডাউনলোড করুন!
        </p>
      </section>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive 64-District Map */}
        <div className="lg:col-span-8 w-full">
          <BangladeshMap
            selectedDistrictIds={selectedDistrictIds}
            onToggleDistrict={handleDistrictClick}
            onResetDistricts={resetAllDistricts}
          />
        </div>

        {/* Right Column: Scorecard, Badges & Relatable Memories */}
        <div className="lg:col-span-4 w-full flex flex-col gap-5">
          {/* Main Meter Card */}
          <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-800">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Gauge className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-white text-base sm:text-lg">যাযাবর মিটার</h3>
                <p className="text-xs text-slate-300 font-medium">লাইভ ভ্রমণ স্কোরবোর্ড</p>
              </div>
            </div>

            {/* Score circle */}
            <div className="flex flex-col items-center justify-center py-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 mb-5">
              <span className="text-5xl font-black text-amber-400 tracking-tight">
                {toBn(selectedCount)}
              </span>
              <span className="text-xs text-slate-300 font-semibold mt-1">
                ৬৪ জেলার মধ্যে ({toBn(percentage)}% বাংলাদেশ)
              </span>

              {/* Bonus points indicator */}
              {bonusPoints > 0 && (
                <div className="mt-2 text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                  +{toBn(bonusPoints)} কাণ্ডকারখানা বোনাস পয়েন্ট
                </div>
              )}
            </div>

            {/* Title & Roast badge */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2 mb-5">
              <div className="text-xs text-slate-300 font-bold">বর্তমান পদবী:</div>
              <div className="text-base sm:text-lg font-black text-emerald-300">
                {currentRank.title}
              </div>
              <p className="text-xs sm:text-sm text-slate-100 italic bg-slate-900/90 p-3 rounded-xl border border-slate-800 leading-relaxed font-medium">
                &quot;{currentRank.roast}&quot;
              </p>
            </div>

            {/* Big Share & Certificate Trigger Button */}
            <div className="flex flex-col gap-2.5 mb-5">
              <button
                onClick={handleOpenShare}
                className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-950/50 transition-all duration-150 active:scale-95"
              >
                <Share2 className="w-5 h-5" />
                <span>সনদপত্র তৈরি ও ডাউনলোড</span>
              </button>

              <Link
                href="/compare"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-bold text-xs sm:text-sm transition active:scale-95"
              >
                <Swords className="w-4 h-4" />
                <span>বন্ধুকে ১v১ চ্যালেঞ্জ ছুড়ে দিন</span>
              </Link>
            </div>

            {/* Special Badges Section */}
            {unlockedBadges.length > 0 && (
              <div className="mb-5 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-3">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>আনলক হওয়া বিশেষ ট্রফি ({toBn(unlockedBadges.length)}):</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {unlockedBadges.map((badge) => {
                    const IconComp = BADGE_ICONS[badge.iconName] || Award;
                    return (
                      <div
                        key={badge.id}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-200 text-xs"
                      >
                        <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="font-bold text-white block">
                            {badge.title}
                          </strong>
                          <span className="text-[11px] text-slate-300 leading-tight block">
                            {badge.description}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick selected preview chips */}
            {selectedCount > 0 && (
              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                  <span className="flex items-center gap-1 font-bold text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ঘুরে আসা জেলাসমূহ:
                  </span>
                  <span className="font-bold text-emerald-300">{toBn(selectedCount)}টি</span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {selectedDistrictIds.map((id) => {
                    const d = DISTRICTS.find((item) => item.id === id);
                    if (!d) return null;
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-700/60 text-emerald-200 text-xs font-semibold"
                      >
                        {d.nameBn}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Relatable Tour Memories Checklist */}
          <MemoryChecklist
            selectedMemoryIds={selectedMemoryIds}
            onToggleMemory={toggleMemory}
          />
        </div>
      </div>

      {/* Guest Profile Modal */}
      <GuestProfileModal
        isOpen={isProfileModalOpen}
        userProfile={userProfile}
        onSave={updateProfile}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Share & Certificate Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        userProfile={userProfile}
        selectedDistrictIds={selectedDistrictIds}
        selectedMemoryIds={selectedMemoryIds}
        rank={currentRank}
        percentage={percentage}
        unlockedBadges={unlockedBadges}
        onOpenEditProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Anti-Cheat Speed Alert Modal */}
      <SpeedAlertModal
        isOpen={isSpeedAlertOpen}
        onClose={closeSpeedAlert}
      />

      {/* Lie-Detector Phapor Modal */}
      {activeQuizDistrict && (
        <PhaporDetectorModal
          isOpen={!!activeQuizDistrict}
          quiz={PHAPOR_QUIZZES[activeQuizDistrict.id] || null}
          districtNameBn={activeQuizDistrict.nameBn}
          onSuccess={handleQuizSuccess}
          onFail={handleQuizFail}
        />
      )}
    </main>
  );
}
