// achievements.ts
import { Achievement } from "./types";

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "LEVEL_5",
    title: "覚醒の始まり",
    description: "レベル5に到達する",
    condition: (state) => state.level >= 5,
  },
  {
    id: "LEVEL_10",
    title: "睡魔ハンター",
    description: "レベル10に到達する",
    condition: (state) => state.level >= 10,
  },
  {
    id: "LEVEL_20",
    title: "覚醒の騎士",
    description: "レベル20に到達する",
    condition: (state) => state.level >= 20,
  },
  {
    id: "COMPLETE_10_QUESTS",
    title: "クエスト初心者",
    description: "クエストを10回達成する",
    condition: (state) => state.questsCompleted >= 10,
  },
  {
    id: "COMPLETE_50_QUESTS",
    title: "クエストマスター",
    description: "クエストを50回達成する",
    condition: (state) => state.questsCompleted >= 50,
  },
  {
    id: "EARN_100_GOLD",
    title: "小さな富",
    description: "合計100ゴールドを獲得する（累計ではなく所持金）",
    condition: (state) => state.gold >= 100,
  },
  {
    id: "STREAK_3",
    title: "三日坊主卒業",
    description: "3日連続でクエストを達成する",
    condition: (state) => state.bestStreak >= 3,
  },
  {
    id: "STREAK_7",
    title: "週間覚醒者",
    description: "7日連続でクエストを達成する",
    condition: (state) => state.bestStreak >= 7,
  },
  {
    id: "STREAK_30",
    title: "習慣の支配者",
    description: "30日連続でクエストを達成する",
    condition: (state) => state.bestStreak >= 30,
  },
  {
    id: "DEFEAT_1_DEMON",
    title: "初討伐",
    description: "スリープデーモンを1体討伐する",
    condition: (state) => state.demonsDefeated >= 1,
  },
  {
    id: "DEFEAT_10_DEMONS",
    title: "デーモンスレイヤー",
    description: "スリープデーモンを10体討伐する",
    condition: (state) => state.demonsDefeated >= 10,
  },
];
