import { useCallback, useMemo, useState } from "react";
import { cardShadow } from "../theme/shadows";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScreenContainer } from "@/components";
import { Card } from "@/components/ui/Card";
import { useExams } from "@/hooks/useExams";
import type { ExamItem } from "@/types";


const STATUS_CONFIG = {
  upcoming: { label: "Upcoming", icon: "calendar-outline" as const, color: "#4F46E5", tint: "#EEF2FF" },
  ongoing: { label: "Ongoing", icon: "time-outline" as const, color: "#059669", tint: "#ECFDF5" },
  completed: { label: "Completed", icon: "checkmark-circle-outline" as const, color: "#64748B", tint: "#F1F5F9" },
};

function StatusBadge({ status }: { status: ExamItem["status"] }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.upcoming;
  return (
    <View className="px-2.5 py-1 rounded-full" style={{ backgroundColor: config.tint }}>
      <Text className="text-xs font-semibold" style={{ color: config.color }}>{config.label}</Text>
    </View>
  );
}

export function ExamsScreen() {
  const { data: exams, isLoading, isError, refetch } = useExams();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try { await refetch(); } finally { setRefreshing(false); }
  }, [refetch]);

  const metrics = useMemo(() => {
    if (!exams) return [];
    const upcoming = exams.filter((e) => e?.status === "upcoming").length;
    const ongoing = exams.filter((e) => e?.status === "ongoing").length;
    const completed = exams.filter((e) => e?.status === "completed").length;
    return [
      { label: "Upcoming", value: upcoming, icon: "calendar-outline" as const, color: "#4F46E5", tint: "#EEF2FF" },
      { label: "Ongoing", value: ongoing, icon: "time-outline" as const, color: "#059669", tint: "#ECFDF5" },
      { label: "Completed", value: completed, icon: "checkmark-circle-outline" as const, color: "#64748B", tint: "#F1F5F9" },
    ];
  }, [exams]);

  const renderExamCard = useCallback(({ item }: { item: ExamItem }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push({ pathname: "/(tabs)/more/exam-detail", params: { examId: item.id } })}
    >
      <Card className="mb-3">
        <View className="flex-row items-start justify-between mb-2">
          <View className="flex-1 min-w-0 mr-3">
            <Text className="text-slate-900 text-[15px] font-semibold" numberOfLines={1}>
              {item?.name ?? "Unnamed Exam"}
            </Text>
            <Text className="text-slate-500 text-sm mt-0.5" numberOfLines={1}>
              {item?.subject ?? "Unknown Subject"}
            </Text>
          </View>
          <StatusBadge status={item?.status ?? "upcoming"} />
        </View>
        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center">
            <Ionicons name="school-outline" size={14} color="#94A3B8" />
            <Text className="text-slate-400 text-xs ml-1.5">
              {item?.className ?? ""} {item?.section ?? ""}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={14} color="#94A3B8" />
            <Text className="text-slate-400 text-xs ml-1.5">{item?.date ?? "--"}</Text>
          </View>
        </View>
        <View className="flex-row items-center mt-2 pt-2 border-t border-surface-border">
          {(item?.duration ?? 0) > 0 && (
            <View className="flex-row items-center flex-1">
              <Ionicons name="time-outline" size={14} color="#94A3B8" />
              <Text className="text-slate-400 text-xs ml-1.5">{item?.duration} min</Text>
            </View>
          )}
          <View className="flex-row items-center">
            <Ionicons name="stats-chart-outline" size={14} color="#94A3B8" />
            <Text className="text-slate-500 text-xs font-medium ml-1.5">
              {item?.totalMarks ?? 0} marks
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  ), []);

  const keyExtractor = useCallback((item: ExamItem) => item?.id ?? Math.random().toString(), []);

  return (
    <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
      <View className="flex-1 bg-surface-background">
        <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 min-w-0">
              <TouchableOpacity
                className="w-9 h-9 bg-slate-100 rounded-full items-center justify-center mr-2"
                activeOpacity={0.7}
                onPress={() => router.back()}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <Ionicons name="chevron-back" size={22} color="#334155" />
              </TouchableOpacity>
              <Text className="text-slate-900 text-[18px] font-semibold flex-1" numberOfLines={1}>Exams</Text>
            </View>
            <TouchableOpacity
              className="w-9 h-9 bg-slate-100 rounded-full items-center justify-center"
              activeOpacity={0.7}
              onPress={() => router.push("/(tabs)/notifications")}
            >
              <Ionicons name="notifications-outline" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        {isLoading ? (
          <View className="items-center justify-center flex-1">
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text className="text-slate-400 text-sm mt-3">Loading exams...</Text>
          </View>
        ) : isError ? (
          <View className="items-center justify-center flex-1 px-4">
            <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="cloud-offline-outline" size={32} color="#DC2626" />
            </View>
            <Text className="text-slate-800 text-lg font-bold text-center mb-2">Connection Error</Text>
            <Text className="text-slate-400 text-sm text-center leading-5 max-w-[260px] mb-6">
              Could not load exams. Pull down to retry.
            </Text>
            <TouchableOpacity
              className="flex-row items-center bg-primary-600 px-6 py-3 rounded-xl"
              activeOpacity={0.7}
              onPress={handleRefresh}
            >
              <Ionicons name="refresh-outline" size={18} color="#FFFFFF" />
              <Text className="text-white font-semibold text-sm ml-2">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : !exams || exams.length === 0 ? (
          <View className="items-center justify-center flex-1 px-4">
            <View className="w-16 h-16 bg-slate-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="calendar-outline" size={32} color="#CBD5E1" />
            </View>
            <Text className="text-slate-800 text-lg font-bold text-center mb-2">No Exams</Text>
            <Text className="text-slate-400 text-sm text-center leading-5 max-w-[260px]">
              No exams have been scheduled yet.
            </Text>
          </View>
        ) : (
          <FlatList
            data={exams}
            renderItem={renderExamCard}
            keyExtractor={keyExtractor}
            contentContainerStyle={{ padding: 16, paddingBottom: 12 }}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View className="flex-row gap-3 mb-4">
                {metrics.map((metric) => (
                  <View
                    key={metric.label}
                    className="flex-1 rounded-2xl bg-white border border-surface-border p-4"
                    style={cardShadow}
                  >
                    <View className="flex-row items-center justify-between mb-3">
                      <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: metric.tint }}>
                        <Ionicons name={metric.icon} size={18} color={metric.color} />
                      </View>
                    </View>
                    <Text className="text-slate-900 text-[28px] font-bold" numberOfLines={1}>
                      {metric.value}
                    </Text>
                    <Text className="text-slate-500 text-[13px] font-medium mt-1" numberOfLines={1}>
                      {metric.label}
                    </Text>
                  </View>
                ))}
              </View>
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#4F46E5" colors={["#4F46E5"]} />
            }
          />
        )}
      </View>
    </ScreenContainer>
  );
}
