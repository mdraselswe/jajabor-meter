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

  const mParam = typeof rawM === "string" ? rawM : "";
  const rank = calculateRank(count);

  const fallbackOgUrl = `https://jajabor.mdrasel.site/api/og?n=${encodeURIComponent(name)}&d=${encodeURIComponent(dParam)}&m=${encodeURIComponent(mParam)}`;

  const rawImg = searchParams.img;
  let finalImageUrl = fallbackOgUrl;
  if (typeof rawImg === "string" && rawImg.startsWith("http")) {
    try {
      finalImageUrl = decodeURIComponent(rawImg);
    } catch {
      finalImageUrl = rawImg;
    }
  }

  return {
    title: `${name}-এর যাযাবর মিটার ভ্রমণ ফলাফল ও ১v১ যুদ্ধ চ্যালেঞ্জ`,
    description: `আমি (${name}) বাংলাদেশের ${toBn(count)}টি জেলায় ভ্রমণ করে "${rank.title}" পদবী পেয়েছি! আমার সাথে টেক্কা দেওয়ার সাহস আছে?`,
    openGraph: {
      title: `${name}-এর ভ্রমণ সনদপত্র | যাযাবর মিটার ২০২৬`,
      description: `বাংলাদেশের ${toBn(count)}টি জেলা ভ্রমণ করে অর্জিত পদবী: "${rank.title}"! টেক্কা দেওয়ার সাহস থাকলে লিংকে চাপুন!`,
      url: `https://jajabor.mdrasel.site/compare?n=${encodeURIComponent(name)}&d=${encodeURIComponent(dParam)}`,
      siteName: "যাযাবর মিটার",
      locale: "bn_BD",
      type: "website",
      images: [
        {
          url: finalImageUrl,
          width: 1200,
          height: 630,
          alt: `${name}-এর অফিসিয়াল যাযাবর ভ্রমণ সনদপত্র`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name}-এর যাযাবর মিটার ভ্রমণ সনদপত্র`,
      description: `বাংলাদেশের ${toBn(count)}টি জেলায় ভ্রমণ সম্পন্ন! পদবী: ${rank.title}`,
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
