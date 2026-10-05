"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Avoid tracking admin page visits as guest/user metrics
    if (pathname.startsWith("/admin")) return;

    try {
      // 1. Get or create persistent visitor ID
      let visitorId = localStorage.getItem("jajabor_visitor_id");
      if (!visitorId) {
        visitorId = `v_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
        localStorage.setItem("jajabor_visitor_id", visitorId);
      }

      // 2. Check user profile in localStorage (synced by useAuth / profile modal)
      let userType: "guest" | "logged_in" = "guest";
      let userName = "অতিথি যাযাবর";
      let avatarUrl: string | null = null;

      try {
        const storedProfile = localStorage.getItem("jajabor_user_profile");
        if (storedProfile) {
          const parsed = JSON.parse(storedProfile);
          if (parsed.isLoggedIn) {
            userType = "logged_in";
            userName = parsed.name || "গুগল পর্যটক";
            avatarUrl = parsed.avatarUrl || null;
            // For logged-in users, use user-specific identifier if available
            if (parsed.id) {
              visitorId = `user_${parsed.id}`;
            }
          } else if (parsed.name && parsed.name !== "অতিথি যাযাবর") {
            userName = parsed.name;
            avatarUrl = parsed.avatarUrl || null;
          }
        }
      } catch {
        // ignore JSON parse errors
      }

      // 3. Detect device
      const isMobile =
        window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const device = isMobile ? "mobile" : "desktop";

      // 4. Send tracking ping
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
      }).catch(() => {
        // silently ignore network errors for tracker
      });
    } catch {
      // safe fallback
    }
  }, [pathname]);

  return null;
}
