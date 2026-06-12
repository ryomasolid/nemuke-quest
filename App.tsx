import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { COLORS } from "./constants/theme";
import DashboardScreen from "./screens/DashboardScreen";
import { RootStackParamList } from "./types";

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{
              title: "Nemuke Quest ⚔️",
              headerStyle: { backgroundColor: COLORS.background },
              headerTintColor: "#FFF",
              headerTitleStyle: { fontWeight: "bold" },
              headerShadowVisible: false, // ヘッダー下の影を消してモダンに
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
