import { useLocalSearchParams } from "expo-router";
import { HomeworkDetailScreen } from "@/screens";

export default function HomeworkDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <HomeworkDetailScreen />;
}
