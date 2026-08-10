import { useEffect } from "react";
import { BackHandler, Platform } from "react-native";
import { Stack, router, useNavigation } from "expo-router";
import { consumeNavFromDashboard } from "@/utils/navigation";

export default function MoreLayout() {
  const navigation = useNavigation();

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const onBackPress = () => {
      const state = navigation.getState();
      if (!state) return false;

      const routes = state.routes;
      if (routes.length === 2 && consumeNavFromDashboard()) {
        router.push("/(tabs)");
        return true;
      }

      return false;
    };

    const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => subscription.remove();
  }, [navigation]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="timetable" />
      <Stack.Screen name="period-detail" />
      <Stack.Screen name="exams" />
      <Stack.Screen name="exam-detail" />
      <Stack.Screen name="results" />
      <Stack.Screen name="marks-entry" />
      <Stack.Screen name="exam-schedule" />
      <Stack.Screen name="calendar" />
      <Stack.Screen name="circulars" />
      <Stack.Screen name="documents" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="leave" />
      <Stack.Screen name="leave-apply" />
      <Stack.Screen name="leave-detail" />
      <Stack.Screen name="students" />
      <Stack.Screen name="student-detail" />
      <Stack.Screen name="transport" />
      <Stack.Screen name="vehicle-tracking" />
      <Stack.Screen name="route-detail" />
    </Stack>
  );
}
