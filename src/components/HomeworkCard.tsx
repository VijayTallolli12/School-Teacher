import { Text, TouchableOpacity, View } from "react-native";
import { cardShadow } from "../theme/shadows";
import { Ionicons } from "@expo/vector-icons";
import type { HomeworkItem } from "@/types";
import { getHomeworkStatusLabel, getHomeworkStatusColor, getHomeworkStatusTint } from "@/utils/homework";
import { HomeworkStatusBadge } from "./HomeworkStatusBadge";


function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

interface HomeworkCardProps {
  homework: HomeworkItem;
  onPress: () => void;
}

export function HomeworkCard({ homework, onPress }: HomeworkCardProps) {
  const statusLabel = getHomeworkStatusLabel(homework);
  const statusColor = getHomeworkStatusColor(statusLabel);
  const statusTint = getHomeworkStatusTint(statusLabel);
  const dueDate = homework?.dueDate ?? "";
  const createdAt = homework?.createdAt ?? "";

  return (
    <TouchableOpacity
      className="rounded-2xl bg-white border border-surface-border p-4"
      style={cardShadow}
      activeOpacity={0.7}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open ${homework?.title ?? "homework"}`}
    >
      <View className="flex-row items-start justify-between mb-2">
        <Text className="text-slate-900 text-sm font-bold flex-1 mr-2" numberOfLines={1}>
          {homework?.title ?? "Untitled"}
        </Text>
        <HomeworkStatusBadge label={statusLabel} color={statusColor} tint={statusTint} />
      </View>

      <View className="gap-1.5">
        <View className="flex-row items-center">
          <View className="w-4 items-center mr-2">
            <Ionicons name="book-outline" size={13} color="#64748B" />
          </View>
          <Text className="text-slate-500 text-xs w-12">Subject:</Text>
          <Text className="text-slate-700 text-xs font-medium flex-1" numberOfLines={1}>
            {homework?.subject ?? "—"}
          </Text>
        </View>

        <View className="flex-row items-center">
          <View className="w-4 items-center mr-2">
            <Ionicons name="school-outline" size={13} color="#64748B" />
          </View>
          <Text className="text-slate-500 text-xs w-12">Class:</Text>
          <Text className="text-slate-700 text-xs font-medium flex-1" numberOfLines={1}>
            {homework?.class ?? ""}{homework?.section ? ` - ${homework.section}` : ""}
          </Text>
        </View>

        <View className="flex-row items-center">
          <View className="w-4 items-center mr-2">
            <Ionicons name="calendar-outline" size={13} color="#64748B" />
          </View>
          <Text className="text-slate-500 text-xs w-12">Due:</Text>
          <Text className="text-xs font-medium flex-1" style={{ color: statusColor }} numberOfLines={1}>
            {formatDate(dueDate)}
          </Text>
        </View>

        <View className="flex-row items-center">
          <View className="w-4 items-center mr-2">
            <Ionicons name="time-outline" size={13} color="#64748B" />
          </View>
          <Text className="text-slate-500 text-xs w-12">Created:</Text>
          <Text className="text-slate-400 text-xs flex-1" numberOfLines={1}>
            {formatDate(createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
