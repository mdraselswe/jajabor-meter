import { District } from "@/data/districts";

export const DISTRICT_ALIASES: Record<string, string[]> = {
  chattogram: ["chittagong", "ctg", "চট্রগ্রাম", "চিটাগং", "চিটাগাং"],
  cumilla: ["comilla", "কুমিল্লা"],
  jashore: ["jessore", "যশোর"],
  bogura: ["bogra", "বগুরা", "বগুড়া"],
  barisal: ["barishal", "বরিশাল"],
  "coxs-bazar": ["cox", "coxsbazar", "coxs bazar", "cox's bazar", "কক্সবাজার", "কক্স বাজার"],
  brahmanbaria: ["bbaria", "b-baria", "বিবাড়িয়া", "বি-বাড়িয়া", "ব্রাহ্মণবাড়িয়া"],
  chapainawabganj: ["chapai", "nawabganj", "chapai nawabganj", "চাঁপাইনবাবগঞ্জ", "চাপাইনবাবগঞ্জ", "নবাবগঞ্জ"],
  netrokona: ["netrakona", "নেত্রকোনা", "নেত্রকোণা"],
  lakshmipur: ["laxmipur", "লক্ষীপুর", "লক্ষ্মীপুর"],
  moulvibazar: ["maulvibazar", "moulavibazar", "মৌলভীবাজার", "মৌলভী বাজার"],
  munshiganj: ["bikrampur", "বিক্রমপুর"],
  khagrachhari: ["khagrachari", "খাগড়াছড়ি"],
  habiganj: ["hobiganj", "হবিগঞ্জ"],
  sunamganj: ["সুনামগঞ্জ"],
  narayanganj: ["নারায়ণগঞ্জ", "নারায়নগঞ্জ"],
  shariatpur: ["শরীয়তপুর", "শরীয়তপুর"],
  rajbari: ["রাজবাড়ি", "রাজবাড়ী"],
  nilphamari: ["নিলফামারী", "নীলফামারী"],
  panchagarh: ["পঞ্চগড়", "পঞ্চগর"],
  kurigram: ["কুড়িগ্রাম", "কুরিগ্রাম"],
};

export function normalizeBangla(str: string): string {
  return str
    .replace(/[ঁ]/g, "")
    .replace(/[ড়ঢ়]/g, "র")
    .replace(/[ী]/g, "ি")
    .replace(/[ূ]/g, "ু")
    .replace(/ট্র/g, "ট্ট");
}

export function cleanSearchStr(s: string): string {
  return s.toLowerCase().replace(/[\s\-_'"`]/g, "");
}

/**
 * Searches district by either English or Bangla name, ID, division, or common spelling aliases.
 */
export function matchesDistrictSearch(district: District, query: string): boolean {
  const q = query.trim();
  if (!q) return true;

  const qLower = q.toLowerCase();
  const qClean = cleanSearchStr(q);
  const qBnNorm = normalizeBangla(q);

  // 1. Direct English & ID match
  if (district.nameEn.toLowerCase().includes(qLower)) return true;
  if (district.id.toLowerCase().includes(qLower)) return true;
  if (cleanSearchStr(district.nameEn).includes(qClean)) return true;
  if (cleanSearchStr(district.id).includes(qClean)) return true;

  // 2. Direct Bangla match
  if (district.nameBn.includes(q)) return true;
  if (cleanSearchStr(district.nameBn).includes(qClean)) return true;

  // 3. Fuzzy Bangla match
  if (normalizeBangla(district.nameBn).includes(qBnNorm)) return true;

  // 4. Division match
  if (district.divisionEn.toLowerCase().includes(qLower)) return true;
  if (district.divisionBn.includes(q)) return true;
  if (normalizeBangla(district.divisionBn).includes(qBnNorm)) return true;

  // 5. Aliases match
  const aliases = DISTRICT_ALIASES[district.id];
  if (aliases) {
    for (const alias of aliases) {
      if (alias.toLowerCase().includes(qLower)) return true;
      if (cleanSearchStr(alias).includes(qClean)) return true;
      if (normalizeBangla(alias).includes(qBnNorm)) return true;
    }
  }

  return false;
}
