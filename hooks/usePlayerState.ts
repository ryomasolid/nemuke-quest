// hooks/usePlayerState.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { ACHIEVEMENTS } from "../achievements";
import { PlayerState } from "../types";

const STORAGE_KEY = "@player_state_v2"; // バージョンを更新して初期化
const BASE_EXP = 100;

const initialState: PlayerState = {
  level: 1,
  currentExp: 0,
  expToNextLevel: BASE_EXP,
  gold: 0,
  questsCompleted: 0,
  unlockedAchievements: [],
  inventory: {
    expBoostMultiplier: 1, // 初期状態ではブーストなし
  },
};

export const usePlayerState = () => {
  const [playerState, setPlayerState] = useState<PlayerState>(initialState);

  // データのロード
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedState = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedState) {
          setPlayerState(JSON.parse(savedState));
        }
      } catch (e) {
        console.error("Failed to load player state.", e);
      }
    };
    loadState();
  }, []);

  // データのセーブ
  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(playerState));
      } catch (e) {
        console.error("Failed to save player state.", e);
      }
    };
    saveState();
  }, [playerState]);

  // 実績解除をチェックする関数
  const checkAchievements = useCallback((currentState: PlayerState) => {
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
  }, []);

  // クエストを完了した時の処理
  const completeQuest = (exp: number, gold: number) => {
    setPlayerState((prevState) => {
      let newExp =
        prevState.currentExp + exp * prevState.inventory.expBoostMultiplier;
      let newLevel = prevState.level;
      let newExpToNextLevel = prevState.expToNextLevel;

      while (newExp >= newExpToNextLevel) {
        newLevel++;
        newExp -= newExpToNextLevel;
        newExpToNextLevel = Math.floor(BASE_EXP * Math.pow(1.5, newLevel - 1));
      }

      const updatedState = {
        ...prevState,
        level: newLevel,
        currentExp: Math.floor(newExp),
        expToNextLevel: newExpToNextLevel,
        gold: prevState.gold + gold,
        questsCompleted: prevState.questsCompleted + 1,
      };

      // 実績解除チェック
      const newAchievements = checkAchievements(updatedState);
      if (newAchievements.length > 0) {
        // alert(`実績解除: ${newAchievements.join(', ')}`); // ここでUIに通知
        updatedState.unlockedAchievements = [
          ...updatedState.unlockedAchievements,
          ...newAchievements,
        ];
      }

      return updatedState;
    });
  };

  // アイテム購入処理
  const buyItem = (cost: number, itemName: "expBoost") => {
    if (playerState.gold < cost) {
      // alert('ゴールドが足りません！');
      return false;
    }
    setPlayerState((prevState) => ({
      ...prevState,
      gold: prevState.gold - cost,
      inventory: {
        ...prevState.inventory,
        expBoostMultiplier: 1.5, // 1.5倍ブーストを有効化
      },
    }));
    return true;
  };

  return { playerState, completeQuest, buyItem };
};
