"use client";

import { useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "jajabor_meter_state_v1";

const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBmNtg4L3TJgMe1PktfQqPWuVTH_vN9_Rg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "jajabor-meter.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "jajabor-meter",
};

export default function VisitorTracker() {
  const pathname = usePathname();

  const sendTrackingPing = useCallback(
    (override?: { isLoggedIn: boolean; name: string; avatarUrl: string | null }) => {
      if (typeof window === "undefined") return;
      if (pathname && pathname.startsWith("/admin")) return;

      try {
        // 1. Get or create persistent visitor ID
        let visitorId = localStorage.getItem("jajabor_visitor_id");
        if (!visitorId) {
          visitorId = `v_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
          localStorage.setItem("jajabor_visitor_id", visitorId);
        }

        // 2. Determine auth state from override or localStorage (jajabor_meter_state_v1)
        let userType: "guest" | "logged_in" = "guest";
        let userName = "অতিথি যাযাবর";
        let avatarUrl: string | null = null;

        if (override) {
          userType = override.isLoggedIn ? "logged_in" : "guest";
          userName = override.name || (override.isLoggedIn ? "গুগল পর্যটক" : "অতিথি যাযাবর");
          avatarUrl = override.avatarUrl;
        } else {
          try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
              const state = JSON.parse(raw);
              if (state.userProfile?.isLoggedIn) {
                userType = "logged_in";
                userName = state.userProfile.name || "গুগল পর্যটক";
                avatarUrl = state.userProfile.avatarUrl || null;
              }
            }
          } catch {
            // ignore JSON error
          }
        }

        // 3. Detect device
        const isMobile =
          window.innerWidth < 768 ||
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const device = isMobile ? "mobile" : "desktop";

        // 4. Send tracking ping to server
        fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visitorId,
            userType,
            name: userName,
            avatarUrl,
            device,
            path: pathname || "/",
          }),
          keepalive: true,
        }).catch(() => {});
      } catch {
        // safe fallback
      }
    },
    [pathname]
  );

  useEffect(() => {
    // 1. Initial tracking on route change
    sendTrackingPing();

    // 2. Listen to Firebase Auth state on client mount (detects persistent Google login session)
    let unsubscribe: (() => void) | undefined;
    (async () => {
      try {
        const { initializeApp, getApps } = await import("firebase/app");
        const { getAuth, onAuthStateChanged } = await import("firebase/auth");
        const app = getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApps()[0];
        const auth = getAuth(app);
        unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            sendTrackingPing({
              isLoggedIn: true,
              name: user.displayName || "গুগল পর্যটক",
              avatarUrl: user.photoURL || null,
            });
          }
        });
      } catch {
        // ignore
      }
    })();

    // 3. Listen to instant custom login event dispatched by useAuth
    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        sendTrackingPing({
          isLoggedIn: Boolean(customEvent.detail.isLoggedIn),
          name: customEvent.detail.name,
          avatarUrl: customEvent.detail.avatarUrl,
        });
      }
    };
    window.addEventListener("jajabor_auth_state_changed", handleAuthChange);

    return () => {
      window.removeEventListener("jajabor_auth_state_changed", handleAuthChange);
      if (unsubscribe) unsubscribe();
    };
  }, [pathname, sendTrackingPing]);

  return null;
}
