"use client";

import React, { useRef, useState, useEffect } from "react";
import { UserProfile, TitleRank, SpecialBadge } from "@/types";
import CertificateCard from "./CertificateCard";
import { useShareCard } from "@/hooks/useShareCard";
import { encodeCompareData, getBaseUrl } from "@/utils/urlEncoder";
import { toBn } from "@/utils/bengaliDigits";
import { 
  Download, 
  Share2, 
  Copy, 
  Check, 
  X, 
  Edit3,
  ExternalLink,
  MessageCircle,
  Send,
  Loader2
} from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  selectedDistrictIds: string[];
  selectedMemoryIds?: string[];
  rank: TitleRank;
  percentage: number;
  unlockedBadges: SpecialBadge[];
  onOpenEditProfile: () => void;
}

export default function ShareModal({
  isOpen,
  onClose,
  userProfile,
  selectedDistrictIds,
  selectedMemoryIds = [],
  rank,
  percentage,
  unlockedBadges,
  onOpenEditProfile,
}: ShareModalProps) {
  // Dedicated pristine export ref (ALWAYS fixed 580px, immune to mobile screen squishing)
  const exportCardRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const previewInnerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [cardHeight, setCardHeight] = useState<number | null>(null);

  const [isDownloading, setIsDownloading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showDistrictNames, setShowDistrictNames] = useState<boolean>(true);
  const [isSharingSocial, setIsSharingSocial] = useState<string | null>(null);

  // Invalidate cached upload whenever districts, profile, or options change
  useEffect(() => {
    setUploadedImageUrl(null);
  }, [selectedDistrictIds, selectedMemoryIds, userProfile.name, userProfile.avatarUrl, rank, showDistrictNames]);

  const handleToggleDistrictNames = (checked: boolean) => {
    setShowDistrictNames(checked);
    setUploadedImageUrl(null);
  };

  const {
    isExporting,
    copySuccess,
    downloadImage,
    uploadCertificate,
    copyShareText,
    shareNative,
  } = useShareCard();

  // Background pre-upload certificate image as soon as modal opens
  useEffect(() => {
    if (!isOpen || uploadedImageUrl) return;

    let isMounted = true;
    const timer = setTimeout(async () => {
      try {
        const targetElement = exportCardRef.current;
        if (targetElement && !uploadedImageUrl) {
          setIsUploading(true);
          const url = await uploadCertificate(targetElement);
          if (isMounted && url) {
            setUploadedImageUrl(url);
          }
        }
      } catch (err) {
        // fallback gracefully
      } finally {
        if (isMounted) setIsUploading(false);
      }
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isOpen, uploadCertificate, uploadedImageUrl]);

  // Smooth responsive scaling for the in-modal preview on smaller screens
  useEffect(() => {
    if (!isOpen) return;

    const updateScale = () => {
      if (previewContainerRef.current) {
        const availableWidth = previewContainerRef.current.offsetWidth;
        const targetWidth = 580;
        if (availableWidth < targetWidth && availableWidth > 0) {
          setPreviewScale(availableWidth / targetWidth);
        } else {
          setPreviewScale(1);
        }
      }
      if (previewInnerRef.current) {
        setCardHeight(previewInnerRef.current.offsetHeight);
      }
    };

    updateScale();
    const timer = setTimeout(updateScale, 80);
    window.addEventListener("resize", updateScale);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateScale);
    };
  }, [isOpen, selectedDistrictIds, selectedMemoryIds, userProfile, rank, showDistrictNames]);

  if (!isOpen) return null;

  const getDynamicLink = (imgUrl?: string | null) => {
    const compareQuery = encodeCompareData(userProfile.name, selectedDistrictIds);
    const memoryParam = selectedMemoryIds && selectedMemoryIds.length > 0 ? `&m=${encodeURIComponent(selectedMemoryIds.join(","))}` : "";
    const activeImg = imgUrl ?? uploadedImageUrl;
    const imgParam = activeImg ? `&img=${encodeURIComponent(activeImg)}` : "";
    const timeParam = `&t=${Date.now()}`;
    return `${getBaseUrl()}/compare?${compareQuery}${memoryParam}${imgParam}${timeParam}`;
  };

  const getDynamicShareText = (imgUrl?: string | null) => {
    const link = getDynamicLink(imgUrl);
    return `যাযাবর মিটার ভ্রমণ ফলাফল!\nআমি (${userProfile.name}) বাংলাদেশের ${toBn(selectedDistrictIds.length)}টি জেলায় ভ্রমণ সম্পন্ন করেছি! পদবী: "${rank.title}"\n\nরিভিউ: "${rank.roast}"\n\nআমার ঘুরে দেখা জেলা ও ভ্রমণ সারাংশ দেখতে নিচের লিংকে চাপুন:\n👉 ${link}\n\n#JajaborMeter #যাযাবরমিটার`;
  };

  const ensureUploadedImage = async (): Promise<string | null> => {
    if (uploadedImageUrl) return uploadedImageUrl;
    const targetElement = exportCardRef.current;
    if (!targetElement) return null;
    try {
      setIsUploading(true);
      const uploadPromise = uploadCertificate(targetElement);
      // Give upload max 3.5s so social sharing popup is never hung by slow networks
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3500));
      const url = await Promise.race([uploadPromise, timeoutPromise]);
      if (url) {
        setUploadedImageUrl(url);
        return url;
      }
    } catch {
      // ignore
    } finally {
      setIsUploading(false);
    }
    return null;
  };

  const handleDownload = async () => {
    if (isDownloading || isExporting) return;
    try {
      setIsDownloading(true);
      const targetElement = exportCardRef.current;
      if (!targetElement) return;
      const safeName = (userProfile.name || "jajabor").trim().replace(/[\s/\\?%*:|"<>]+/g, "-");
      await downloadImage(targetElement, `${safeName}-jajabor-certificate.png`);
    } catch (e) {
      console.error("Certificate download caught error:", e);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleNativeShare = async () => {
    try {
      setIsSharingSocial("native");
      const targetElement = exportCardRef.current;
      if (!targetElement) return;
      const activeUrl = await ensureUploadedImage();
      const currentShareText = getDynamicShareText(activeUrl);
      const safeName = (userProfile.name || "jajabor").trim().replace(/[\s/\\?%*:|"<>]+/g, "-");
      await shareNative(targetElement, currentShareText, "যাযাবর মিটার সনদপত্র", safeName);
    } catch (e) {
      console.error("Native share caught error:", e);
    } finally {
      setIsSharingSocial(null);
    }
  };

  const handleWhatsAppShare = async () => {
    try {
      setIsSharingSocial("wa");
      const activeUrl = await ensureUploadedImage();
      const currentShareText = getDynamicShareText(activeUrl);
      window.open(`https://wa.me/?text=${encodeURIComponent(currentShareText)}`, "_blank");
    } finally {
      setIsSharingSocial(null);
    }
  };

  const handleFacebookShare = async () => {
    try {
      setIsSharingSocial("fb");
      const activeUrl = await ensureUploadedImage();
      const link = getDynamicLink(activeUrl);
      const currentShareText = getDynamicShareText(activeUrl);
      copyShareText(currentShareText);
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}&quote=${encodeURIComponent(currentShareText)}`,
        "_blank"
      );
    } finally {
      setIsSharingSocial(null);
    }
  };

  const handleTelegramShare = async () => {
    try {
      setIsSharingSocial("tg");
      const activeUrl = await ensureUploadedImage();
      const link = getDynamicLink(activeUrl);
      const currentShareText = getDynamicShareText(activeUrl);
      window.open(
        `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(currentShareText)}`,
        "_blank"
      );
    } finally {
      setIsSharingSocial(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      {/* Offscreen Fixed-Width Pristine Export Element (Always 580px, zero line wrap or padding break) */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          left: "-9999px",
          top: "-9999px",
          width: "580px",
          minWidth: "580px",
          maxWidth: "580px",
          pointerEvents: "none",
          zIndex: -999,
          opacity: 1,
          visibility: "visible",
        }}
      >
        <CertificateCard
          cardRef={exportCardRef}
          userProfile={userProfile}
          selectedDistrictIds={selectedDistrictIds}
          selectedMemoryIds={selectedMemoryIds}
          rank={rank}
          percentage={percentage}
          unlockedBadges={unlockedBadges}
          showDistrictNames={showDistrictNames}
        />
      </div>

      <div className="min-h-full flex items-center justify-center py-6 sm:py-10">
        <div className="relative max-w-2xl w-full bg-slate-900 border border-slate-700 rounded-3xl p-4 sm:p-6 shadow-2xl my-auto animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-slate-800">
          <div>
            <h3 className="font-black text-white text-base sm:text-lg">
              ভ্রমণ সনদপত্র ও শেয়ার
            </h3>
            <p className="text-xs text-slate-300">
              সনদ ডাউনলোড করুন এবং বন্ধুদের সাথে শেয়ার করে যাযাবর লড়াইয়ে নামুন!
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: District Names Toggle Checkbox & Quick Edit Profile */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 px-1">
          <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 cursor-pointer select-none transition active:scale-95 shadow-sm">
            <input
              type="checkbox"
              checked={showDistrictNames}
              onChange={(e) => handleToggleDistrictNames(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-600 focus:ring-0 cursor-pointer accent-emerald-500"
            />
            <span>ম্যাপে জেলার নাম দেখান</span>
          </label>

          <button
            onClick={() => {
              onClose();
              onOpenEditProfile();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 font-semibold border border-slate-700 transition cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>নাম/ছবি পরিবর্তন</span>
          </button>
        </div>

        {/* Certificate Preview Card: Scaled smoothly so mobile preview never wraps or squishes */}
        <div ref={previewContainerRef} className="w-full flex justify-center mb-4 overflow-hidden">
          <div
            style={{
              width: "580px",
              transform: `scale(${previewScale})`,
              transformOrigin: "top center",
              height: cardHeight ? `${cardHeight * previewScale}px` : "auto",
              transition: "transform 0.15s ease-out",
            }}
          >
            <div ref={previewInnerRef}>
              <CertificateCard
                userProfile={userProfile}
                selectedDistrictIds={selectedDistrictIds}
                selectedMemoryIds={selectedMemoryIds}
                rank={rank}
                percentage={percentage}
                unlockedBadges={unlockedBadges}
                showDistrictNames={showDistrictNames}
              />
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading || isExporting}
            className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-sm transition shadow-lg ${
              isDownloading || isExporting
                ? "bg-emerald-800 text-slate-300 cursor-not-allowed opacity-80"
                : "bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 shadow-emerald-950/40 cursor-pointer"
            }`}
          >
            {isDownloading || isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>ডাউনলোড হচ্ছে...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>এইচডি (HD) সনদ ডাউনলোড</span>
              </>
            )}
          </button>

          {/* Native Mobile Share Button */}
          <button
            onClick={handleNativeShare}
            disabled={isExporting || isDownloading}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition active:scale-95 shadow-lg shadow-amber-950/40 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <Share2 className="w-4 h-4 text-slate-950" />
            <span>মোবাইলে সরাসরি শেয়ার</span>
          </button>
        </div>

        {/* Tip: Social Sharing explanation */}
        <div className="mb-3 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-300 text-center">
          ফেসবুক, হোয়াটসঅ্যাপ বা টেলিগ্রাম বাটনে চাপ দিলে সরাসরি ক্যাপশন ও চ্যালেঞ্জ লিঙ্ক সহ পোস্ট হবে।
        </div>

        {/* Social Sharing Shortcuts */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-slate-800">
          {/* Copy Caption & Link */}
          <button
            onClick={async () => {
              const activeUrl = await ensureUploadedImage();
              copyShareText(getDynamicShareText(activeUrl));
            }}
            disabled={!!isSharingSocial}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold border border-slate-700 transition cursor-pointer"
          >
            {copySuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">ক্যাপশন কপি হয়েছে!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>ক্যাপশন ও লিংক কপি</span>
              </>
            )}
          </button>

          {/* WhatsApp */}
          <button
            onClick={handleWhatsAppShare}
            disabled={!!isSharingSocial}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 text-xs font-bold border border-emerald-700/60 transition cursor-pointer"
          >
            {isSharingSocial === "wa" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            ) : (
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>WhatsApp</span>
          </button>

          {/* Facebook */}
          <button
            onClick={handleFacebookShare}
            disabled={!!isSharingSocial}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-950/80 hover:bg-blue-900 text-blue-200 text-xs font-bold border border-blue-700/60 transition cursor-pointer"
          >
            {isSharingSocial === "fb" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-300" />
            ) : null}
            <span>Facebook</span>
          </button>

          {/* Telegram */}
          <button
            onClick={handleTelegramShare}
            disabled={!!isSharingSocial}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-950/80 hover:bg-sky-900 text-sky-200 text-xs font-bold border border-sky-700/60 transition cursor-pointer"
          >
            {isSharingSocial === "tg" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-300" />
            ) : (
              <Send className="w-3.5 h-3.5 text-sky-400" />
            )}
            <span>Telegram</span>
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
