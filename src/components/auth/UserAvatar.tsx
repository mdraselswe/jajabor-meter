"use client";

import React, { useState } from "react";
import { Compass, Sparkles } from "lucide-react";

interface UserAvatarProps {
  avatarUrl: string | null;
  name: string;
  size?: number;
  className?: string;
}

export default function UserAvatar({
  avatarUrl,
  name,
  size = 56,
  className = "",
}: UserAvatarProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  const hasValidImage = Boolean(avatarUrl && avatarUrl !== failedUrl);

  if (hasValidImage && avatarUrl) {
    return (
      <div
        className={`relative rounded-full overflow-hidden border-2 border-emerald-400/80 shadow-lg shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarUrl}
          alt={name}
          crossOrigin="anonymous"
          loading="eager"
          decoding="sync"
          onError={() => setFailedUrl(avatarUrl)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Cool Default SVG Backpacker Avatar
  return (
    <div
      className={`relative rounded-full bg-gradient-to-tr from-emerald-800 via-teal-700 to-amber-600 border-2 border-amber-400/80 flex items-center justify-center text-white shadow-lg shrink-0 ${className}`}
      style={{ width: size, height: size }}
      title={`${name} (ডিফল্ট যাযাবর অবতার)`}
    >
      <Compass
        className="w-1/2 h-1/2 text-amber-200 animate-spin"
        style={{ animationDuration: "20s" }}
      />
      <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-slate-900 border border-slate-700">
        <Sparkles className="w-3 h-3 text-emerald-400" />
      </div>
    </div>
  );
}
