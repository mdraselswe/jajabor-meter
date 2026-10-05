"use client";

import { useState } from "react";
import { UserProfile } from "@/types";

export function useAuth(
  onProfileUpdate: (profile: Partial<UserProfile>) => void,
  onOpenProfileModal?: () => void
) {
  const [isLoading, setIsLoading] = useState(false);

  const loginWithGoogle = async () => {
    if (typeof window === "undefined") return;

    try {
      setIsLoading(true);

      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim();

      // If Firebase credentials are not yet added or are empty/placeholder
      if (!apiKey || apiKey === "your_api_key_here" || apiKey.includes("AIzaSyBmNtg4L3TJgMe1PktfQqPWuVTH")) {
        if (onOpenProfileModal) {
          onOpenProfileModal();
        } else {
          onProfileUpdate({
            name: "গুগল যাযাবর",
            avatarUrl: null,
            isLoggedIn: true,
          });
        }
        return;
      }

      // If Firebase credentials exist, run live Google Sign-in
      const { initializeApp, getApps } = await import("firebase/app");
      const { getAuth, signInWithPopup, GoogleAuthProvider } = await import("firebase/auth");

      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      };

      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        onProfileUpdate({
          name: user.displayName || "গুগল পর্যটক",
          avatarUrl: user.photoURL || null,
          isLoggedIn: true,
        });
      }
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      // If user closed the popup deliberately, don't show any error
      if (error?.code === "auth/popup-closed-by-user" || error?.code === "auth/cancelled-popup-request") {
        return;
      }

      // If domain unauthorized or credentials invalid, open profile customizer modal so user is not blocked
      if (onOpenProfileModal) {
        onOpenProfileModal();
      } else {
        onProfileUpdate({
          name: "যাচাইকৃত যাযাবর",
          avatarUrl: null,
          isLoggedIn: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    onProfileUpdate({
      name: "অতিথি যাযাবর",
      avatarUrl: null,
      isLoggedIn: false,
    });
  };

  return {
    loginWithGoogle,
    logout,
    isLoading,
  };
}
