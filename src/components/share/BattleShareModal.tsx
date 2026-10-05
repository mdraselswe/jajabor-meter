"use client";

import React, { useRef, useState } from "react";
import { UserProfile } from "@/types";
import BattleResultCard from "./BattleResultCard";
import { useShareCard } from "@/hooks/useShareCard";
import { encodeCompareData, getBaseUrl } from "@/utils/urlEncoder";
import { toBn } from "@/utils/bengaliDigits";
import { 
  Download, 
  Share2, 
  Copy, 
  Check, 
  X, 
  MessageCircle, 
  Send,
  Loader2,
  Trophy,
  Swords
} from "lucide-react";

interface BattleShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  myProfile: UserProfile;
  myDistrictIds: string[];
  challengerName: string;
  challengerDistrictIds: string[];
}

export default function BattleShareModal({
  isOpen,
  onClose,
  myProfile,
  myDistrictIds,
  challengerName,
  challengerDistrictIds,
}: BattleShareModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const {
    isExporting,
    copySuccess,
    downloadImage,
    copyShareText,
    shareNative,
  } = useShareCard();

  if (!isOpen) return null;

  const myCount = myDistrictIds.length;
  const challengerCount = challengerDistrictIds.length;
  const compareQuery = encodeCompareData(myProfile.name, myDistrictIds);
  const liveCompareLink = `${getBaseUrl()}/compare?${compareQuery}`;

  let winnerText = "🤝 সমানে সমান টক্কর! দুই বন্ধুই সমান মাপের যাযাবর!";
  if (myCount > challengerCount) {
    winnerText = `🏆 ${myProfile.name} ${toBn(myCount - challengerCount)}টি জেলায় এগিয়ে থেকে বিজয়ী হয়েছেন!`;
  } else if (challengerCount > myCount) {
    winnerText = `🏆 ${challengerName} ${toBn(challengerCount - myCount)}টি জেলায় এগিয়ে টেক্কা দিয়েছেন!`;
  }

  const shareText = `যাযাবর মিটার ১v১ ভ্রমণ যুদ্ধ ফলাফল!\n${myProfile.name} (${toBn(myCount)} জেলা) VS ${challengerName} (${toBn(challengerCount)} জেলা)!\n\n${winnerText}\n\nআমার সাথে টেক্কা দেওয়ার সাহস আছে? নিচের লিংকে ঢুকে তোমার যাযাবর মিটার মেপে দেখাও:\n👉 ${liveCompareLink}\n\n#JajaborMeter #যাযাবরমিটার #ভ্রমণযুদ্ধ`;

  const safeMyName = (myProfile.name || "jajabor").trim().replace(/[\s/\\?%*:|"<>]+/g, "-");
  const safeChallengerName = (challengerName || "friend").trim().replace(/[\s/\\?%*:|"<>]+/g, "-");
  const fileName = `${safeMyName}-vs-${safeChallengerName}-battle.png`;

  const handleDownload = async () => {
    if (isDownloading || isExporting) return;
    try {
      setIsDownloading(true);
      await downloadImage(cardRef.current, fileName);
    } catch (e) {
      console.error("Download caught error:", e);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleNativeShare = async () => {
    try {
      await shareNative(cardRef.current, shareText, "১v১ ভ্রমণ যুদ্ধ ফলাফল", `${safeMyName}-vs-${safeChallengerName}`);
    } catch (e) {
      console.error("Native share caught error:", e);
    }
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  };

  const handleFacebookShare = () => {
    copyShareText(shareText);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(liveCompareLink)}&quote=${encodeURIComponent(shareText)}`,
      "_blank"
    );
  };

  const handleTelegramShare = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(liveCompareLink)}&text=${encodeURIComponent(shareText)}`,
      "_blank"
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="min-h-full flex items-center justify-center py-6 sm:py-10">
        <div className="relative max-w-xl w-full bg-slate-900 border border-slate-700 rounded-3xl p-4 sm:p-6 shadow-2xl my-auto animate-in zoom-in-95 duration-200">
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <Swords className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-white text-base sm:text-lg">
                  ১v১ ভ্রমণ যুদ্ধের ফলাফল সনদ
                </h3>
                <p className="text-xs text-slate-300">
                  যুদ্ধের ফলাফল ইমেজ ডাউনলোড করুন এবং বন্ধুদের সোশ্যাল মিডিয়ায় শেয়ার করুন!
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Result Card Preview */}
          <div className="flex justify-center mb-5 overflow-x-auto max-w-full pb-1">
            <BattleResultCard
              cardRef={cardRef}
              myProfile={myProfile}
              myDistrictIds={myDistrictIds}
              challengerName={challengerName}
              challengerDistrictIds={challengerDistrictIds}
            />
          </div>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={isDownloading || isExporting}
              className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-sm transition shadow-lg ${
                isDownloading || isExporting
                  ? "bg-amber-800 text-slate-300 cursor-not-allowed opacity-80"
                  : "bg-amber-500 hover:bg-amber-400 text-slate-950 font-black active:scale-95 shadow-amber-950/40 cursor-pointer"
              }`}
            >
              {isDownloading || isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>ইমেজ তৈরি হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>এইচডি (HD) ফলাফল ইমেজ ডাউনলোড</span>
                </>
              )}
            </button>

            {/* Native Mobile Share Button */}
            <button
              onClick={handleNativeShare}
              disabled={isExporting || isDownloading}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm transition active:scale-95 shadow-lg shadow-emerald-950/40 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              <Share2 className="w-4 h-4" />
              <span>মোবাইলে সরাসরি শেয়ার</span>
            </button>
          </div>

          {/* Tip Note */}
          <div className="mb-3 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-300 text-center">
            ফেসবুক, হোয়াটসঅ্যাপ বা টেলিগ্রাম বাটনে চাপ দিলে সরাসরি ক্যাপশন ও লিঙ্ক সহ বন্ধুদের পাঠিয়ে দেওয়া যাবে।
          </div>

          {/* Social Sharing Shortcuts */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-slate-800">
            {/* Copy Caption & Link */}
            <button
              onClick={() => copyShareText(shareText)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold border border-slate-700 transition cursor-pointer"
            >
              {copySuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">ক্যাপশন কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>ক্যাপশন ও লিঙ্ক কপি</span>
                </>
              )}
            </button>

            {/* WhatsApp */}
            <button
              onClick={handleWhatsAppShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 text-xs font-bold border border-emerald-700/60 transition cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </button>

            {/* Facebook */}
            <button
              onClick={handleFacebookShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-950/80 hover:bg-blue-900 text-blue-200 text-xs font-bold border border-blue-700/60 transition cursor-pointer"
            >
              <span>Facebook</span>
            </button>

            {/* Telegram */}
            <button
              onClick={handleTelegramShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-950/80 hover:bg-sky-900 text-sky-200 text-xs font-bold border border-sky-700/60 transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-sky-400" />
              <span>Telegram</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
