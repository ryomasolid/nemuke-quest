// components/AchievementView.tsx
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { ACHIEVEMENTS } from "../achievements";
import { COLORS, RADIUS } from "../constants/theme";
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
      <Text style={[styles.achTitle, !isUnlocked && { color: COLORS.textFaint }]}>
        {isUnlocked ? item.title : "？？？"}
      </Text>
      <Text
        style={[
          styles.achDescription,
          !isUnlocked && { color: COLORS.textFaint },
        ]}
      >
        {item.description}
      </Text>
    </View>
  </View>
);

export const AchievementView: React.FC<Props> = ({ playerState }) => {
  const unlockedCount = playerState.unlockedAchievements.length;
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.listTitle}>アチーブメント</Text>
        <Text style={styles.progressText}>
          {unlockedCount} / {ACHIEVEMENTS.length}
        </Text>
      </View>
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
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  listTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "bold",
  },
  progressText: { color: COLORS.gold, fontSize: 14, fontWeight: "bold" },
  achCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
    opacity: 0.5,
  },
  achCardUnlocked: { opacity: 1 },
  achEmoji: { fontSize: 30, marginRight: 16 },
  achDetails: { flex: 1 },
  achTitle: { color: COLORS.text, fontSize: 16, fontWeight: "600" },
  achDescription: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
});
