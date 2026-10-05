"use client";

import { useState, useEffect, useCallback } from "react";
import { UserProfile } from "@/types";

const STORAGE_KEY = "jajabor_meter_state_v1";

interface StoredData {
  selectedDistrictIds: string[];
  selectedMemoryIds: string[];
  userProfile: UserProfile;
}

const DEFAULT_PROFILE: UserProfile = {
  name: "অতিথি যাযাবর",
  avatarUrl: null,
  isLoggedIn: false,
};

export function useJajaborStore() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedDistrictIds, setSelectedDistrictIds] = useState<string[]>([]);
  const [selectedMemoryIds, setSelectedMemoryIds] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: StoredData = JSON.parse(raw);
        if (Array.isArray(parsed.selectedDistrictIds)) {
          setSelectedDistrictIds(parsed.selectedDistrictIds);
        }
        if (Array.isArray(parsed.selectedMemoryIds)) {
          setSelectedMemoryIds(parsed.selectedMemoryIds);
        }
        if (parsed.userProfile && typeof parsed.userProfile === "object") {
          setUserProfile(parsed.userProfile);
        }
      }
    } catch (e) {
      console.warn("Failed to load Jajabor store from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const dataToSave: StoredData = {
        selectedDistrictIds,
        selectedMemoryIds,
        userProfile,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.warn("Failed to persist Jajabor store to localStorage", e);
    }
  }, [selectedDistrictIds, selectedMemoryIds, userProfile, isLoaded]);

  const toggleDistrict = useCallback((districtId: string) => {
    setSelectedDistrictIds((prev) =>
      prev.includes(districtId)
        ? prev.filter((id) => id !== districtId)
        : [...prev, districtId]
    );
  }, []);

  const addDistrict = useCallback((districtId: string) => {
    setSelectedDistrictIds((prev) =>
      prev.includes(districtId) ? prev : [...prev, districtId]
    );
  }, []);

  const removeDistrict = useCallback((districtId: string) => {
    setSelectedDistrictIds((prev) => prev.filter((id) => id !== districtId));
  }, []);

  const resetAllDistricts = useCallback(() => {
    setSelectedDistrictIds([]);
  }, []);

  const toggleMemory = useCallback((memoryId: string) => {
    setSelectedMemoryIds((prev) =>
      prev.includes(memoryId)
        ? prev.filter((id) => id !== memoryId)
        : [...prev, memoryId]
    );
  }, []);

  const updateProfile = useCallback((profile: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profile }));
  }, []);

  return {
    isLoaded,
    selectedDistrictIds,
    selectedMemoryIds,
    userProfile,
    toggleDistrict,
    addDistrict,
    removeDistrict,
    resetAllDistricts,
    toggleMemory,
    updateProfile,
    setSelectedDistrictIds,
  };
}
