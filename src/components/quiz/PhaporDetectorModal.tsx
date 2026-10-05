"use client";

import React, { useState } from "react";
import { PhaporQuiz, PhaporQuizOption } from "@/types";
import { toBn } from "@/utils/bengaliDigits";
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  AlertOctagon, 
  ArrowRight,
  Sparkles
} from "lucide-react";

interface PhaporDetectorModalProps {
  quiz: PhaporQuiz | null;
  districtNameBn: string;
  isOpen: boolean;
  onSuccess: () => void;
  onFail: () => void;
}

export default function PhaporDetectorModal({
  quiz,
  districtNameBn,
  isOpen,
  onSuccess,
  onFail,
}: PhaporDetectorModalProps) {
  const [selectedOption, setSelectedOption] = useState<PhaporQuizOption | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  if (!isOpen || !quiz) return null;

  const handleSelect = (option: PhaporQuizOption) => {
    if (hasSubmitted) return;
    setSelectedOption(option);
    setHasSubmitted(true);
  };

  const handleConfirm = () => {
    if (!selectedOption) return;
    if (selectedOption.isLegit) {
      onSuccess();
    } else {
      onFail();
    }
    // Reset state
    setSelectedOption(null);
    setHasSubmitted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`relative max-w-md w-full bg-slate-900 border rounded-3xl p-6 shadow-2xl transition-all duration-200 ${
          hasSubmitted && selectedOption && !selectedOption.isLegit
            ? "border-rose-500/80 animate-shake"
            : hasSubmitted && selectedOption?.isLegit
            ? "border-emerald-500/80"
            : "border-slate-700"
        }`}
      >
        {/* Top Header Badge */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider block">
                লাই-ডিটেক্টর টেস্ট
              </span>
              <h4 className="text-sm font-bold text-white">
                {districtNameBn} ফাঁপর ডিটেক্টর
              </h4>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
            সত্যি গেছেন তো?
          </span>
        </div>

        {/* Question Title */}
        <h3 className="text-base sm:text-lg font-bold text-white mb-4 leading-snug">
          {quiz.question}
        </h3>

        {/* Options */}
        <div className="space-y-2.5 mb-6">
          {quiz.options.map((opt, idx) => {
            const isChosen = selectedOption === opt;
            let btnStyle = "bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200";

            if (hasSubmitted) {
              if (isChosen) {
                btnStyle = opt.isLegit
                  ? "bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold"
                  : "bg-rose-950/60 border-rose-500 text-rose-200 font-semibold";
              } else {
                btnStyle = "opacity-40 bg-slate-800/40 border-slate-800 text-slate-400";
              }
            }

            return (
              <button
                key={idx}
                disabled={hasSubmitted}
                onClick={() => handleSelect(opt)}
                className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm flex items-start gap-3 transition-all duration-150 active:scale-[0.98] ${btnStyle}`}
              >
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  {toBn(idx + 1)}
                </span>
                <span className="leading-snug">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Result Feedback Banner */}
        {hasSubmitted && selectedOption && (
          <div
            className={`p-4 rounded-2xl border mb-5 flex items-start gap-3 animate-in zoom-in-95 duration-150 ${
              selectedOption.isLegit
                ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                : "bg-rose-950/40 border-rose-500/40 text-rose-300"
            }`}
          >
            {selectedOption.isLegit ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold text-xs mb-0.5">
                {selectedOption.isLegit ? "সত্য প্রমাণিত হয়েছে!" : "ফাঁপরবাজি ধরা পড়েছে!"}
              </div>
              <p className="text-xs leading-relaxed text-slate-200">
                {selectedOption.roastReply}
              </p>
            </div>
          </div>
        )}

        {/* Action Button */}
        {hasSubmitted && (
          <button
            onClick={handleConfirm}
            className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-sm transition active:scale-95 shadow-lg ${
              selectedOption?.isLegit
                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30"
                : "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30"
            }`}
          >
            {selectedOption?.isLegit ? (
              <>
                <Sparkles className="w-4 h-4" />
                <span>জেলা তালিকায় যোগ করুন</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                <span>লজ্জা পেয়ে ফিরে যান</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
