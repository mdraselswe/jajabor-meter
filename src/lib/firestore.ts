import fs from "fs";
import path from "path";

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "jajabor-meter";
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBmNtg4L3TJgMe1PktfQqPWuVTH_vN9_Rg";
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

export interface VisitorRecord {
  visitorId: string;
  userType: "logged_in" | "guest";
  name: string;
  avatarUrl: string | null;
  device: "mobile" | "desktop" | "tablet";
  lastVisit: string;
  firstVisit?: string;
  visitCount: number;
  lastPath?: string;
}

export interface AnalyticsSummary {
  totalVisits: number;
  totalUniqueVisitors: number;
  totalLoggedInUsers: number;
  totalGuests: number;
  deviceMobile: number;
  deviceDesktop: number;
  todayVisits: number;
  lastUpdated: string;
  isFirestoreLive: boolean;
}

// Local cache file path for dev/persistence
const CACHE_FILE = path.join(process.cwd(), ".next/visitor-cache.json");

function loadLocalCache(): {
  visitors: Record<string, VisitorRecord>;
  totalVisits: number;
  deviceMobile: number;
  deviceDesktop: number;
  todayVisits: number;
  todayDate: string;
} {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf8");
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return {
    visitors: {},
    totalVisits: 0,
    deviceMobile: 0,
    deviceDesktop: 0,
    todayVisits: 0,
    todayDate: new Date().toISOString().split("T")[0],
  };
}

function saveLocalCache(data: any) {
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch {
    // ignore
  }
}

// Global in-memory instance
let memoryCache = loadLocalCache();

export async function recordVisitor(data: {
  visitorId: string;
  userType: "logged_in" | "guest";
  name?: string;
  avatarUrl?: string | null;
  device: "mobile" | "desktop" | "tablet";
  path?: string;
}): Promise<{ success: boolean; firestoreLive: boolean }> {
  const nowIso = new Date().toISOString();
  const todayStr = nowIso.split("T")[0];

  // 1. Update in-memory & local cache
  const existing = memoryCache.visitors[data.visitorId];
  const visitCount = (existing?.visitCount || 0) + 1;

  const record: VisitorRecord = {
    visitorId: data.visitorId,
    userType: data.userType,
    name: data.name || (data.userType === "logged_in" ? "গুগল পর্যটক" : "অতিথি যাযাবর"),
    avatarUrl: data.avatarUrl || null,
    device: data.device,
    firstVisit: existing?.firstVisit || nowIso,
    lastVisit: nowIso,
    visitCount,
    lastPath: data.path || "/",
  };

  memoryCache.visitors[data.visitorId] = record;
  memoryCache.totalVisits += 1;
  if (data.device === "mobile") memoryCache.deviceMobile += 1;
  else memoryCache.deviceDesktop += 1;

  if (memoryCache.todayDate === todayStr) {
    memoryCache.todayVisits += 1;
  } else {
    memoryCache.todayDate = todayStr;
    memoryCache.todayVisits = 1;
  }

  saveLocalCache(memoryCache);

  // 2. Try Firestore REST API with a strict 2-second timeout (never hangs)
  let firestoreLive = false;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const docUrl = `${FIRESTORE_BASE}/visitors/${encodeURIComponent(data.visitorId)}?key=${API_KEY}`;
    const payload = {
      fields: {
        visitorId: { stringValue: record.visitorId },
        userType: { stringValue: record.userType },
        name: { stringValue: record.name },
        avatarUrl: { stringValue: record.avatarUrl || "" },
        device: { stringValue: record.device },
        lastVisit: { stringValue: record.lastVisit },
        firstVisit: { stringValue: record.firstVisit || nowIso },
        visitCount: { integerValue: String(record.visitCount) },
        lastPath: { stringValue: record.lastPath || "/" },
      },
    };

    const res = await fetch(docUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);
    if (res.ok) {
      firestoreLive = true;
    }
  } catch {
    firestoreLive = false;
  }

  return { success: true, firestoreLive };
}

export async function getAnalytics(): Promise<{
  summary: AnalyticsSummary;
  recentVisitors: VisitorRecord[];
  isFirestoreLive: boolean;
}> {
  let isFirestoreLive = false;

  // 1. Try reading from Firestore REST API
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const listUrl = `${FIRESTORE_BASE}/visitors?key=${API_KEY}&pageSize=50`;
    const res = await fetch(listUrl, {
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (res.ok) {
      const json = await res.json();
      const docs = Array.isArray(json.documents) ? json.documents : [];
      const firestoreVisitors: VisitorRecord[] = docs.map((d: any) => {
        const f = d.fields || {};
        return {
          visitorId: f.visitorId?.stringValue || d.name?.split("/").pop() || "",
          userType: (f.userType?.stringValue as any) || "guest",
          name: f.name?.stringValue || "অতিথি যাযাবর",
          avatarUrl: f.avatarUrl?.stringValue || null,
          device: (f.device?.stringValue as any) || "desktop",
          lastVisit: f.lastVisit?.stringValue || new Date().toISOString(),
          firstVisit: f.firstVisit?.stringValue,
          visitCount: parseInt(f.visitCount?.integerValue || "1", 10),
          lastPath: f.lastPath?.stringValue || "/",
        };
      });

      firestoreVisitors.sort(
        (a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
      );

      const loggedInCount = firestoreVisitors.filter((v) => v.userType === "logged_in").length;
      const guestCount = firestoreVisitors.filter((v) => v.userType === "guest").length;
      const totalVisits = firestoreVisitors.reduce((acc, v) => acc + (v.visitCount || 1), 0);
      const deviceMobile = firestoreVisitors.filter((v) => v.device === "mobile").length;
      const deviceDesktop = firestoreVisitors.filter((v) => v.device !== "mobile").length;

      return {
        summary: {
          totalVisits: totalVisits || memoryCache.totalVisits,
          totalUniqueVisitors: firestoreVisitors.length || Object.keys(memoryCache.visitors).length,
          totalLoggedInUsers: loggedInCount,
          totalGuests: guestCount,
          deviceMobile: deviceMobile || memoryCache.deviceMobile,
          deviceDesktop: deviceDesktop || memoryCache.deviceDesktop,
          todayVisits: firestoreVisitors.length || memoryCache.todayVisits,
          lastUpdated: new Date().toISOString(),
          isFirestoreLive: true,
        },
        recentVisitors: firestoreVisitors.length > 0 ? firestoreVisitors : Object.values(memoryCache.visitors),
        isFirestoreLive: true,
      };
    }
  } catch {
    // fallback to local cache
  }

  // 2. Local cache fallback
  memoryCache = loadLocalCache();
  const visitorsList = Object.values(memoryCache.visitors).sort(
    (a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
  );

  const loggedInCount = visitorsList.filter((v) => v.userType === "logged_in").length;
  const guestCount = visitorsList.filter((v) => v.userType === "guest").length;

  return {
    summary: {
      totalVisits: memoryCache.totalVisits || visitorsList.length,
      totalUniqueVisitors: visitorsList.length,
      totalLoggedInUsers: loggedInCount,
      totalGuests: guestCount,
      deviceMobile: memoryCache.deviceMobile,
      deviceDesktop: memoryCache.deviceDesktop,
      todayVisits: memoryCache.todayVisits || visitorsList.length,
      lastUpdated: new Date().toISOString(),
      isFirestoreLive: false,
    },
    recentVisitors: visitorsList.slice(0, 50),
    isFirestoreLive: false,
  };
}
