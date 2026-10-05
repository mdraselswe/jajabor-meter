"use client";

import { useState } from "react";
import { UserProfile } from "@/types";

const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBmNtg4L3TJgMe1PktfQqPWuVTH_vN9_Rg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "jajabor-meter.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "jajabor-meter",
};

export function useAuth(
  onProfileUpdate: (profile: Partial<UserProfile>) => void,
  onOpenProfileModal?: () => void
) {
  const [isLoading, setIsLoading] = useState(false);

  const loginWithGoogle = async () => {
    if (typeof window === "undefined") return;

    try {
      setIsLoading(true);

      const { initializeApp, getApps } = await import("firebase/app");
      const { getAuth, signInWithPopup, GoogleAuthProvider } = await import("firebase/auth");

      const app = getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApps()[0];
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const profileData = {
          name: user.displayName || "গুগল পর্যটক",
          avatarUrl: user.photoURL || null,
          isLoggedIn: true,
        };
        onProfileUpdate(profileData);

        // Notify VisitorTracker immediately so dashboard updates in real-time
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("jajabor_auth_state_changed", {
              detail: profileData,
            })
          );
        }
      }
    } catch (error: any) {
      console.error("Google sign-in error:", error);

      // User closed popup deliberately
      if (
        error?.code === "auth/popup-closed-by-user" ||
        error?.code === "auth/cancelled-popup-request"
      ) {
        return;
      }

      if (error?.code === "auth/unauthorized-domain") {
        alert(
          "ডোমেইন পারমিশন প্রয়োজন!\nFirebase Console -> Authentication -> Settings -> Authorized domains-এ 'jajabor.mdrasel.site' যোগ করতে হবে।"
        );
        return;
      }

      if (error?.code === "auth/operation-not-allowed") {
        alert(
          "গুগল প্রোভাইডার চালু নেই!\nFirebase Console -> Authentication -> Sign-in method-এ গিয়ে 'Google' এনাবল করুন।"
        );
        return;
      }

      if (error?.code === "auth/popup-blocked") {
        alert("ব্রাউজারে পপ-আপ ব্লক করা আছে। ব্রাউজার সেটিংসে পপ-আপ অ্যালাউ করে আবার চেষ্টা করুন।");
        return;
      }

      alert(`গুগল লগইনে সমস্যা হয়েছে (${error?.code || error?.message || "অজানা সমস্যা"})। আপনি সরাসরি নাম ও ছবি আপলোড করে এগিয়ে যেতে পারেন।`);
      if (onOpenProfileModal) {
        onOpenProfileModal();
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

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("jajabor_auth_state_changed", {
          detail: {
            name: "অতিথি যাযাবর",
            avatarUrl: null,
            isLoggedIn: false,
          },
        })
      );
    }
  };

  return {
    loginWithGoogle,
    logout,
    isLoading,
  };
}
