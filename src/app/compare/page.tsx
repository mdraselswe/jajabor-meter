import type { Metadata } from "next";
import { Suspense } from "react";
import CompareView from "@/components/compare/CompareView";
import CompareSkeleton from "@/components/skeletons/CompareSkeleton";
import { calculateRank } from "@/utils/scoreCalculator";
import { toBn } from "@/utils/bengaliDigits";

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const rawN = searchParams.n;
  const rawD = searchParams.d;
  const rawM = searchParams.m;

  let name = "বন্ধু যাযাবর";
  if (typeof rawN === "string" && rawN.trim()) {
    try {
      name = rawN.includes("%") ? decodeURIComponent(rawN) : rawN;
    } catch {
      name = rawN;
    }
  }

  let count = 0;
  let dParam = "";
  if (typeof rawD === "string") {
    dParam = rawD;
    count = rawD.split(",").filter(Boolean).length;
  }

  const rawT = searchParams.t;
  const mParam = typeof rawM === "string" ? rawM : "";
  const rank = calculateRank(count);
  const percentage = Math.round((count / 64) * 100);

  const fallbackOgUrl = `https://jajabor.mdrasel.site/api/og?n=${encodeURIComponent(name)}&d=${encodeURIComponent(dParam)}&m=${encodeURIComponent(mParam)}${rawT ? `&t=${encodeURIComponent(String(rawT))}` : `&v=3`}`;

  const rawImg = searchParams.img;
  let finalImageUrl = fallbackOgUrl;
  if (typeof rawImg === "string" && rawImg.startsWith("http")) {
    try {
      finalImageUrl = decodeURIComponent(rawImg);
    } catch {
      finalImageUrl = rawImg;
    }
  }

  const queryParts = [
    `n=${encodeURIComponent(name)}`,
    `d=${encodeURIComponent(dParam)}`,
  ];
  if (mParam) queryParts.push(`m=${encodeURIComponent(mParam)}`);
  if (rawImg && typeof rawImg === "string") queryParts.push(`img=${encodeURIComponent(rawImg)}`);
  if (rawT && typeof rawT === "string") queryParts.push(`t=${encodeURIComponent(rawT)}`);
  const canonicalUrl = `https://jajabor.mdrasel.site/compare?${queryParts.join("&")}`;

  return {
    title: `${name}-এর ঘুরে দেখা জেলার ভ্রমণ সারাংশ | যাযাবর মিটার`,
    description: `আমি (${name}) বাংলাদেশের ৬৪ জেলার মধ্যে ${toBn(count)}টি জেলা ভ্রমণ করে "${rank.title}" পদবী পেয়েছি! আমার সাথে টেক্কা দেওয়ার সাহস আছে?`,
    openGraph: {
      title: `${name}-এর ঘুরে দেখা জেলার ভ্রমণ সারাংশ | যাযাবর মিটার`,
      description: `বাংলাদেশের ৬৪ জেলার মধ্যে ${toBn(count)}টি জেলা ভ্রমণ সম্পন্ন (${toBn(percentage)}%)! অর্জিত পদবী: "${rank.title}"। টেক্কা দেওয়ার সাহস থাকলে লিংকে চাপুন!`,
      url: canonicalUrl,
      siteName: "যাযাবর মিটার",
      locale: "bn_BD",
      type: "website",
      images: [
        {
          url: finalImageUrl,
          width: 1200,
          height: 630,
          alt: `${name}-এর ঘুরে দেখা জেলার ভ্রমণ সারাংশ`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name}-এর ঘুরে দেখা জেলার ভ্রমণ সারাংশ | যাযাবর মিটার`,
      description: `বাংলাদেশের ৬৪ জেলার মধ্যে ${toBn(count)}টি জেলায় ভ্রমণ সম্পন্ন (${toBn(percentage)}%)! পদবী: ${rank.title}`,
      images: [finalImageUrl],
    },
  };
}

export default function ComparePage() {
  return (
    <Suspense fallback={<CompareSkeleton />}>
      <CompareView />
    </Suspense>
  );
}
