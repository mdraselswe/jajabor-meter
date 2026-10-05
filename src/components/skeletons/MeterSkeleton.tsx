import React from "react";
import { Gauge, Sparkles } from "lucide-react";

export default function MeterSkeleton() {
  return (
    <div className="w-full flex flex-col p-6 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-md shadow-2xl relative overflow-hidden">
      {/* Top Header Placeholder */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-800 animate-pulse text-amber-500">
            <Gauge className="w-6 h-6 opacity-60" />
          </div>
          <div>
            <div className="h-5 w-32 bg-slate-800 rounded-md animate-pulse mb-1.5" />
            <div className="h-3 w-48 bg-slate-800/60 rounded-md animate-pulse" />
          </div>
        </div>
        <div className="h-8 w-24 bg-slate-800 rounded-full animate-pulse" />
      </div>

      {/* Speedometer Gauge Mock */}
      <div className="flex flex-col items-center my-6">
        <div className="relative w-44 h-44 rounded-full border-4 border-dashed border-slate-700/50 flex flex-col items-center justify-center animate-pulse">
          <div className="h-10 w-20 bg-slate-800 rounded-lg mb-2" />
          <div className="h-4 w-28 bg-slate-800/60 rounded-md" />
        </div>
      </div>

      {/* Badges and checklist skeletons */}
      <div className="space-y-3 mt-4">
        <div className="h-14 w-full bg-slate-800/40 rounded-2xl border border-slate-800 animate-pulse flex items-center px-4 justify-between">
          <div className="h-4 w-40 bg-slate-700/60 rounded" />
          <Sparkles className="w-5 h-5 text-slate-600" />
        </div>
        <div className="h-14 w-full bg-slate-800/40 rounded-2xl border border-slate-800 animate-pulse flex items-center px-4 justify-between">
          <div className="h-4 w-48 bg-slate-700/60 rounded" />
          <Sparkles className="w-5 h-5 text-slate-600" />
        </div>
      </div>
    </div>
  );
}
