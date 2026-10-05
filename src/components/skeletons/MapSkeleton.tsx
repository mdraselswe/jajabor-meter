import React from "react";
import { MapPin, Compass } from "lucide-react";

export default function MapSkeleton() {
  return (
    <div className="w-full flex flex-col items-center justify-center p-6 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-md shadow-2xl relative overflow-hidden min-h-[500px]">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-slate-700/10 to-transparent pointer-events-none" />

      {/* Top filter placeholder */}
      <div className="w-full flex flex-wrap gap-2 justify-center mb-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-8 w-20 bg-slate-800/80 rounded-full animate-pulse" />
        ))}
      </div>

      {/* Center map silhouette mockup */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-md h-80 bg-slate-800/40 rounded-2xl border border-slate-700/30 p-8">
        <Compass className="w-16 h-16 text-emerald-500/40 animate-spin mb-4" style={{ animationDuration: "6s" }} />
        <div className="flex items-center gap-2 text-slate-400 font-medium text-sm">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span>সোনার বাংলার ৬৪টি জেলা লোড হচ্ছে...</span>
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">
          খাটের ওপর বসে থাকুন, ম্যাপ এখনই আপনার স্ক্রিনে হাজির হবে!
        </p>

        {/* Pulsing grid dots representing districts */}
        <div className="grid grid-cols-4 gap-4 mt-6 opacity-30">
          {[...Array(8)].map((_, idx) => (
            <div key={idx} className="w-8 h-8 rounded-lg bg-emerald-500/20 animate-pulse" style={{ animationDelay: `${idx * 150}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
