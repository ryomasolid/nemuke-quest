// types.ts
export type RootStackParamList = {
  Dashboard: undefined;
};

// クエストのデータ構造
export interface Quest {
  id: string;
  title: string;
  description: string;
  icon: any; // MaterialCommunityIconsのname
  expReward: number;
  goldReward: number; // ゴールド報酬を追加
}

// 実績のデータ構造
export interface Achievement {
  id: string;
  title: string;
  description: string;
  condition: (playerState: PlayerState) => boolean;
}

// プレイヤーの状態
export interface PlayerState {
  level: number;
  currentExp: number;
  expToNextLevel: number;
  gold: number; // 通貨を追加
  questsCompleted: number; // 達成したクエストの総数を追加
  unlockedAchievements: string[]; // 解除した実績IDの配列
  // アイテムの効果などをここに追加していく
  inventory: {
    expBoostMultiplier: number; // 例: EXPブーストアイテム
  };
}
