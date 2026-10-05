"use client";

import { useState, useRef, useCallback } from "react";

export function useSpeedDetector(maxClicks = 5, windowMs = 3000) {
  const [isSpeedAlertOpen, setIsSpeedAlertOpen] = useState(false);
  const clickTimestampsRef = useRef<number[]>([]);

  const registerClick = useCallback((): boolean => {
    const now = Date.now();
    // Filter timestamps within window
    clickTimestampsRef.current = clickTimestampsRef.current.filter(
      (ts) => now - ts < windowMs
    );
    clickTimestampsRef.current.push(now);

    if (clickTimestampsRef.current.length >= maxClicks) {
      setIsSpeedAlertOpen(true);
      clickTimestampsRef.current = []; // Reset after firing
      return true; // Speed alert triggered
    }
    return false;
  }, [maxClicks, windowMs]);

  const closeSpeedAlert = useCallback(() => {
    setIsSpeedAlertOpen(false);
  }, []);

  return {
    isSpeedAlertOpen,
    registerClick,
    closeSpeedAlert,
  };
}
