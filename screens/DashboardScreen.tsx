// screens/DashboardScreen.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  BannerAd,
  BannerAdSize,
  RewardedAd,
  RewardedAdEventType,
} from "react-native-google-mobile-ads";
import { bannerAdUnitId, rewardedAdUnitId } from "../admob";
import { AchievementView } from "../components/AchievementView";
import { PlayerStatus } from "../components/PlayerStatus";
import { QuestView } from "../components/QuestView";
import { ShopView } from "../components/ShopView";
import { COLORS, RADIUS } from "../constants/theme";
import { usePlayerState } from "../hooks/usePlayerState";
import { Demon, Quest } from "../types";

const rewarded = RewardedAd.createForAdRequest(rewardedAdUnitId);

type Tab = "QUEST" | "ACHIEVEMENTS" | "SHOP";

const TABS: { key: Tab; label: string; icon: any }[] = [
  { key: "QUEST", label: "クエスト", icon: "sword-cross" },
  { key: "ACHIEVEMENTS", label: "実績", icon: "trophy" },
  { key: "SHOP", label: "ショップ", icon: "cart" },
];

const DashboardScreen: React.FC = () => {
  const { playerState, completeQuest, grantBonus, defeatDemon, buyItem } =
    usePlayerState();
  const [activeTab, setActiveTab] = useState<Tab>("QUEST");
  const [demon, setDemon] = useState<Demon | null>(null);

  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setAdLoaded(true);
      }
    );
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward: any) => {
        // 広告視聴の報酬として固定のEXPとGoldを付与
        console.log("User earned reward of ", reward);
        grantBonus(50, 25);
        Alert.alert(
          "ボーナス獲得！",
          "広告視聴ボーナスとして 50 EXP と 25 G を獲得しました！"
        );
      }
    );

    rewarded.load(); // 広告をロード開始

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, [grantBonus]);

  const showRewardedAd = () => {
    if (adLoaded) {
      rewarded.show();
    } else {
      Alert.alert(
        "広告はまだ準備中です",
        "少し待ってからもう一度お試しください。"
      );
    }
  };

  // デーモンを召喚（HPはレベルに応じてスケール）
  const summonDemon = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const maxHp = 60 + playerState.level * 15;
    setDemon({ hp: maxHp, maxHp });
  };

  // クエスト達成 → デーモンにダメージ
  const handleCompleteQuest = (quest: Quest) => {
    if (!demon) return;

    completeQuest(quest.expReward, quest.goldReward);
    const damage = quest.expReward * 3;
    const newHp = Math.max(demon.hp - damage, 0);

    if (newHp <= 0) {
      // 討伐成功！ボーナス報酬を付与
      setDemon(null);
      const bonusExp = 30 + playerState.level * 5;
      const bonusGold = 20 + playerState.level * 3;
      defeatDemon(bonusExp, bonusGold);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "🎉 デーモン討伐！",
        `スリープデーモンを倒した！\n討伐ボーナス +${bonusExp} EXP / +${bonusGold} G`,
        [
          { text: "OK", style: "cancel" },
          { text: "広告を見てさらにボーナス", onPress: showRewardedAd },
        ]
      );
    } else {
      setDemon({ ...demon, hp: newHp });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Alert.alert(
        "クエスト達成！",
        `デーモンに ${damage} ダメージ！\n+${quest.expReward} EXP / +${quest.goldReward} G を獲得`,
        [
          { text: "OK", style: "cancel" },
          { text: "広告を見てボーナス獲得", onPress: showRewardedAd },
        ]
      );
    }
  };

  const handleTabPress = (tab: Tab) => {
    Haptics.selectionAsync();
    setActiveTab(tab);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* プレイヤー情報は常に表示 */}
      <PlayerStatus state={playerState} />

      {/* タブナビゲーション */}
      <View style={styles.tabContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => handleTabPress(tab.key)}
          >
            <MaterialCommunityIcons
              name={tab.icon}
              size={16}
              color={activeTab === tab.key ? COLORS.text : COLORS.textMuted}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* タブに応じて表示するコンテンツを切り替え */}
      <View style={styles.contentContainer}>
        {activeTab === "QUEST" && (
          <QuestView
            demon={demon}
            onSummonDemon={summonDemon}
            onCompleteQuest={handleCompleteQuest}
          />
        )}
        {activeTab === "ACHIEVEMENTS" && (
          <AchievementView playerState={playerState} />
        )}
        {activeTab === "SHOP" && (
          <ShopView playerState={playerState} onBuyItem={buyItem} />
        )}
      </View>

      <View style={styles.bannerContainer}>
        <BannerAd
          unitId={bannerAdUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 16,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm + 2,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.sm - 2,
  },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { color: COLORS.textMuted, textAlign: "center", fontWeight: "bold" },
  tabTextActive: { color: COLORS.text },
  contentContainer: { flex: 1, marginHorizontal: 16, marginTop: 16 },
  bannerContainer: { alignItems: "center" },
});

export default DashboardScreen;
