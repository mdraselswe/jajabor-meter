import { SpecialBadge } from "@/types";

export const SPECIAL_BADGES: SpecialBadge[] = [
  {
    id: "ilish-expert",
    title: "ইলিশ বিশারদ",
    description: "চাঁদপুর, ভোলা ও বরিশাল ভ্রমণ করে নদীর রুপালী ইলিশের সন্ধান পেয়েছেন!",
    iconName: "Fish",
    requiredDistricts: ["chandpur", "bhola", "barisal"],
  },
  {
    id: "tea-lover",
    title: "চা-বাগান বিশেষজ্ঞ",
    description: "সিলেট, মৌলভীবাজার ও হবিগঞ্জ ঘুরে চায়ের দেশ জয় করেছেন!",
    iconName: "Coffee",
    requiredDistricts: ["sylhet", "moulvibazar", "habiganj"],
  },
  {
    id: "mountain-conqueror",
    title: "পাহাড়ি মার্বেল",
    description: "বান্দরবান, রাঙামাটি ও খাগড়াছড়ি ঘুরে পাহাড়ি রক্তে দীক্ষিত হয়েছেন!",
    iconName: "Mountain",
    requiredDistricts: ["bandarban", "rangamati", "khagrachhari"],
  },
  {
    id: "mango-master",
    title: "আমের কারিগর",
    description: "রাজশাহী ও চাঁপাইনবাবগঞ্জ গিয়ে আমের আসল স্বাদ চিনেছেন!",
    iconName: "Sun",
    requiredDistricts: ["rajshahi", "chapainawabganj"],
  },
  {
    id: "sweet-hunter",
    title: "মিষ্টি শিকারী",
    description: "বগুড়া (দই), নাটোর (কাঁচাগোল্লা) ও কুমিল্লা (রসমলাই) দিয়ে মিষ্টির স্বর্গ ঘুরেছেন!",
    iconName: "Cake",
    requiredDistricts: ["bogura", "natore", "cumilla"],
  },
  {
    id: "ocean-wanderer",
    title: "সমুদ্র বিলাসী",
    description: "কক্সবাজার ও পটুয়াখালী (কুয়াকাটা) গিয়ে নীল সমুদ্রের ঢেউ গুনেছেন!",
    iconName: "Waves",
    requiredDistricts: ["coxs-bazar", "patuakhali"],
  },
];
