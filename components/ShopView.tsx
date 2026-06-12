// components/ShopView.tsx
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PlayerState } from "../types";

type Props = {
  playerState: PlayerState;
  onBuyItem: (cost: number, itemName: "expBoost") => boolean;
};

export const ShopView: React.FC<Props> = ({ playerState, onBuyItem }) => {
  const handleBuy = () => {
    if (onBuyItem(200, "expBoost")) {
      Alert.alert("購入成功！", "獲得EXPが1.5倍になりました！");
    } else {
      Alert.alert("購入失敗", "ゴールドが足りません。");
    }
  };

  const isPurchased = playerState.inventory.expBoostMultiplier > 1;

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
          style={[styles.buyButton, isPurchased && styles.buyButtonDisabled]}
          onPress={handleBuy}
          disabled={isPurchased}
        >
          <Text style={styles.buyButtonText}>
            {isPurchased ? "購入済み" : "200 G"}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  listTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  shopItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2D3748",
    padding: 16,
    borderRadius: 12,
  },
  shopItemIcon: { fontSize: 30, marginRight: 16 },
  itemDetails: { flex: 1 },
  itemTitle: { color: "white", fontSize: 16, fontWeight: "600" },
  itemDescription: { color: "#A0AEC0", fontSize: 12, marginTop: 2 },
  buyButton: {
    backgroundColor: "#F59E0B",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  buyButtonDisabled: { backgroundColor: "#4A5568" },
  buyButtonText: { color: "white", fontWeight: "bold" },
});
