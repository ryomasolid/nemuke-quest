// screens/DashboardScreen.tsx
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
import { usePlayerState } from "../hooks/usePlayerState";

const rewarded = RewardedAd.createForAdRequest(rewardedAdUnitId);

type Tab = "QUEST" | "ACHIEVEMENTS" | "SHOP";

const DashboardScreen: React.FC = () => {
  const { playerState, completeQuest, buyItem } = usePlayerState();
  const [activeTab, setActiveTab] = useState<Tab>("QUEST");

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
        completeQuest(50, 25); // 例: 50 EXP, 25 Gold
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
  }, [completeQuest]);

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

  return (
    <SafeAreaView style={styles.container}>
      {/* プレイヤー情報は常に表示 */}
      <PlayerStatus state={playerState} />

      {/* タブナビゲーション */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "QUEST" && styles.tabActive]}
          onPress={() => setActiveTab("QUEST")}
        >
          <Text style={styles.tabText}>クエスト</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "ACHIEVEMENTS" && styles.tabActive]}
          onPress={() => setActiveTab("ACHIEVEMENTS")}
        >
          <Text style={styles.tabText}>実績</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "SHOP" && styles.tabActive]}
          onPress={() => setActiveTab("SHOP")}
        >
          <Text style={styles.tabText}>ショップ</Text>
        </TouchableOpacity>
      </View>

      {/* タブに応じて表示するコンテンツを切り替え */}
      <View style={styles.contentContainer}>
        {activeTab === "QUEST" && (
          <QuestView
            onCompleteQuest={completeQuest}
            onShowRewardedAd={showRewardedAd}
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
  container: { flex: 1, backgroundColor: "#171C2E" },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 16,
    backgroundColor: "#2D3748",
    borderRadius: 12,
    padding: 4,
  },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 8 },
  tabActive: { backgroundColor: "#4A5568" },
  tabText: { color: "white", textAlign: "center", fontWeight: "bold" },
  contentContainer: { flex: 1, marginHorizontal: 16, marginTop: 16 },
  bannerContainer: { alignItems: "center" },
});

export default DashboardScreen;
