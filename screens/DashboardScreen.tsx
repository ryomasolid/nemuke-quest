// screens/DashboardScreen.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Progress from "react-native-progress";
import { usePlayerState } from "../hooks/usePlayerState";
import { Quest } from "../types";
import { BannerAd, BannerAdSize, TestIds, RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { bannerAdUnitId, rewardedAdUnitId } from '../admob';

// 利用可能なクエストのリスト
const AVAILABLE_QUESTS: Quest[] = [
  {
    id: "1",
    title: "聖なる水を飲む",
    description: "コップ一杯の水を飲んで身体を目覚めさせる",
    icon: "water",
    expReward: 10,
  },
  {
    id: "2",
    title: "太陽の光を浴びる",
    description: "5分間、外の空気を吸ってリフレッシュする",
    icon: "white-balance-sunny",
    expReward: 20,
  },
  {
    id: "3",
    title: "身体の解放",
    description: "簡単なストレッチで血行を促進する",
    icon: "run",
    expReward: 15,
  },
  {
    id: "4",
    title: "ミントの刺激",
    description: "ガムを噛んで脳を活性化させる",
    icon: "leaf",
    expReward: 5,
  },
];

const rewarded = RewardedAd.createForAdRequest(rewardedAdUnitId, {
  requestNonPersonalizedAdsOnly: true, // 必要に応じて設定
});

const DashboardScreen: React.FC = () => {
  const { playerState, gainExp } = usePlayerState();
  const [demonIsActive, setDemonIsActive] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  // リワード広告のロードとイベントリスナー設定
  React.useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setAdLoaded(true);
    });
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward of ', reward);
        // ここで実際に報酬を付与
        gainExp(reward.amount); // 仮にEXPを10に設定した場合
      },
    );

    // 広告をロード開始
    rewarded.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, [gainExp]);

  const showRewardedAd = () => {
    if (adLoaded) {
      rewarded.show();
    } else {
      Alert.alert("広告の準備ができていません", "少し時間をおいてから再度お試しください。");
    }
  };

  const handleCompleteQuest = (quest: Quest) => {
    gainExp(quest.expReward);
    setDemonIsActive(false);

    Alert.alert(
      'クエスト達成！',
      `+${quest.expReward}EXPを獲得しました！`,
      [
        { text: 'OK', style: 'cancel' },
        {
          text: '報酬を2倍にする(広告)',
          onPress: () => showRewardedAd(),
        },
      ]
    );
  };

  // プレイヤー情報の表示コンポーネント
  const PlayerStatus = () => (
    <View style={styles.statusContainer}>
      <View style={styles.levelBadge}>
        <Text style={styles.levelText}>Lv.{playerState.level}</Text>
      </View>
      <View style={styles.expBarContainer}>
        <Text style={styles.expText}>
          EXP: {playerState.currentExp} / {playerState.expToNextLevel}
        </Text>
        <Progress.Bar
          progress={playerState.currentExp / playerState.expToNextLevel}
          width={null} // nullにすると親要素の幅に追従
          height={10}
          color={"#34D399"}
          unfilledColor={"#4A5568"}
          borderWidth={0}
          borderRadius={5}
        />
      </View>
    </View>
  );

  // 眠気モンスターの表示コンポーネント
  const SleepDemon = () => (
    <View style={styles.demonContainer}>
      {demonIsActive ? (
        <>
          <Text style={styles.demonEmoji}>😴</Text>
          <Text style={styles.demonText}>スリープデーモンが現れた！</Text>
          <Text style={styles.demonSubText}>
            クエストを達成して撃退しよう！
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.demonEmoji}>😊</Text>
          <Text style={styles.demonText}>今日も快調！</Text>
          <TouchableOpacity
            style={styles.summonButton}
            onPress={() => setDemonIsActive(true)}
          >
            <Text style={styles.summonButtonText}>眠気を感じたらタップ</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  // クエストカードの表示コンポーネント
  const QuestCard = ({ item }: { item: Quest }) => (
    <TouchableOpacity
      style={styles.questCard}
      onPress={() => handleCompleteQuest(item)}
      disabled={!demonIsActive}
    >
      <View
        style={[
          styles.questIconContainer,
          !demonIsActive && { backgroundColor: "#4A5568" },
        ]}
      >
        <MaterialCommunityIcons name={item.icon} size={24} color="white" />
      </View>
      <View style={styles.questDetails}>
        <Text
          style={[styles.questTitle, !demonIsActive && { color: "#718096" }]}
        >
          {item.title}
        </Text>
        <Text
          style={[
            styles.questDescription,
            !demonIsActive && { color: "#4A5568" },
          ]}
        >
          {item.description}
        </Text>
      </View>
      <Text style={[styles.questExp, !demonIsActive && { color: "#4A5568" }]}>
        +{item.expReward} EXP
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <PlayerStatus />
      <SleepDemon />
      <View style={styles.questListContainer}>
        <Text style={styles.questListTitle}>クエスト一覧</Text>
        <FlatList
          data={AVAILABLE_QUESTS}
          renderItem={QuestCard}
          keyExtractor={(item) => item.id}
        />
      </View>

      <View style={styles.bannerContainer}>
        <BannerAd
          unitId={bannerAdUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#171C2E" },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2D3748",
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  levelBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  levelText: { color: "white", fontWeight: "bold", fontSize: 18 },
  expBarContainer: { flex: 1 },
  expText: { color: "#A0AEC0", fontSize: 12, marginBottom: 8 },
  demonContainer: { alignItems: "center", marginVertical: 32 },
  demonEmoji: { fontSize: 80 },
  demonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
  },
  demonSubText: { color: "#A0AEC0", fontSize: 16, marginTop: 4 },
  summonButton: {
    marginTop: 16,
    backgroundColor: "#4A5568",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  summonButtonText: { color: "white", fontWeight: "600" },
  questListContainer: { flex: 1, marginHorizontal: 16 },
  questListTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
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
  questExp: { color: "#F59E0B", fontSize: 14, fontWeight: "bold" },
  bannerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
  },
});

export default DashboardScreen;
