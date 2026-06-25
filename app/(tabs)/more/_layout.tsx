import { Stack } from "expo-router";

export default function MoreLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" />
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
