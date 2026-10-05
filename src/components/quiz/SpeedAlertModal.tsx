"use client";

import React from "react";
import { Rocket, AlertTriangle, ShieldCheck } from "lucide-react";

interface SpeedAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SpeedAlertModal({
  isOpen,
  onClose,
}: SpeedAlertModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-w-sm w-full bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-center animate-in zoom-in-95 duration-200">
        {/* Animated Rocket Icon Badge */}
        <div className="relative mx-auto mb-4 w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center animate-bounce">
          <Rocket className="w-10 h-10 text-amber-400 rotate-45" />
          <div className="absolute -top-1 -right-1 p-1.5 rounded-full bg-rose-600 text-white">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          স্পিড লিমিট অ্যালার্ট!
        </span>

        <h3 className="text-xl font-extrabold text-white mt-3 mb-2">
          ভাই, আপনি কি নাসার রকেটে করে বাংলাদেশ ঘুরতেছেন?
        </h3>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
          সিএনজির মিটারের চেয়েও দ্রুত জেলা পার হচ্ছেন! একটু দম নেন, সত্য কথা বলুন। এত দ্রুত পুরো বাংলাদেশ ঘোরা সম্ভব না!
        </p>

        <button
          onClick={onClose}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition duration-150 active:scale-95 shadow-lg shadow-amber-950/40 text-sm"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>আমি ক্ষমা চাচ্ছি, আস্তে ক্লিক করবো</span>
        </button>
      </div>
    </div>
  );
}
