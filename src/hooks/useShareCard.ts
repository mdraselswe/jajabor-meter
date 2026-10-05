"use client";

import { useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { UserProfile, TitleRank } from "@/types";
import { encodeCompareData, getBaseUrl } from "@/utils/urlEncoder";
import { toBn } from "@/utils/bengaliDigits";
import { 
  calculateTotalScore, 
  calculateBonusPoints, 
  getMemoryRank 
} from "@/utils/scoreCalculator";

const TRANSPARENT_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAEDEB/0wAAAABJRU5ErkJggg==";

async function inlineCardImages(container: HTMLElement): Promise<() => void> {
  if (typeof window === "undefined") return () => {};
  const images = Array.from(container.querySelectorAll("img"));
  const cleanups: Array<() => void> = [];

  await Promise.all(
    images.map(async (img) => {
      const originalSrc = img.src;
      if (!originalSrc || originalSrc.startsWith("data:")) return;

      cleanups.push(() => {
        try {
          img.src = originalSrc;
        } catch {
          // ignore
        }
      });

      // 1. Try fetching with CORS
      try {
        const response = await fetch(originalSrc, { mode: "cors", cache: "force-cache" });
        if (response.ok) {
          const blob = await response.blob();
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          img.src = dataUrl;
          return;
        }
      } catch {
        // Direct fetch failed
      }

      // 2. Try drawing onto an in-memory canvas if image is already loaded in DOM
      try {
        if (img.complete && img.naturalWidth > 0) {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth || 96;
          canvas.height = img.naturalHeight || 96;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL("image/png");
            img.src = dataUrl;
            return;
          }
        }
      } catch {
        // Canvas tainted
      }
    })
  );

  return () => {
    cleanups.forEach((fn) => fn());
  };
}

