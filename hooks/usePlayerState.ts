// hooks/usePlayerState.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";
import { ACHIEVEMENTS } from "../achievements";
import { PlayerState, ShopItemName } from "../types";

const STORAGE_KEY = "@player_state_v2";
const BASE_EXP = 100;

const initialState: PlayerState = {
  level: 1,
  currentExp: 0,
  expToNextLevel: BASE_EXP,
  gold: 0,
  questsCompleted: 0,
  unlockedAchievements: [],
  streak: 0,
  bestStreak: 0,
  lastActiveDate: null,
  demonsDefeated: 0,
  inventory: {
    expBoostMultiplier: 1, // 初期状態ではブーストなし
    streakFreezes: 0,
  },
};

// ローカルタイムゾーンでの YYYY-MM-DD
const toDateString = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

const getToday = () => toDateString(new Date());

const getYesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toDateString(d);
};

// 実績解除をチェックする関数
const checkAchievements = (currentState: PlayerState) => {
  const newlyUnlocked: string[] = [];
  ACHIEVEMENTS.forEach((ach) => {
    // まだ解除してなくて、条件を満たした場合
    if (
      !currentState.unlockedAchievements.includes(ach.id) &&
      ach.condition(currentState)
    ) {
      newlyUnlocked.push(ach.id);
    }
  });
  return newlyUnlocked;
};

// EXP・ゴールド付与とレベルアップ計算の共通処理
const applyReward = (
  prevState: PlayerState,
  exp: number,
  gold: number
): PlayerState => {
  let newExp =
    prevState.currentExp + exp * prevState.inventory.expBoostMultiplier;
  let newLevel = prevState.level;
  let newExpToNextLevel = prevState.expToNextLevel;

  while (newExp >= newExpToNextLevel) {
    newLevel++;
    newExp -= newExpToNextLevel;
    newExpToNextLevel = Math.floor(BASE_EXP * Math.pow(1.5, newLevel - 1));
  }

  return {
    ...prevState,
    level: newLevel,
    currentExp: Math.floor(newExp),
    expToNextLevel: newExpToNextLevel,
    gold: prevState.gold + gold,
  };
};

const withAchievements = (state: PlayerState): PlayerState => {
  const newAchievements = checkAchievements(state);
  if (newAchievements.length === 0) return state;
  return {
    ...state,
    unlockedAchievements: [...state.unlockedAchievements, ...newAchievements],
  };
};

// 旧バージョンの保存データに新フィールドを補完しつつ、ストリークの継続判定を行う
const migrateAndReconcile = (saved: Partial<PlayerState>): PlayerState => {
  const state: PlayerState = {
    ...initialState,
    ...saved,
    inventory: { ...initialState.inventory, ...saved.inventory },
  };

  const today = getToday();
  const yesterday = getYesterday();
  if (
    state.lastActiveDate &&
    state.lastActiveDate !== today &&
    state.lastActiveDate !== yesterday
  ) {
    if (state.inventory.streakFreezes > 0 && state.streak > 0) {
      // フリーズを1つ消費してストリークを守る
      state.inventory = {
        ...state.inventory,
        streakFreezes: state.inventory.streakFreezes - 1,
      };
      state.lastActiveDate = yesterday;
    } else {
      state.streak = 0;
    }
  }
  return state;
};

export const usePlayerState = () => {
  const [playerState, setPlayerState] = useState<PlayerState>(initialState);
  const isLoaded = useRef(false);

  // データのロード
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedState = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedState) {
          setPlayerState(migrateAndReconcile(JSON.parse(savedState)));
        }
      } catch (e) {
        console.error("Failed to load player state.", e);
      } finally {
        isLoaded.current = true;
      }
    };
    loadState();
  }, []);

  // データのセーブ（初回ロード完了前の保存で上書きしない）
  useEffect(() => {
    if (!isLoaded.current) return;
    const saveState = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(playerState));
      } catch (e) {
        console.error("Failed to save player state.", e);
      }
    };
    saveState();
  }, [playerState]);

  // クエストを完了した時の処理（ストリーク更新を含む）
  const completeQuest = useCallback((exp: number, gold: number) => {
    setPlayerState((prevState) => {
      let updatedState = applyReward(prevState, exp, gold);
      updatedState.questsCompleted = prevState.questsCompleted + 1;

      const today = getToday();
      if (prevState.lastActiveDate !== today) {
        const newStreak = prevState.streak + 1;
        updatedState = {
          ...updatedState,
          streak: newStreak,
          bestStreak: Math.max(newStreak, prevState.bestStreak),
          lastActiveDate: today,
        };
      }

      return withAchievements(updatedState);
    });
  }, []);

  // 広告ボーナスなど、クエスト数にカウントしない報酬付与
  const grantBonus = useCallback((exp: number, gold: number) => {
    setPlayerState((prevState) =>
      withAchievements(applyReward(prevState, exp, gold))
    );
  }, []);

  // スリープデーモン討伐ボーナス
  const defeatDemon = useCallback((exp: number, gold: number) => {
    setPlayerState((prevState) => {
      const updatedState = applyReward(prevState, exp, gold);
      updatedState.demonsDefeated = prevState.demonsDefeated + 1;
      return withAchievements(updatedState);
    });
  }, []);

  // アイテム購入処理
  const buyItem = (cost: number, itemName: ShopItemName) => {
    if (playerState.gold < cost) {
      return false;
    }
    setPlayerState((prevState) => {
      const inventory = { ...prevState.inventory };
      if (itemName === "expBoost") {
        inventory.expBoostMultiplier = 1.5; // 1.5倍ブーストを有効化
      } else {
        inventory.streakFreezes = inventory.streakFreezes + 1;
      }
      return {
        ...prevState,
        gold: prevState.gold - cost,
        inventory,
      };
    });
    return true;
  };

  return { playerState, completeQuest, grantBonus, defeatDemon, buyItem };
};
