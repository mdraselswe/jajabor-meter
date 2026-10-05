"use client";

import React, { useState, useRef } from "react";
import { UserProfile } from "@/types";
import { optimizeUserImage } from "@/utils/imageOptimizer";
import UserAvatar from "@/components/auth/UserAvatar";
import { 
  User, 
  Upload, 
  Trash2, 
  Check, 
  X, 
  Sparkles,
  Camera
} from "lucide-react";

interface GuestProfileModalProps {
  isOpen: boolean;
  userProfile: UserProfile;
  onSave: (updated: Partial<UserProfile>) => void;
  onClose: () => void;
}

export default function GuestProfileModal({
  isOpen,
  userProfile,
  onSave,
  onClose,
}: GuestProfileModalProps) {
  const [name, setName] = useState(userProfile.name);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    userProfile.avatarUrl
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const optimizedDataUrl = await optimizeUserImage(file, 240, 0.85);
      setAvatarPreview(optimizedDataUrl);
    } catch (err) {
      console.error("Failed to process image:", err);
      alert("ছবি প্রসেস করতে সমস্যা হয়েছে। অন্য কোনো ছবি দিয়ে চেষ্টা করুন।");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemovePhoto = () => {
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || "অতিথি যাযাবর";
    onSave({
      name: finalName,
      avatarUrl: avatarPreview,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-w-md w-full bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                প্রোফাইল সাজান
              </h3>
              <p className="text-xs text-slate-400">
                সার্টিফিকেটে আপনার নাম ও ছবি বসবে
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar Section */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative group">
              <UserAvatar
                avatarUrl={avatarPreview}
                name={name || "যাযাবর"}
                size={88}
                className="ring-4 ring-slate-800"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg border border-slate-900 transition active:scale-95"
                title="ছবি পরিবর্তন করুন"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Photo Action Buttons */}
            <div className="flex items-center gap-2 mt-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium border border-slate-700 transition"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isProcessing ? "প্রসেস হচ্ছে..." : "ছবি আপলোড করুন"}</span>
              </button>

              {avatarPreview && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-xs text-rose-300 border border-rose-800/50 transition"
                  title="ছবি মুছে ডিফল্ট অবতার ব্যবহার করুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>মুছুন</span>
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 text-center">
              (ছবি না দিলে স্বয়ংক্রিয়ভাবে সানগ্লাস পরা কুল যাযাবর অবতার বসবে)
            </p>
          </div>

          {/* Quick Note about Google Auth & Manual */}
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-300 leading-snug">
            <Sparkles className="w-3.5 h-3.5 inline text-amber-400 mr-1" />
            <strong>টিপস:</strong> আপনি এখানে সরাসরি নিজের যেকোনো ছবি ও নাম দিতে পারেন। লাইভ গুগল লগইন চালু করতে <code className="text-emerald-400 bg-slate-900 px-1 rounded">.env.local</code> ফাইলে ফ্রি Firebase এপিআই কী যুক্ত করলেই হবে।
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              আপনার নাম বা ডাকনাম:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="উদাঃ সাকিব যাযাবর, ফারহান ট্যুরিস্ট..."
              maxLength={30}
              className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition active:scale-95 shadow-lg shadow-emerald-950/40"
            >
              <Check className="w-4 h-4" />
              <span>প্রোফাইল সেভ করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
