import { useLocalSearchParams } from "expo-router";
import { HomeworkCreateScreen } from "@/screens";

export default function HomeworkCreate() {
  const params = useLocalSearchParams<{ homeworkId?: string }>();
  return <HomeworkCreateScreen />;
}
