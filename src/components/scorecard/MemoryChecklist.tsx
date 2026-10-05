"use client";

import React, { useState } from "react";
import { TOUR_MEMORIES } from "@/data/tourMemories";
import { Smile, Check, Sparkles, Award } from "lucide-react";
import { toBn } from "@/utils/bengaliDigits";

interface MemoryChecklistProps {
  selectedMemoryIds: string[];
  onToggleMemory: (id: string) => void;
}

export default function MemoryChecklist({
  selectedMemoryIds,
  onToggleMemory,
}: MemoryChecklistProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const checkedCount = selectedMemoryIds.length;
  const bonusPoints = checkedCount * 5;

  const handleClick = (id: string) => {
    const isAdding = !selectedMemoryIds.includes(id);
    onToggleMemory(id);

    if (isAdding) {
      setToastMessage(`+${toBn(5)} ফান পয়েন্ট যুক্ত হয়েছে!`);
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  // Funny memory titles
  let memoryRank = "নির্দোষ পর্যটক";
  if (checkedCount >= 1 && checkedCount <= 2) {
    memoryRank = "নবীন ট্যুর ভুক্তভোগী";
  } else if (checkedCount >= 3 && checkedCount <= 4) {
    memoryRank = "পাকা যাযাবর ট্রাজেডি কিং";
  } else if (checkedCount >= 5) {
    memoryRank = "ট্যুর ট্রাজেডির ডক্টরেট ডিগ্রিধারী!";
  }

  return (
    <div className="w-full p-5 bg-slate-900/80 border border-slate-800 rounded-3xl backdrop-blur-md relative overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-xs animate-bounce shadow-lg">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Smile className="w-5 h-5 text-amber-400" />
          <div>
            <h4 className="font-extrabold text-white text-sm sm:text-base leading-tight">
              ট্যুরের কাণ্ডকারখানা চেকলিস্ট
            </h4>
            <span className="text-[11px] text-amber-300 font-semibold">
              লেভেল: {memoryRank} ({toBn(checkedCount)}/{toBn(TOUR_MEMORIES.length)})
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/40">
            +{toBn(bonusPoints)} বোনাস পয়েন্ট
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-300 mb-3 leading-relaxed">
        নিচের ঘটনাগুলো আপনার সাথেও ঘটেছে? টিক দিন—প্রতিটি টিক আপনার সনদে এক্সট্রা ফান পয়েন্ট ও রেকর্ড যুক্ত করবে:
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-2 rounded-full mb-4 overflow-hidden">
        <div
          className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-300"
          style={{ width: `${(checkedCount / TOUR_MEMORIES.length) * 100}%` }}
        />
      </div>

      {/* Checklist items */}
      <div className="space-y-2.5">
        {TOUR_MEMORIES.map((memory) => {
          const isChecked = selectedMemoryIds.includes(memory.id);

          return (
            <div
              key={memory.id}
              onClick={() => handleClick(memory.id)}
              className={`flex items-start gap-3 p-3.5 rounded-2xl border text-xs sm:text-sm cursor-pointer select-none transition-all duration-150 active:scale-[0.98] ${
                isChecked
                  ? "bg-amber-950/40 border-amber-500/60 text-amber-100 shadow-sm"
                  : "bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isChecked
                    ? "bg-amber-500 border-amber-500 text-slate-950 font-bold"
                    : "border-slate-600 bg-slate-900"
                }`}
              >
                {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <div className="flex-1 leading-snug font-medium">
                {memory.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
