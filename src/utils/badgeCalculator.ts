import { SPECIAL_BADGES } from "@/data/specialBadges";
import { SpecialBadge } from "@/types";

export function getUnlockedBadges(selectedDistrictIds: string[]): SpecialBadge[] {
  return SPECIAL_BADGES.filter((badge) =>
    badge.requiredDistricts.every((reqId) => selectedDistrictIds.includes(reqId))
  );
}
