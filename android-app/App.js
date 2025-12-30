import "react-native-gesture-handler";
import "./polyfills";
import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";

// Screens
import ConnectionScreen from "./screens/ConnectionScreen";
import InputScreen from "./screens/InputScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Connection">
        <Stack.Screen
          name="Connection"
          component={ConnectionScreen}
          options={{ title: "Connect to PC" }}
        />
        <Stack.Screen
          name="Input"
          component={InputScreen}
          options={{ title: "Voice Typing" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
