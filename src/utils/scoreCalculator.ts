import { TitleRank } from "@/types";

export const TITLE_RANKS: TitleRank[] = [
  {
    min: 0,
    max: 2,
    title: "খাটের রাজা ও বালিশের সম্রাট",
    roast: "সারাদিন বিছানায় গড়াগড়ি দিয়ে ট্রাভেল ভ্লগ দেখার অনন্য প্রতিভার স্বীকৃতিস্বরূপ এই সনদ দেওয়া হলো!",
  },
  {
    min: 3,
    max: 8,
    title: "বিকেলবেলার চা-খোর পর্যটক",
    roast: "বাড়ির পাশের মোড়ের চায়ের দোকান পার হওয়া আপনার জন্য এভারেস্ট জয়ের সমান!",
  },
  {
    min: 9,
    max: 18,
    title: "লোকাল বাস এক্সপ্লোরার",
    roast: "বাসের হ্যান্ডেল ধরে ঝুলতে ঝুলতে আপনার জীবনের অর্ধেক ট্যুর সম্পন্ন হয়েছে!",
  },
  {
    min: 19,
    max: 32,
    title: "হাইওয়ে যাযাবর",
    roast: "বাসের জানালায় মুখ রেখে বাতাসে চুল ওড়ানো আর বাসের ব্রেক কষলে লাফিয়ে ওঠার সফল কারিগর!",
  },
  {
    min: 33,
    max: 48,
    title: "পাকা দেশপ্রেমী ভবঘুরে",
    roast: "বন্ধু-বান্ধব যখন চাকরির খোঁজে, আপনি তখন ঝর্ণার নিচে সেলফি তোলায় ব্যস্ত!",
  },
  {
    min: 49,
    max: 63,
    title: "জাতীয় ইবনে বতুতা",
    roast: "আপনার পায়ের নিচে সর্ষে নাকি সিএনজির ইঞ্জিন লাগানো? বাড়িতে আপনাকে চেনে তো মানুষ?",
  },
  {
    min: 64,
    max: 64,
    title: "আন্তর্জাতিক ফাঁপর সম্রাট",
    roast: "নির্দয়ভাবে ৬৪ জেলা সিলেক্ট করে নিজেকে মার্কো পোলো প্রমাণের জন্য আপনাকে নোবেল দেওয়া হোক!",
  },
];

export function calculateRank(districtCount: number): TitleRank {
  const rank = TITLE_RANKS.find(
    (r) => districtCount >= r.min && districtCount <= r.max
  );
  return rank || TITLE_RANKS[0];
}

export function calculatePercentage(districtCount: number): number {
  return Math.min(100, Math.max(0, Math.round((districtCount / 64) * 100)));
}

export const POINTS_PER_DISTRICT = 10;
export const POINTS_PER_MEMORY = 5;

export function calculateBonusPoints(memoryCount: number): number {
  return memoryCount * POINTS_PER_MEMORY;
}

export function calculateTotalScore(districtCount: number, memoryCount: number): number {
  return districtCount * POINTS_PER_DISTRICT + calculateBonusPoints(memoryCount);
}

export function getMemoryRank(memoryCount: number): string {
  if (memoryCount === 0) return "নির্দোষ পর্যটক";
  if (memoryCount <= 2) return "নবীন ট্যুর ভুক্তভোগী";
  if (memoryCount <= 4) return "পাকা যাযাবর ট্রাজেডি কিং";
  return "ট্যুর ট্রাজেডির ডক্টরেট ডিগ্রিধারী!";
}
