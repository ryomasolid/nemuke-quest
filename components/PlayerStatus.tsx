// components/PlayerStatus.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Progress from "react-native-progress";
import { PlayerState } from "../types";

type Props = {
  state: PlayerState;
};

export const PlayerStatus: React.FC<Props> = ({ state }) => (
  <View style={styles.statusContainer}>
    <View style={styles.levelBadge}>
      <Text style={styles.levelText}>Lv.{state.level}</Text>
    </View>
    <View style={styles.expBarContainer}>
      <Text style={styles.expText}>
        EXP: {state.currentExp} / {state.expToNextLevel}
      </Text>
      <Progress.Bar
        progress={state.currentExp / state.expToNextLevel}
        width={null}
        height={10}
        color={"#34D399"}
        unfilledColor={"#4A5568"}
        borderWidth={0}
        borderRadius={5}
      />
    </View>
    <View style={styles.goldContainer}>
      <Text style={styles.goldText}>🪙 {state.gold} G</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2D3748",
    margin: 16,
    padding: 10,
    borderRadius: 12,
  },
  levelBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  levelText: { color: "white", fontWeight: "bold", fontSize: 16 },
  expBarContainer: { flex: 1 },
  expText: { color: "#A0AEC0", fontSize: 12, marginBottom: 8 },
  goldContainer: {
    backgroundColor: "#4A5568",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 10,
  },
  goldText: { color: "#F59E0B", fontWeight: "bold" },
});
