// hooks/usePlayerState.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { PlayerState } from "../types";

const STORAGE_KEY = "@player_state";
const BASE_EXP = 100; // レベルアップに必要な基本EXP

export const usePlayerState = () => {
  const [playerState, setPlayerState] = useState<PlayerState>({
    level: 1,
    currentExp: 0,
    expToNextLevel: BASE_EXP,
  });

  // アプリ起動時にAsyncStorageからデータを読み込む
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

  // プレイヤーの状態が変化したらAsyncStorageに保存する
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

  // EXPを獲得する関数
  const gainExp = (amount: number) => {
    setPlayerState((prevState) => {
      let newExp = prevState.currentExp + amount;
      let newLevel = prevState.level;
      let newExpToNextLevel = prevState.expToNextLevel;

      // レベルアップ処理
      while (newExp >= newExpToNextLevel) {
        newLevel++;
        newExp -= newExpToNextLevel;
        // 次のレベルに必要なEXPを計算 (例: 1.5倍ずつ増やす)
        newExpToNextLevel = Math.floor(BASE_EXP * Math.pow(1.5, newLevel - 1));
      }

      return {
        level: newLevel,
        currentExp: newExp,
        expToNextLevel: newExpToNextLevel,
      };
    });
  };

  return { playerState, gainExp };
};
