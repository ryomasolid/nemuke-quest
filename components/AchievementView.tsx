// components/AchievementView.tsx
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { ACHIEVEMENTS } from "../achievements";
import { Achievement, PlayerState } from "../types";

type Props = {
  playerState: PlayerState;
};

const AchievementCard: React.FC<{ item: Achievement; isUnlocked: boolean }> = ({
  item,
  isUnlocked,
}) => (
  <View style={[styles.achCard, isUnlocked && styles.achCardUnlocked]}>
    <Text style={styles.achEmoji}>{isUnlocked ? "🏆" : "❓"}</Text>
    <View style={styles.achDetails}>
      <Text style={[styles.achTitle, !isUnlocked && { color: "#718096" }]}>
        {isUnlocked ? item.title : "？？？"}
      </Text>
      <Text
        style={[styles.achDescription, !isUnlocked && { color: "#4A5568" }]}
      >
        {item.description}
      </Text>
    </View>
  </View>
);

export const AchievementView: React.FC<Props> = ({ playerState }) => (
  <>
    <Text style={styles.listTitle}>アチーブメント</Text>
    <FlatList
      data={ACHIEVEMENTS}
      renderItem={({ item }) => (
        <AchievementCard
          item={item}
          isUnlocked={playerState.unlockedAchievements.includes(item.id)}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  </>
);

const styles = StyleSheet.create({
  listTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  achCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2D3748",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    opacity: 0.5,
  },
  achCardUnlocked: { opacity: 1 },
  achEmoji: { fontSize: 30, marginRight: 16 },
  achDetails: { flex: 1 },
  achTitle: { color: "white", fontSize: 16, fontWeight: "600" },
  achDescription: { color: "#A0AEC0", fontSize: 12, marginTop: 2 },
});
