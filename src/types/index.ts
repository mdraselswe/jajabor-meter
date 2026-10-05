export interface District {
  id: string;
  nameEn: string;
  nameBn: string;
  divisionEn: string;
  divisionBn: string;
  food: string;
  fact: string;
  path: string;
}

export interface UserProfile {
  name: string;
  avatarUrl: string | null;
  isLoggedIn: boolean;
}

export interface PhaporQuizOption {
  text: string;
  isLegit: boolean;
  roastReply: string;
}

export interface PhaporQuiz {
  districtId: string;
  question: string;
  options: PhaporQuizOption[];
}

export interface SpecialBadge {
  id: string;
  title: string;
  description: string;
  iconName: string; // Lucide icon name
  requiredDistricts: string[];
}

export interface TourMemory {
  id: string;
  text: string;
  category: "planning" | "photo" | "food" | "adventure";
}

export interface TitleRank {
  min: number;
  max: number;
  title: string;
  roast: string;
}
