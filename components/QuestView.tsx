// components/QuestView.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ALL_AVAILABLE_QUESTS, QUESTS_TO_SHOW } from "../constants/quests";
import { Quest } from "../types";

type Props = {
  onCompleteQuest: (exp: number, gold: number) => void;
  onShowRewardedAd: () => void;
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
        !isActive && { backgroundColor: "#4A5568" },
      ]}
    >
      <MaterialCommunityIcons name={item.icon} size={24} color="white" />
    </View>
    <View style={styles.questDetails}>
      <Text style={[styles.questTitle, !isActive && { color: "#718096" }]}>
        {item.title}
      </Text>
      <Text
        style={[styles.questDescription, !isActive && { color: "#4A5568" }]}
      >
        {item.description}
      </Text>
    </View>
    <View>
      <Text style={[styles.questReward, !isActive && { color: "#4A5568" }]}>
        +{item.expReward} EXP
      </Text>
      <Text
        style={[
          styles.questReward,
          { color: "#F59E0B" },
          !isActive && { color: "#4A5568" },
        ]}
      >
        +{item.goldReward} G
      </Text>
    </View>
  </TouchableOpacity>
);

export const QuestView: React.FC<Props> = ({
  onCompleteQuest,
  onShowRewardedAd,
}) => {
  const [demonIsActive, setDemonIsActive] = useState(false);
  const [currentQuests, setCurrentQuests] = useState<Quest[]>([]);

  const shuffleQuests = () => {
    const shuffled = [...ALL_AVAILABLE_QUESTS].sort(() => 0.5 - Math.random());
    setCurrentQuests(shuffled.slice(0, QUESTS_TO_SHOW));
  };

  useEffect(() => {
    shuffleQuests();
  }, []);

  const summonDemon = () => {
    setDemonIsActive(true);
    shuffleQuests();
  };

  const handleComplete = (quest: Quest) => {
    setDemonIsActive(false);
    onCompleteQuest(quest.expReward, quest.goldReward);
    Alert.alert(
      "クエスト達成！",
      `+${quest.expReward}EXP と +${quest.goldReward}G を獲得しました！`,
      [
        {
          text: "OK",
          style: "cancel",
        },
        {
          text: "広告を見てボーナス獲得", // 選択肢を追加
          onPress: onShowRewardedAd, // 親から渡された関数を呼ぶ
        },
      ]
    );
  };

  return (
    <>
      <View style={styles.demonContainer}>
        {demonIsActive ? (
          <>
            <Text style={styles.demonEmoji}>😴</Text>
            <Text style={styles.demonText}>スリープデーモンが現れた！</Text>
          </>
        ) : (
          <>
            <Text style={styles.demonEmoji}>😊</Text>
            <Text style={styles.demonText}>今日も快調！</Text>
            <TouchableOpacity style={styles.summonButton} onPress={summonDemon}>
              <Text style={styles.summonButtonText}>眠気を感じたらタップ</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>クエスト一覧</Text>
        <TouchableOpacity style={styles.shuffleButton} onPress={shuffleQuests}>
          <MaterialCommunityIcons
            name="shuffle-variant"
            size={20}
            color="#A0AEC0"
          />
          <Text style={styles.shuffleButtonText}>再抽選</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={currentQuests}
        renderItem={({ item }) => (
          <QuestCard
            item={item}
            isActive={demonIsActive}
            onPress={() => handleComplete(item)}
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
  listTitle: { color: "white", fontSize: 20, fontWeight: "bold" },
  shuffleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4A5568",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  shuffleButtonText: { color: "#A0AEC0", marginLeft: 6, fontWeight: "600" },
  demonContainer: { alignItems: "center", marginBottom: 24, minHeight: 120 },
  demonEmoji: { fontSize: 60 },
  demonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 12,
  },
  summonButton: {
    marginTop: 12,
    backgroundColor: "#4A5568",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  summonButtonText: { color: "white", fontWeight: "600" },
  questCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2D3748",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  questIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#34D399",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  questDetails: { flex: 1 },
  questTitle: { color: "white", fontSize: 16, fontWeight: "600" },
  questDescription: { color: "#A0AEC0", fontSize: 12, marginTop: 2 },
  questReward: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#34D399",
    textAlign: "right",
  },
});
