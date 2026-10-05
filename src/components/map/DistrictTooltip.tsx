"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { District } from "@/data/districts";
import { MapPin, Utensils, Sparkles, CheckCircle2 } from "lucide-react";

interface DistrictTooltipProps {
  district: District | null;
  isSelected: boolean;
  position: { x: number; y: number } | null;
}

export default function DistrictTooltip({
  district,
  isSelected,
  position,
}: DistrictTooltipProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !district || !position) return null;

  // Safeguard: Never render tooltip on mobile or touch-only screens
  if (typeof window !== "undefined") {
    if (window.innerWidth < 768) return null;
    if (window.matchMedia && !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return null;
    }
  }

  // Viewport clamping so tooltip never overflows screen edges
  const tooltipWidth = 260;
  const halfWidth = tooltipWidth / 2;
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1200;

  let left = position.x;
  if (left - halfWidth < 14) {
    left = halfWidth + 14;
  } else if (left + halfWidth > screenWidth - 14) {
    left = screenWidth - halfWidth - 14;
  }

  // If cursor is near the top of the viewport, render below the cursor instead of above
  const showBelow = position.y < 230;
  const top = showBelow ? position.y + 16 : position.y - 12;
  const transform = showBelow ? "translate(-50%, 0)" : "translate(-50%, -100%)";

  return createPortal(
    <div
      className="fixed pointer-events-none z-[99999] transition-all duration-75 ease-out select-none"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        transform,
      }}
    >
      <div className="bg-slate-900/95 border border-slate-700/80 backdrop-blur-xl rounded-2xl p-3.5 shadow-2xl max-w-xs w-64 text-left animate-in fade-in zoom-in-95 duration-100">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-1.5 pb-1.5 border-b border-slate-800">
          <div className="flex items-center gap-1.5 min-w-0">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <h4 className="font-bold text-white text-sm truncate">
              {district.nameBn}
            </h4>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 shrink-0 border border-slate-700 font-medium">
            {district.divisionBn}
          </span>
        </div>

        {/* Selected badge */}
        {isSelected && (
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ঘোরা সম্পন্ন হয়েছে!</span>
          </div>
        )}

        {/* Famous Food */}
        <div className="flex items-start gap-1.5 text-xs text-amber-300/90 mb-1.5">
          <Utensils className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
          <span className="line-clamp-2">
            <strong className="text-amber-200">খাবার:</strong> {district.food}
          </span>
        </div>

        {/* Funny Fact */}
        <div className="flex items-start gap-1.5 text-[11px] text-slate-400">
          <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-purple-400" />
          <span className="italic leading-snug line-clamp-2">
            &quot;{district.fact}&quot;
          </span>
        </div>

        {/* Micro tip */}
        <div className="mt-2 text-[10px] text-slate-500 text-center border-t border-slate-800/80 pt-1">
          {isSelected ? "ক্লিক করে আনসিলেক্ট করুন" : "ক্লিক করে তালিকায় যোগ করুন"}
        </div>
      </div>
    </div>,
    document.body
  );
}
