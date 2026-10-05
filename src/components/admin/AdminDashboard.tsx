"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Activity, 
  Smartphone, 
  Monitor, 
  RefreshCw, 
  LogOut, 
  Search, 
  ShieldAlert, 
  Database, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  Flame,
  Globe
} from "lucide-react";
import { toBn } from "@/utils/bengaliDigits";

interface VisitorRecord {
  visitorId: string;
  userType: "logged_in" | "guest";
  name: string;
  avatarUrl: string | null;
  device: "mobile" | "desktop" | "tablet";
  lastVisit: string;
  firstVisit?: string;
  visitCount: number;
  lastPath?: string;
}

interface AnalyticsSummary {
  totalVisits: number;
  totalUniqueVisitors: number;
  totalLoggedInUsers: number;
  totalGuests: number;
  deviceMobile: number;
  deviceDesktop: number;
  todayVisits: number;
  lastUpdated: string;
  isFirestoreLive: boolean;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

function formatRelativeTime(isoString: string): string {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 45) return "এইমাত্র";
    if (diffMin < 60) return `${toBn(diffMin)} মিনিট আগে`;
    if (diffHour < 24) return `${toBn(diffHour)} ঘণ্টা আগে`;
    if (diffDay === 1) return "গতকাল";
    return `${toBn(diffDay)} দিন আগে`;
  } catch {
    return "অজানা সময়";
  }
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [visitors, setVisitors] = useState<VisitorRecord[]>([]);
  const [isFirestoreLive, setIsFirestoreLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "logged_in" | "guest">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchStats = async (isManual = false) => {
    try {
      if (isManual) setIsRefreshing(true);
      const res = await fetch("/api/admin/stats");
      if (res.status === 401) {
        onLogout();
        return;
      }
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
        setVisitors(data.recentVisitors || []);
        setIsFirestoreLive(Boolean(data.isFirestoreLive));
      }
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Auto-refresh stats every 25 seconds while dashboard is open
    const interval = setInterval(() => {
      fetchStats();
    }, 25000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
      onLogout();
    } catch {
      onLogout();
    }
  };

  // Filter visitors
  const filteredVisitors = visitors.filter((v) => {
    if (filterType === "logged_in" && v.userType !== "logged_in") return false;
    if (filterType === "guest" && v.userType !== "guest") return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (v.name || "").toLowerCase().includes(q);
      const matchId = (v.visitorId || "").toLowerCase().includes(q);
      return matchName || matchId;
    }
    return true;
  });

  const totalUnique = summary?.totalUniqueVisitors || visitors.length;
  const loggedInCount = summary?.totalLoggedInUsers || visitors.filter((v) => v.userType === "logged_in").length;
  const guestCount = summary?.totalGuests || visitors.filter((v) => v.userType === "guest").length;
  const loggedInPercent = totalUnique > 0 ? Math.round((loggedInCount / totalUnique) * 100) : 0;
  const guestPercent = totalUnique > 0 ? 100 - loggedInPercent : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
              অ্যাডমিন কন্ট্রোল সেন্টার
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            যাযাবর মিটার ভিজিটর অ্যানালিটিক্স
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            ওয়েবসাইটে কতজন লগড-ইন এবং কতজন গেস্ট ভিজিট করেছে তার রিয়েল-টাইম তথ্য
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchStats(true)}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm font-bold text-slate-200 border border-slate-700/80 transition active:scale-95 disabled:opacity-50 cursor-pointer shadow-md"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-400 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "রিফ্রেশ হচ্ছে..." : "রিফ্রেশ"}</span>
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs sm:text-sm font-bold transition active:scale-95 cursor-pointer shadow-md"
          >
            <LogOut className="w-4 h-4" />
            <span>লগআউট</span>
          </button>
        </div>
      </div>

      {/* Firestore Connection Status Banner */}
      {!isFirestoreLive && !isLoading && (
        <div className="p-4 sm:p-5 rounded-3xl bg-amber-950/40 border border-amber-600/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg animate-in fade-in">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-200 flex items-center gap-2">
                ফায়ারবেজ ফায়ারস্টোর (Cloud Storage) অ্যাক্টিভেশন নোটিশ
              </h4>
              <p className="text-xs text-amber-300/80 mt-1 leading-relaxed">
                আপনার ফায়ারবেজ অ্যাকাউন্টে এখনো Firestore Database তৈরি করা হয়নি। ভিজিটর ডাটা পার্মানেন্টলি ক্লাউডে সেভ করতে Firebase Console-এ গিয়ে <strong>Firestore Database -&gt; Create database</strong> এ ক্লিক করুন। (বর্তমানে মেমোরি মোডে ডাটা ট্র্যাক হচ্ছে)।
              </p>
            </div>
          </div>
          <a
            href="https://console.firebase.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition shrink-0 active:scale-95 shadow-md"
          >
            <span>Firebase Console খুলুন</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Unique Visitors */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400">মোট ইউনিক ভিজিটর</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            {toBn(totalUnique)} <span className="text-xs font-semibold text-slate-400">জন</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <Globe className="w-3 h-3 text-blue-400 inline" />
            <span>সর্বমোট স্বতন্ত্র ডিভাইস ও ব্যবহারকারী</span>
          </p>
        </div>

        {/* Logged In Visitors */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-emerald-900/40 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-400">গুগল লগড-ইন পর্যটক</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400 tracking-tight">
            {toBn(loggedInCount)} <span className="text-xs font-semibold text-emerald-500">জন</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" />
            <span>ভেরিফাইড গুগল অ্যাকাউন্ট প্রোফাইল</span>
          </p>
        </div>

        {/* Guest Visitors */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-amber-900/40 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-400">গেস্ট যাযাবর (Guest)</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-400 tracking-tight">
            {toBn(guestCount)} <span className="text-xs font-semibold text-amber-500">জন</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-400 inline" />
            <span>লগইন ছাড়া বেনামী ভিজিটর</span>
          </p>
        </div>

        {/* Total Page Views / Visits */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-purple-400">মোট পেজভিউ / সেশন</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-purple-300 tracking-tight">
            {toBn(summary?.totalVisits || visitors.length)} <span className="text-xs font-semibold text-slate-400">বার</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <Clock className="w-3 h-3 text-purple-400 inline" />
            <span>আজকের সেশন: {toBn(summary?.todayVisits || visitors.length)} বার</span>
          </p>
        </div>
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Ratio Breakdown */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-2">ভিজিটর অনুপাত (Logged-in vs Guest)</h3>
          <p className="text-xs text-slate-400 mb-4">
            কত শতাংশ মানুষ লগইন করে ট্রাভেল হিস্টোরি তৈরি করেছেন বনাম গেস্ট হিসেবে দেখেছেন
          </p>

          {/* Progress Bar */}
          <div className="w-full h-4 rounded-full bg-slate-950 overflow-hidden flex border border-slate-800 mb-3">
            <div
              style={{ width: `${loggedInPercent}%` }}
              className="bg-emerald-500 h-full transition-all duration-500"
              title={`Logged-in: ${loggedInPercent}%`}
            />
            <div
              style={{ width: `${guestPercent}%` }}
              className="bg-amber-500 h-full transition-all duration-500"
              title={`Guest: ${guestPercent}%`}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-300 font-semibold">লগড-ইন পর্যটক: {toBn(loggedInPercent)}% ({toBn(loggedInCount)} জন)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-slate-300 font-semibold">গেস্ট যাযাবর: {toBn(guestPercent)}% ({toBn(guestCount)} জন)</span>
            </div>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-2">ডিভাইস বিশ্লেষণ (Device Breakdown)</h3>
          <p className="text-xs text-slate-400 mb-4">
            ভিজিটররা কোন ধরনের ডিভাইস দিয়ে ওয়েবসাইট ব্যবহার করছেন
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">স্মার্টফোন / মোবাইল</span>
                <span className="text-lg font-black text-white">
                  {toBn(summary?.deviceMobile || visitors.filter((v) => v.device === "mobile").length)} <span className="text-xs text-slate-400 font-normal">ভিজিট</span>
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">ডেস্কটপ / ল্যাপটপ</span>
                <span className="text-lg font-black text-white">
                  {toBn(summary?.deviceDesktop || visitors.filter((v) => v.device !== "mobile").length)} <span className="text-xs text-slate-400 font-normal">ভিজিট</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visitors List Table / Feed */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        {/* Table Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              সাম্প্রতিক ভিজিটরদের তালিকা
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {toBn(filteredVisitors.length)} জন
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              প্রতিটি ভিজিটরের নাম, ইউজার ধরন, ডিভাইস ও অ্যাক্টিভিটি হিস্টোরি
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Pills */}
            <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-bold">
              <button
                onClick={() => setFilterType("all")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filterType === "all" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                সবাই
              </button>
              <button
                onClick={() => setFilterType("logged_in")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filterType === "logged_in" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                লগড-ইন ({toBn(loggedInCount)})
              </button>
              <button
                onClick={() => setFilterType("guest")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filterType === "guest" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                গেস্ট ({toBn(guestCount)})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="নাম বা আইডি দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-44 sm:w-52"
              />
            </div>
          </div>
        </div>

        {/* Visitors Table */}
        {filteredVisitors.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            {isLoading ? "ডাটা লোড হচ্ছে..." : "কোনো ভিজিটর ডাটা পাওয়া যায়নি।"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800/80 text-slate-400 font-bold">
                  <th className="pb-3 pl-2">ভিজিটর / ব্যবহারকারী</th>
                  <th className="pb-3">ধরন (Type)</th>
                  <th className="pb-3">ডিভাইস</th>
                  <th className="pb-3">ভিজিট সংখ্যা</th>
                  <th className="pb-3">শেষ পেজ</th>
                  <th className="pb-3 pr-2 text-right">শেষ ভিজিট</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredVisitors.map((v, idx) => {
                  const isLoggedIn = v.userType === "logged_in";
                  return (
                    <tr key={v.visitorId || idx} className="hover:bg-slate-800/30 transition">
                      {/* Name & Avatar */}
                      <td className="py-3 pl-2">
                        <div className="flex items-center gap-2.5">
                          {v.avatarUrl ? (
                            <img
                              src={v.avatarUrl}
                              alt={v.name}
                              className="w-7 h-7 rounded-full object-cover border border-slate-700"
                            />
                          ) : (
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                                isLoggedIn
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  : "bg-slate-800 text-slate-400 border border-slate-700"
                              }`}
                            >
                              {isLoggedIn ? "👤" : "🎒"}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-bold text-white flex items-center gap-1">
                              {v.name}
                              {isLoggedIn && (
                                <span className="text-emerald-400 text-[10px]" title="ভেরিফাইড গুগল ব্যবহারকারী">
                                  ✓
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono truncate max-w-[140px]">
                              {v.visitorId}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td className="py-3">
                        {isLoggedIn ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-[10px]">
                            <UserCheck className="w-3 h-3" />
                            লগড-ইন পর্যটক
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-[10px]">
                            <UserX className="w-3 h-3" />
                            গেস্ট যাযাবর
                          </span>
                        )}
                      </td>

                      {/* Device */}
                      <td className="py-3">
                        <span className="inline-flex items-center gap-1 text-slate-300 text-[11px]">
                          {v.device === "mobile" ? (
                            <>
                              <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                              <span>মোবাইল</span>
                            </>
                          ) : (
                            <>
                              <Monitor className="w-3.5 h-3.5 text-indigo-400" />
                              <span>ডেস্কটপ</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Visit Count */}
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-200 font-bold font-mono">
                          {toBn(v.visitCount || 1)} বার
                        </span>
                      </td>

                      {/* Last Path */}
                      <td className="py-3 text-slate-400 font-mono text-[11px]">
                        {v.lastPath || "/"}
                      </td>

                      {/* Last Visit Time */}
                      <td className="py-3 pr-2 text-right">
                        <span className="text-slate-300 font-semibold" title={v.lastVisit}>
                          {formatRelativeTime(v.lastVisit)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
