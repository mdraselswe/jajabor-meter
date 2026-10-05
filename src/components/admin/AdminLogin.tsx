"use client";

import React, { useState } from "react";
import { Lock, KeyRound, Eye, EyeOff, Loader2, ShieldCheck, Compass } from "lucide-react";

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("দয়া করে অ্যাডমিন পাসওয়ার্ড লিখুন");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onLoginSuccess();
      } else {
        setError(data.error || "ভুল পাসওয়ার্ড! দয়া করে সঠিক পাসওয়ার্ড দিন।");
      }
    } catch (err: any) {
      setError("লগইন করতে সমস্যা হয়েছে। ইন্টারনেট সংযোগ চেক করে আবার চেষ্টা করুন।");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Glow Effects */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-950/30">
            <Lock className="w-8 h-8" />
          </div>
          <span className="text-xs font-black text-amber-400 uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-2">
            অ্যাডমিন কন্ট্রোল সেন্টার
          </span>
          <h2 className="text-2xl font-black text-white">
            যাযাবর মিটার অ্যানালিটিক্স
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            ওয়েবসাইট ভিজিটর ও রিয়েল-টাইম পরিসংখ্যান দেখতে আপনার গোপন অ্যাডমিন পাসওয়ার্ড দিন।
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              অ্যাডমিন পাসওয়ার্ড / পিন
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="গোপন পাসওয়ার্ড লিখুন..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                disabled={isLoading}
                autoFocus
                className="w-full pl-10 pr-11 py-3.5 rounded-2xl bg-slate-950 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <p className="text-xs text-rose-400 font-semibold mt-2 animate-in fade-in">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !password.trim()}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm shadow-lg shadow-emerald-950/40 transition active:scale-95 cursor-pointer mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>যাচাই করা হচ্ছে...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করুন</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-400">
            💡 ডিফল্ট পাসওয়ার্ড: <span className="font-mono text-amber-300 font-bold">jajabor2026</span> (বা আপনার <span className="font-mono text-emerald-300">.env.local</span> এর <span className="font-mono">ADMIN_PASSWORD</span>)
          </p>
        </div>
      </div>
    </div>
  );
}
