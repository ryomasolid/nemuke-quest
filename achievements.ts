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
];
