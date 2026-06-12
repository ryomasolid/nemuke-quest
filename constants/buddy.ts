// constants/buddy.ts
// レベルに応じて進化する相棒キャラと称号
export interface BuddyStage {
  minLevel: number;
  emoji: string;
  title: string;
}

export const BUDDY_STAGES: BuddyStage[] = [
  { minLevel: 1, emoji: "🐣", title: "見習い覚醒者" },
  { minLevel: 5, emoji: "🐥", title: "目覚めの戦士" },
  { minLevel: 10, emoji: "🦉", title: "睡魔ハンター" },
  { minLevel: 20, emoji: "🦅", title: "覚醒の騎士" },
  { minLevel: 30, emoji: "🐉", title: "不眠の竜騎士" },
  { minLevel: 50, emoji: "👑", title: "覚醒王" },
];

export const getBuddyStage = (level: number): BuddyStage => {
  let stage = BUDDY_STAGES[0];
  for (const s of BUDDY_STAGES) {
    if (level >= s.minLevel) stage = s;
  }
  return stage;
};

// 次の進化までのレベル（最終進化なら null）
export const getNextStage = (level: number): BuddyStage | null => {
  return BUDDY_STAGES.find((s) => s.minLevel > level) ?? null;
};
