import Link from "next/link";
import { Compass, Home, AlertTriangle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="relative max-w-lg w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl flex flex-col items-center">
        {/* Animated Icon Badge */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center animate-bounce-slow">
            <Compass className="w-12 h-12 text-rose-500" />
          </div>
          <div className="absolute -top-1 -right-1 p-2 bg-amber-500 rounded-full text-slate-950">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* 404 Title */}
        <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30 mb-3">
          ৪০৪: বর্ডার ক্রস এরর!
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
          রাস্তা ভুলে ভারতে ঢুকে গেছেন নাকি?
        </h1>

        <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8">
          যে লিংকে আপনি ঢুকতে চাইছেন, সেখানে কোনো জেলা নেই! আপনি হয়তো টেকনাফ পার হয়ে মিয়ানমার বা পঞ্চগড় পার হয়ে ভারতে চলে গেছেন। এখনই বর্ডার থেকে পিছু হটে নিজের জেলায় ফিরে আসুন।
        </p>

        {/* Action Button with SVG */}
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-900/30 transition-all duration-200 active:scale-95"
        >
          <Home className="w-5 h-5" />
          <span>সোনার বাংলায় ফিরে চলুন</span>
        </Link>
      </div>

      <div className="mt-8 flex items-center gap-2 text-xs text-slate-500">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>যাযাবর মিটার সেফটি রেগুলেশন ২০২৬</span>
      </div>
    </div>
  );
}
