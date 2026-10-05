export function getBaseUrl(): string {
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }
  return "https://jajabor.mdrasel.site";
}

export function encodeCompareData(name: string, districtIds: string[]): string {
  const params = new URLSearchParams();
  params.set("n", (name || "যাযাবর বন্ধু").trim());
  params.set("d", districtIds.join(","));
  return params.toString();
}

export function decodeCompareData(search: string): {
  name: string;
  districtIds: string[];
} {
  if (!search) {
    return { name: "", districtIds: [] };
  }

  let text = search.trim();

  // If text contains a URL (e.g. from copied full share message), extract that URL
  const urlMatch = text.match(/https?:\/\/[^\s]+/i);
  if (urlMatch) {
    text = urlMatch[0];
  }

  // Remove trailing punctuation, quotes, or markdown brackets
  text = text.replace(/[)\]'",.]+$/, "");

  // Remove hash/fragment if any
  if (text.includes("#")) {
    text = text.split("#")[0];
  }

  // Handle full URL ("https://.../compare?n=..."), query string ("?n=..."), or bare query ("n=...")
  let queryString = text;
  if (queryString.includes("?")) {
    queryString = queryString.split("?")[1] || "";
  }

  // If there's whitespace left, take first segment
  queryString = queryString.split(/\s+/)[0];

  const params = new URLSearchParams(queryString);
  let rawName = params.get("n") || "";

  // If the parameter was URI-encoded (e.g. from external share or legacy encoder)
  try {
    if (rawName.includes("%")) {
      rawName = decodeURIComponent(rawName);
    }
  } catch (e) {
    // fallback
  }

  const rawDistricts = params.get("d") || "";
  const districtIds = rawDistricts
    ? rawDistricts
        .split(",")
        .map((id) => id.trim().toLowerCase().replace(/[^a-z0-9_-]/g, ""))
        .filter(Boolean)
    : [];

  return {
    name: rawName.trim(),
    districtIds,
  };
}
