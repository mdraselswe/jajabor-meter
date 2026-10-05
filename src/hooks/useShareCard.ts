"use client";

import { useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { UserProfile, TitleRank } from "@/types";
import { encodeCompareData, getBaseUrl } from "@/utils/urlEncoder";
import { toBn } from "@/utils/bengaliDigits";

const TRANSPARENT_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAEDEB/0wAAAABJRU5ErkJggg==";

export function useShareCard() {
  const [isExporting, setIsExporting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const generateCardPng = async (cardElement: HTMLElement): Promise<string> => {
    // Strategy 1: html2canvas (Direct DOM-to-Canvas rendering, immune to foreignObject SVG decode errors)
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });
      const dataUrl = canvas.toDataURL("image/png");
      if (dataUrl && dataUrl.length > 500) {
        return dataUrl;
      }
    } catch (h2cError) {
      console.warn("html2canvas issue, falling back to html-to-image:", h2cError);
    }

    // Strategy 2: html-to-image with decode unhandled rejection safeguard
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
        cacheBust: false,
        skipFonts: true,
        pixelRatio: 2,
        imagePlaceholder: TRANSPARENT_PIXEL,
        style: {
          transform: "none",
          margin: "0",
          position: "static",
          maxHeight: "none",
          maxWidth: "none",
          overflow: "visible",
        },
      });

      if (originalDecode && typeof window !== "undefined") {
        HTMLImageElement.prototype.decode = originalDecode;
      }

      return dataUrl;
    } catch (h2iError) {
      console.error("html-to-image fallback failed:", h2iError);
      throw h2iError;
    }
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

  const getShareableText = useCallback(
    (userProfile: UserProfile, districtCount: number, rank: TitleRank, districtIds: string[]) => {
      const compareQuery = encodeCompareData(userProfile.name, districtIds);
      const liveLink = `${getBaseUrl()}/compare?${compareQuery}`;

      return `যাযাবর মিটার ফলাফল!\nআমি (${userProfile.name}) বাংলাদেশের ${toBn(districtCount)}টি জেলায় ভ্রমণ করে "${rank.title}" পদবী পেয়েছি!\n\nরিভিউ: "${rank.roast}"\n\nআমার সাথে টেক্কা দেওয়ার সাহস আছে? নিচের লিংকে ঢুকে তোমার যাযাবর মিটার মাপো:\n👉 ${liveLink}\n\n#JajaborMeter #যাযাবরমিটার`;
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
    getShareableText,
    copyShareText,
    shareNative,
  };
}
