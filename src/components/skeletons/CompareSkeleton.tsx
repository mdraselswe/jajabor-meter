import React from "react";
import { Swords, Compass } from "lucide-react";

export default function CompareSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col p-6 space-y-8 animate-pulse">
      {/* Title Header Skeleton */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="p-3 bg-slate-800 rounded-2xl text-amber-400">
          <Swords className="w-8 h-8 opacity-70" />
        </div>
        <div className="h-8 w-64 bg-slate-800 rounded-lg" />
        <div className="h-4 w-96 bg-slate-800/60 rounded" />
      </div>

      {/* Dual Cards Comparison Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User 1 */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl flex flex-col items-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-700" />
          <div className="h-5 w-32 bg-slate-800 rounded" />
          <div className="h-4 w-48 bg-slate-800/60 rounded" />
          <div className="w-full h-48 bg-slate-800/30 rounded-2xl border border-slate-800 flex items-center justify-center">
            <Compass className="w-10 h-10 text-slate-700 animate-spin" />
          </div>
        </div>

        {/* User 2 */}
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl flex flex-col items-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-700" />
          <div className="h-5 w-32 bg-slate-800 rounded" />
          <div className="h-4 w-48 bg-slate-800/60 rounded" />
          <div className="w-full h-48 bg-slate-800/30 rounded-2xl border border-slate-800 flex items-center justify-center">
            <Compass className="w-10 h-10 text-slate-700 animate-spin" />
          </div>
        </div>
      </div>
    </div>
  );
}
