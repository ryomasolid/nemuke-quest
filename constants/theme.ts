// constants/theme.ts
// アプリ全体のデザイントークン（2026ダークグラス調）
export const COLORS = {
  background: "#0B0F1E",
  surface: "#161B2E",
  surfaceLight: "#232B4A",
  border: "rgba(255, 255, 255, 0.08)",
  primary: "#7C6CFF",
  primaryDark: "#5B4BD6",
  accent: "#34D399",
  gold: "#FBBF24",
  danger: "#F87171",
  fire: "#FB923C",
  text: "#F1F5F9",
  textMuted: "#94A3B8",
  textFaint: "#5A6478",
};

export const GRADIENTS = {
  card: ["#1B2240", "#141A30"] as const,
  primary: ["#7C6CFF", "#4F8EF7"] as const,
  demon: ["#3B1D4F", "#1E1230"] as const,
  hp: ["#F87171", "#DC2626"] as const,
};

export const RADIUS = {
  sm: 10,
  md: 16,
  lg: 24,
};
