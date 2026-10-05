import type { Metadata } from "next";
import { Noto_Sans_Bengali } from "next/font/google";
import "@/styles/globals.css";
import { Compass, Heart, Swords } from "lucide-react";
import Link from "next/link";

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-bengali",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jajabor.mdrasel.site"),
  title: "যাযাবর মিটার (Jajabor Meter) - আপনি কতটা আসল পর্যটক?",
  description: "বাংলাদেশের ৬৪ জেলার কালারফুল ইন্টারেক্টিভ ম্যাপ। সিলেক্ট করুন আপনি কোন কোন জেলায় গেছেন, মেপে দেখুন আপনার যাযাবর স্কোর এবং জানুন আপনি কতটা আসল পর্যটক নাকি আন্তর্জাতিক ফাঁপরবাজ!",
  keywords: ["যাযাবর মিটার", "Jajabor Meter", "বাংলাদেশ ম্যাপ", "৬৪ জেলা", "ট্যুর স্কোর", "ভ্রমণ সনদপত্র", "Bangladesh Travel Map"],
  authors: [{ name: "Jajabor Meter Team" }],
  openGraph: {
    title: "যাযাবর মিটার - আপনি কতটা আসল যাযাবর?",
    description: "বাংলাদেশের ৬৪ জেলায় আপনার ভ্রমণ ট্র্যাক করুন এবং পেয়ে যান অফিসিয়াল ফাঁপর ও ভ্রমণ সনদপত্র!",
    url: "https://jajabor.mdrasel.site",
    siteName: "যাযাবর মিটার",
    locale: "bn_BD",
    type: "website",
    images: [
      {
        url: "/og-banner.png",
        width: 1200,
        height: 630,
        alt: "যাযাবর মিটার - আপনি কতটা আসল পর্যটক?",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "যাযাবর মিটার (Jajabor Meter)",
    description: "৬৪ জেলায় আপনার ভ্রমণ মাপুন এবং বন্ধুদের চ্যালেঞ্জ করুন!",
    images: ["/og-banner.png"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={notoSansBengali.variable}>
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
        {/* Universal Funny Header */}
        <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform duration-200">
                <Compass className="w-6 h-6 group-hover:text-emerald-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base sm:text-lg leading-tight tracking-tight text-white flex items-center gap-2">
                  যাযাবর মিটার
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                    ফান ভার্সন
                  </span>
                </span>
                <span className="text-xs text-slate-400 leading-tight">
                  আসল যাযাবর নাকি খাটের রাজা?
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:from-amber-400 hover:to-orange-400 shadow-md shadow-amber-950/40 transition active:scale-95"
              >
                <Swords className="w-4 h-4 text-slate-950" />
                <span>বন্ধু যুদ্ধ (১v১)</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>

        {/* Universal Funny Footer */}
        <footer className="w-full border-t border-slate-800 bg-slate-950/95 py-6 text-center text-xs sm:text-sm text-slate-400 mt-auto">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="flex items-center gap-1.5 text-slate-300">
              <span>সোনার বাংলা ও ঘুরাঘুরির প্রতি ভালোবাসা নিয়ে তৈরি</span>
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 inline" />
            </p>
            <p className="text-slate-400">
              সতর্কবাণী: বেশি ফাঁপর মারিলে বন্ধুরা ট্যুরে নেওয়া বন্ধ করে দিতে পারে!
            </p>
            <p className="text-slate-400">
              © ২০২৬ যাযাবর মিটার
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
