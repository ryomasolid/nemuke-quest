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
}

// プレイヤーの状態
export interface PlayerState {
  level: number;
  currentExp: number;
  expToNextLevel: number;
}
