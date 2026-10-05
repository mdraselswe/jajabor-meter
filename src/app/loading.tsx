import React from "react";
import MapSkeleton from "@/components/skeletons/MapSkeleton";
import MeterSkeleton from "@/components/skeletons/MeterSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <main className="max-w-7xl mx-auto w-full px-4 py-8">
        {/* Top Header skeleton */}
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="h-10 w-64 bg-slate-850 bg-slate-800 rounded-2xl animate-pulse mb-2" />
          <div className="h-4 w-80 bg-slate-800/60 rounded-lg animate-pulse" />
        </div>

        {/* 2-column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 w-full">
            <MapSkeleton />
          </div>
          <div className="lg:col-span-4 w-full">
            <MeterSkeleton />
          </div>
        </div>
      </main>
    </div>
  );
}
