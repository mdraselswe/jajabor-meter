"use client";

import React, { useEffect } from "react";
import { Wrench, RotateCcw, AlertTriangle, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Jajabor Meter Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl flex flex-col items-center">
        {/* Animated Icon */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center">
            <Wrench className="w-12 h-12 text-amber-500 animate-spin" style={{ animationDuration: "12s" }} />
          </div>
          <div className="absolute -bottom-1 -right-1 p-2 bg-rose-500 rounded-full text-white">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-3">
          যান্ত্রিক গোলযোগ!
        </span>

        <h1 className="text-3xl font-extrabold text-white mb-3">
          গাড়ির টায়ার পাংচার হয়েছে!
        </h1>

        <p className="text-slate-400 text-sm leading-relaxed mb-4">
          হাইওয়েতে চলতে চলতে ইঞ্জিনে ধোঁয়া উঠে গেছে অথবা কোনো জেলা মাপতে গিয়ে সার্ভার একটু হোঁচট খেয়েছে। চিন্তার কিছু নেই, নিচে চাপ দিয়ে গাড়ি আবার স্টার্ট করুন!
        </p>

        {error?.message && (
          <div className="w-full p-3 rounded-2xl bg-slate-950/80 border border-rose-500/30 text-rose-300 text-xs text-left font-mono break-all mb-6 max-h-32 overflow-y-auto">
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>আবার স্টার্ট দিন</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold border border-slate-700 transition active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>হোমে যান</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
