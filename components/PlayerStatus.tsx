// components/PlayerStatus.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getBuddyStage, getNextStage } from "../constants/buddy";
import { COLORS, GRADIENTS, RADIUS } from "../constants/theme";
import { PlayerState } from "../types";

type Props = {
  state: PlayerState;
};

export const PlayerStatus: React.FC<Props> = ({ state }) => {
  const buddy = getBuddyStage(state.level);
  const nextStage = getNextStage(state.level);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: Math.min(state.currentExp / state.expToNextLevel, 1),
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [state.currentExp, state.expToNextLevel, progress]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🔥 連続${state.streak}日活動中！ Lv.${state.level}「${buddy.title}」${buddy.emoji} 眠気をクエストで撃退してます ⚔️ #NemukeQuest`,
      });
    } catch {
      // シェアキャンセル時は何もしない
    }
  };

  return (
    <LinearGradient
      colors={GRADIENTS.card}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.statusContainer}
    >
      <View style={styles.topRow}>
        <View style={styles.buddyContainer}>
          <Text style={styles.buddyEmoji}>{buddy.emoji}</Text>
          <View>
            <Text style={styles.buddyTitle}>{buddy.title}</Text>
            <Text style={styles.nextStageText}>
              {nextStage
                ? `Lv.${nextStage.minLevel}で進化 ${nextStage.emoji}`
                : "最終進化！"}
            </Text>
          </View>
        </View>
        <View style={styles.chipRow}>
          <View style={[styles.chip, styles.streakChip]}>
            <Text style={styles.streakText}>🔥 {state.streak}日</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.goldText}>🪙 {state.gold} G</Text>
          </View>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <MaterialCommunityIcons
              name="share-variant"
              size={16}
              color={COLORS.textMuted}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.expRow}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Lv.{state.level}</Text>
        </View>
        <View style={styles.expBarContainer}>
          <Text style={styles.expText}>
            EXP {state.currentExp} / {state.expToNextLevel}
          </Text>
          <View style={styles.expBarTrack}>
            <Animated.View
              style={[
                styles.expBarFill,
                {
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  statusContainer: {
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  buddyContainer: { flexDirection: "row", alignItems: "center" },
  buddyEmoji: { fontSize: 34, marginRight: 10 },
  buddyTitle: { color: COLORS.text, fontWeight: "bold", fontSize: 15 },
  nextStageText: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  chipRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  chip: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  streakChip: { backgroundColor: "rgba(251, 146, 60, 0.15)" },
  streakText: { color: COLORS.fire, fontWeight: "bold", fontSize: 12 },
  goldText: { color: COLORS.gold, fontWeight: "bold", fontSize: 12 },
  shareButton: {
    backgroundColor: COLORS.surfaceLight,
    padding: 7,
    borderRadius: RADIUS.sm,
  },
  expRow: { flexDirection: "row", alignItems: "center" },
  levelBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  levelText: { color: "white", fontWeight: "bold", fontSize: 14 },
  expBarContainer: { flex: 1 },
  expText: { color: COLORS.textMuted, fontSize: 12, marginBottom: 6 },
  expBarTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.surfaceLight,
    overflow: "hidden",
  },
  expBarFill: {
    height: "100%",
    borderRadius: 5,
    backgroundColor: COLORS.accent,
  },
});
