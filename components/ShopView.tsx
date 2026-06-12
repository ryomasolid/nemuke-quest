// components/ShopView.tsx
import * as Haptics from "expo-haptics";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, RADIUS } from "../constants/theme";
import { PlayerState, ShopItemName } from "../types";

type Props = {
  playerState: PlayerState;
  onBuyItem: (cost: number, itemName: ShopItemName) => boolean;
};

const EXP_BOOST_COST = 200;
const STREAK_FREEZE_COST = 80;

export const ShopView: React.FC<Props> = ({ playerState, onBuyItem }) => {
  const handleBuy = (
    cost: number,
    itemName: ShopItemName,
    successMessage: string
  ) => {
    if (onBuyItem(cost, itemName)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("購入成功！", successMessage);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("購入失敗", "ゴールドが足りません。");
    }
  };

  const isBoostPurchased = playerState.inventory.expBoostMultiplier > 1;
  const freezeCount = playerState.inventory.streakFreezes;

  return (
    <>
      <Text style={styles.listTitle}>アイテムショップ</Text>

      <View style={styles.shopItem}>
        <Text style={styles.shopItemIcon}>⚡️</Text>
        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle}>経験値ブースト (永続)</Text>
          <Text style={styles.itemDescription}>
            獲得するEXPが永久に1.5倍になる
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.buyButton, isBoostPurchased && styles.buyButtonDisabled]}
          onPress={() =>
            handleBuy(EXP_BOOST_COST, "expBoost", "獲得EXPが1.5倍になりました！")
          }
          disabled={isBoostPurchased}
        >
          <Text style={styles.buyButtonText}>
            {isBoostPurchased ? "購入済み" : `${EXP_BOOST_COST} G`}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.shopItem}>
        <Text style={styles.shopItemIcon}>🧊</Text>
        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle}>
            ストリークフリーズ{freezeCount > 0 ? ` (所持: ${freezeCount})` : ""}
          </Text>
          <Text style={styles.itemDescription}>
            1日サボっても🔥連続記録が途切れない
          </Text>
        </View>
        <TouchableOpacity
          style={styles.buyButton}
          onPress={() =>
            handleBuy(
              STREAK_FREEZE_COST,
              "streakFreeze",
              "ストリークフリーズを手に入れた！連続記録が守られます。"
            )
          }
        >
          <Text style={styles.buyButtonText}>{STREAK_FREEZE_COST} G</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  listTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  shopItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  shopItemIcon: { fontSize: 30, marginRight: 16 },
  itemDetails: { flex: 1 },
  itemTitle: { color: COLORS.text, fontSize: 16, fontWeight: "600" },
  itemDescription: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  buyButton: {
    backgroundColor: COLORS.gold,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: RADIUS.sm,
  },
  buyButtonDisabled: { backgroundColor: COLORS.surfaceLight },
  buyButtonText: { color: "#1A1A1A", fontWeight: "bold" },
});