export function useShareCard() {
  const [isExporting, setIsExporting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const generateCardPng = async (cardElement: HTMLElement): Promise<string> => {
    // 1. Ensure all custom fonts are ready before capturing
    if (typeof document !== "undefined" && document.fonts) {
      try {
        await document.fonts.ready;
      } catch (e) {
        // safe fallback
      }
    }

    // 2. Pre-inline external images so html-to-image never triggers CORS/fetch errors
    const restoreImages = await inlineCardImages(cardElement);

    // Strategy 1: html-to-image (Native SVG foreignObject rendering with perfect Bengali ligatures & alignment)
    try {
      let originalDecode: typeof HTMLImageElement.prototype.decode | null = null;
      if (typeof window !== "undefined" && HTMLImageElement.prototype.decode) {
        originalDecode = HTMLImageElement.prototype.decode;
        HTMLImageElement.prototype.decode = function () {
          return originalDecode
            ? originalDecode.call(this).catch(() => Promise.resolve())
            : Promise.resolve();
        };
      }

      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardElement, {
        cacheBust: true,
        skipFonts: false,
        pixelRatio: 2,
        imagePlaceholder: TRANSPARENT_PIXEL,
        style: {
          transform: "none",
          margin: "0",
        },
      });

      if (originalDecode && typeof window !== "undefined") {
        HTMLImageElement.prototype.decode = originalDecode;
      }

      if (dataUrl && dataUrl.length > 500) {
        return dataUrl;
      }
    } catch (h2iError) {
      console.warn("html-to-image issue, falling back to html2canvas:", h2iError);
    } finally {
      restoreImages();
    }

    // Strategy 2: html2canvas fallback
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        width: cardElement.offsetWidth,
        height: cardElement.offsetHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: document.documentElement.offsetWidth,
      });
      const dataUrl = canvas.toDataURL("image/png");
      if (dataUrl && dataUrl.length > 500) {
        return dataUrl;
      }
    } catch (h2cError) {
      console.error("html2canvas fallback failed:", h2cError);
      throw h2cError;
    }

    throw new Error("Failed to export image from both renderers.");
  };

  const downloadImage = useCallback(
    async (cardElement: HTMLElement | null, fileName = "jajabor-certificate.png") => {
      if (!cardElement || isExporting) return;

      try {
        setIsExporting(true);

        const dataUrl = await generateCardPng(cardElement);

        // Convert base64 dataUrl to Blob for reliable cross-browser download
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.download = fileName;
        link.href = blobUrl;
        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
          try {
            if (link.parentNode) {
              link.parentNode.removeChild(link);
            }
            URL.revokeObjectURL(blobUrl);
          } catch (e) {
            // safely ignore cleanup errors
          }
        }, 300);
      } catch (err) {
        console.error("Failed to generate image:", err);
        alert("সনদপত্র ডাউনলোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      } finally {
        setIsExporting(false);
      }
    },
    [isExporting]
  );

  const uploadCertificate = useCallback(
    async (cardElement: HTMLElement | null): Promise<string | null> => {
      if (!cardElement) return null;
      try {
        const dataUrl = await generateCardPng(cardElement);
        const res = await fetch(dataUrl);
        const blob = await res.blob();

        const formData = new FormData();
        formData.append("file", blob, "jajabor-certificate.png");

        const uploadRes = await fetch("/api/share-image", {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const data = await uploadRes.json();
          if (data?.url) {
            return data.url;
          }
        }
      } catch (err) {
        console.warn("Background certificate upload skipped:", err);
      }
      return null;
    },
    []
  );

  const getShareableText = useCallback(
    (
      userProfile: UserProfile,
      districtCount: number,
      rank: TitleRank,
      districtIds: string[],
      memoryCount: number = 0,
      imageUrl?: string | null
    ) => {
      const compareQuery = encodeCompareData(userProfile.name, districtIds);
      const memoryParam = memoryCount > 0 ? `&m=${memoryCount}` : "";
      const imgParam = imageUrl ? `&img=${encodeURIComponent(imageUrl)}` : "";
      const liveLink = `${getBaseUrl()}/compare?${compareQuery}${memoryParam}${imgParam}`;
      const totalScore = calculateTotalScore(districtCount, memoryCount);
      const bonusPoints = calculateBonusPoints(memoryCount);
      const memoryText =
        memoryCount > 0
          ? `\n🎭 ট্যুরের কাণ্ডকারখানা বোনাস: +${toBn(bonusPoints)} পয়েন্ট (${getMemoryRank(memoryCount)})`
          : "";

      return `যাযাবর মিটার ফলাফল!\nআমি (${userProfile.name}) বাংলাদেশের ${toBn(districtCount)}টি জেলায় ভ্রমণ করে "${rank.title}" পদবী অর্জন করেছি!${memoryText}\n\nরিভিউ: "${rank.roast}"\n\nআমার সাথে টেক্কা দেওয়ার সাহস আছে? নিচের লিংকে ঢুকে তোমার যাযাবর মিটার মাপো:\n👉 ${liveLink}\n\n#JajaborMeter #যাযাবরমিটার`;
    },
    []
  );

  const copyShareText = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    },
    []
  );

  const shareNative = useCallback(
    async (
      cardElement: HTMLElement | null,
      shareText: string,
      title = "যাযাবর মিটার সনদপত্র",
      userName = "jajabor"
    ) => {
      if (typeof window === "undefined") return;

      try {
        setIsExporting(true);

        // Always copy caption text first so the user has it in clipboard
        try {
          await navigator.clipboard.writeText(shareText);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 3000);
        } catch (e) {
          // ignore
        }

        // Generate the PNG image
        let file: File | null = null;
        if (cardElement) {
          const dataUrl = await generateCardPng(cardElement);
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          file = new File([blob], `${userName}-jajabor-certificate.png`, {
            type: "image/png",
          });
        }

        // If Web Share API with files is supported (e.g. mobile Chrome, Safari)
        if (navigator.share && file && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title,
            text: shareText,
            files: [file],
          });
          return;
        }

        // If native share with files is not supported (e.g. Desktop browsers):
        // Automatically download the certificate image file AND copy caption!
        if (cardElement) {
          await downloadImage(cardElement, `${userName}-jajabor-certificate.png`);
        }
        alert("সনদপত্রের ছবিটি ডাউনলোড করা হয়েছে এবং ক্যাপশন কপি হয়েছে! এখন সোশ্যাল মিডিয়ায় (Facebook / WhatsApp) ছবিটি পোস্ট করে ক্যাপশন পেস্ট করে দিন।");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Native share error:", err);
          if (cardElement) {
            await downloadImage(cardElement, `${userName}-jajabor-certificate.png`);
          }
          alert("সনদপত্রের ছবিটি ডাউনলোড হয়েছে এবং ক্যাপশন কপি হয়েছে! ফেসবুকে বা মেসেঞ্জারে ছবি ও ক্যাপশন পোস্ট করে দিন।");
        }
      } finally {
        setIsExporting(false);
      }
    },
    [downloadImage]
  );

  return {
    isExporting,
    copySuccess,
    downloadImage,
    uploadCertificate,
    getShareableText,
    copyShareText,
    shareNative,
  };
}
