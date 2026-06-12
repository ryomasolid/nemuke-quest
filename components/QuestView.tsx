// components/QuestView.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ALL_AVAILABLE_QUESTS, QUESTS_TO_SHOW } from "../constants/quests";
import { COLORS, GRADIENTS, RADIUS } from "../constants/theme";
import { Demon, Quest } from "../types";

type Props = {
  demon: Demon | null;
  onSummonDemon: () => void;
  onCompleteQuest: (quest: Quest) => void;
};

// QuestCardはQuestView内でしか使わないので、ここに定義
const QuestCard: React.FC<{
  item: Quest;
  isActive: boolean;
  onPress: () => void;
}> = ({ item, isActive, onPress }) => (
  <TouchableOpacity
    style={styles.questCard}
    onPress={onPress}
    disabled={!isActive}
  >
    <View
      style={[
        styles.questIconContainer,
        !isActive && { backgroundColor: COLORS.surfaceLight },
      ]}
    >
      <MaterialCommunityIcons name={item.icon} size={24} color="white" />
    </View>
    <View style={styles.questDetails}>
      <Text style={[styles.questTitle, !isActive && { color: COLORS.textFaint }]}>
        {item.title}
      </Text>
      <Text
        style={[
          styles.questDescription,
          !isActive && { color: COLORS.textFaint },
        ]}
      >
        {item.description}
      </Text>
    </View>
    <View>
      <Text style={[styles.questReward, !isActive && { color: COLORS.textFaint }]}>
        +{item.expReward} EXP
      </Text>
      <Text
        style={[
          styles.questReward,
          { color: COLORS.gold },
          !isActive && { color: COLORS.textFaint },
        ]}
      >
        +{item.goldReward} G
      </Text>
    </View>
  </TouchableOpacity>
);

export const QuestView: React.FC<Props> = ({
  demon,
  onSummonDemon,
  onCompleteQuest,
}) => {
  const [currentQuests, setCurrentQuests] = useState<Quest[]>([]);

  const shuffleQuests = () => {
    const shuffled = [...ALL_AVAILABLE_QUESTS].sort(() => 0.5 - Math.random());
    setCurrentQuests(shuffled.slice(0, QUESTS_TO_SHOW));
  };

  useEffect(() => {
    shuffleQuests();
  }, []);

  const handleSummon = () => {
    onSummonDemon();
    shuffleQuests();
  };

  const hpRatio = demon ? demon.hp / demon.maxHp : 0;

  return (
    <>
      {demon ? (
        <LinearGradient colors={GRADIENTS.demon} style={styles.demonContainer}>
          <Text style={styles.demonEmoji}>{hpRatio > 0.5 ? "😈" : "😵"}</Text>
          <Text style={styles.demonText}>スリープデーモンが現れた！</Text>
          <View style={styles.hpBarTrack}>
            <View style={[styles.hpBarFill, { width: `${hpRatio * 100}%` }]} />
          </View>
          <Text style={styles.hpText}>
            HP {demon.hp} / {demon.maxHp}
          </Text>
          <Text style={styles.demonHint}>
            クエストを達成してダメージを与えよう！
          </Text>
        </LinearGradient>
      ) : (
        <View style={styles.demonContainer}>
          <Text style={styles.demonEmoji}>😊</Text>
          <Text style={styles.demonText}>今日も快調！</Text>
          <TouchableOpacity onPress={handleSummon}>
            <LinearGradient
              colors={GRADIENTS.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.summonButton}
            >
              <Text style={styles.summonButtonText}>眠気を感じたらタップ</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>クエスト一覧</Text>
        <TouchableOpacity style={styles.shuffleButton} onPress={shuffleQuests}>
          <MaterialCommunityIcons
            name="shuffle-variant"
            size={20}
            color={COLORS.textMuted}
          />
          <Text style={styles.shuffleButtonText}>再抽選</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={currentQuests}
        renderItem={({ item }) => (
          <QuestCard
            item={item}
            isActive={demon !== null}
            onPress={() => onCompleteQuest(item)}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </>
  );
};

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  listTitle: { color: COLORS.text, fontSize: 20, fontWeight: "bold" },
  shuffleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceLight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.sm,
  },
  shuffleButtonText: {
    color: COLORS.textMuted,
    marginLeft: 6,
    fontWeight: "600",
  },
  demonContainer: {
    alignItems: "center",
    marginBottom: 20,
    minHeight: 130,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: RADIUS.md,
  },
  demonEmoji: { fontSize: 52 },
  demonText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  hpBarTrack: {
    alignSelf: "stretch",
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(0,0,0,0.4)",
    overflow: "hidden",
    marginTop: 10,
  },
  hpBarFill: {
    height: "100%",
    borderRadius: 5,
    backgroundColor: COLORS.danger,
  },
  hpText: { color: COLORS.danger, fontSize: 12, fontWeight: "bold", marginTop: 4 },
  demonHint: { color: COLORS.textMuted, fontSize: 12, marginTop: 4 },
  summonButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  summonButtonText: { color: "white", fontWeight: "600" },
  questCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  questIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.accent,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  questDetails: { flex: 1 },
  questTitle: { color: COLORS.text, fontSize: 16, fontWeight: "600" },
  questDescription: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  questReward: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.accent,
    textAlign: "right",
  },
});
