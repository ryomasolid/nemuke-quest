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

// スリープデーモン（セッション中のバトル状態）
export interface Demon {
  hp: number;
  maxHp: number;
}

// プレイヤーの状態
export interface PlayerState {
  level: number;
  currentExp: number;
  expToNextLevel: number;
  gold: number; // 通貨を追加
  questsCompleted: number; // 達成したクエストの総数を追加
  unlockedAchievements: string[]; // 解除した実績IDの配列
  streak: number; // 連続活動日数
  bestStreak: number; // 最長連続記録
  lastActiveDate: string | null; // 最後にクエストを達成した日 (YYYY-MM-DD)
  demonsDefeated: number; // 討伐したスリープデーモンの数
  // アイテムの効果などをここに追加していく
  inventory: {
    expBoostMultiplier: number; // 例: EXPブーストアイテム
    streakFreezes: number; // ストリークを守るフリーズの所持数
  };
}

export type ShopItemName = "expBoost" | "streakFreeze";
