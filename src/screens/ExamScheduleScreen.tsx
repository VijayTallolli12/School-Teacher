import { useCallback, useMemo, useState } from "react";
import { cardShadow } from "../theme/shadows";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components";
import { Card } from "@/components/ui/Card";
import { useExamSchedule, useExamDetail } from "@/hooks/useExams";
import type { ExamScheduleItem } from "@/types";


function formatTime(time: string): string {
  const parts = time?.split(":") ?? [];
  const h = parseInt(parts[0] ?? "0", 10);
  const m = parts[1] ?? "00";
  const ampm = h >= 12 ? "PM" : "AM";
  const displayHour = h % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
}

function groupByDate(items: ExamScheduleItem[]): Record<string, ExamScheduleItem[]> {
  const grouped: Record<string, ExamScheduleItem[]> = {};
  items.forEach((item) => {
    const date = item?.date ?? "Unknown Date";
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(item);
  });
  return grouped;
}

function formatDateLabel(date: string): string {
  try {
    const d = new Date(date);
    return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  } catch {
    return date ?? "Unknown Date";
  }
}

export function ExamScheduleScreen() {
  const { examId } = useLocalSearchParams<{ examId: string }>();
  const { data: exam } = useExamDetail(examId ?? "");
  const { data: schedule, isLoading, error, refetch, isRefetching } = useExamSchedule(examId ?? "");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try { await refetch(); } finally { setRefreshing(false); }
  }, [refetch]);

  const grouped = useMemo(() => {
    if (!schedule) return {};
    return groupByDate(schedule);
  }, [schedule]);

  const sortedDates = useMemo(() => {
    return Object.keys(grouped).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }, [grouped]);

  if (error) {
    return (
      <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
        <View className="flex-1 bg-surface-background">
          <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
            <View className="flex-row items-center">
              <TouchableOpacity className="mr-3" activeOpacity={0.7} onPress={() => router.back()}>
                <Ionicons name="close" size={24} color="#334155" />
              </TouchableOpacity>
              <Text className="text-slate-900 text-[18px] font-semibold">Exam Schedule</Text>
            </View>
          </View>
          <View className="items-center justify-center flex-1 px-4">
            <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="cloud-offline-outline" size={32} color="#DC2626" />
            </View>
            <Text className="text-slate-800 text-lg font-bold text-center mb-2">Unable to Load Schedule</Text>
            <Text className="text-slate-400 text-sm text-center leading-5 max-w-[260px] mb-6">
              {error?.message ?? "Please check your connection and try again"}
            </Text>
            <TouchableOpacity
              className="flex-row items-center bg-primary-600 px-6 py-3 rounded-xl"
              activeOpacity={0.7}
              onPress={() => refetch()}
            >
              <Ionicons name="refresh-outline" size={18} color="#FFFFFF" />
              <Text className="text-white font-semibold text-sm ml-2">Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  if (isLoading) {
    return (
      <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
        <View className="flex-1 bg-surface-background">
          <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
            <View className="flex-row items-center">
              <TouchableOpacity className="mr-3" activeOpacity={0.7} onPress={() => router.back()}>
                <Ionicons name="close" size={24} color="#334155" />
              </TouchableOpacity>
              <Text className="text-slate-900 text-[18px] font-semibold">Exam Schedule</Text>
            </View>
          </View>
          <View className="items-center justify-center flex-1">
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text className="text-slate-400 text-sm mt-3">Loading schedule...</Text>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
      <View className="flex-1 bg-surface-background">
        <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 min-w-0">
              <TouchableOpacity className="mr-3" activeOpacity={0.7} onPress={() => router.back()}>
                <Ionicons name="close" size={24} color="#334155" />
              </TouchableOpacity>
              <Text className="text-slate-900 text-[18px] font-semibold" numberOfLines={1}>Exam Schedule</Text>
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#4F46E5" colors={["#4F46E5"]} />
          }
        >
          {exam && (
            <View className="flex-row items-center mb-4 px-1">
              <View className="w-8 h-8 rounded-lg bg-indigo-50 items-center justify-center mr-2.5">
                <Ionicons name="school-outline" size={16} color="#4F46E5" />
              </View>
              <Text className="text-slate-500 text-sm flex-1" numberOfLines={1}>
                {exam?.name ?? ""} — {exam?.className ?? ""} {exam?.section ?? ""}
              </Text>
            </View>
          )}

          {!schedule || schedule.length === 0 ? (
            <View className="items-center justify-center pt-16 pb-8">
              <View className="w-16 h-16 bg-slate-50 rounded-full items-center justify-center mb-4">
                <Ionicons name="calendar-outline" size={32} color="#CBD5E1" />
              </View>
              <Text className="text-slate-800 text-lg font-bold text-center mb-2">No Schedule</Text>
              <Text className="text-slate-400 text-sm text-center leading-5 max-w-[260px]">
                No schedule entries found for this exam.
              </Text>
            </View>
          ) : (
            sortedDates.map((date) => (
              <View key={date} className="mb-5">
                <View className="flex-row items-center mb-3">
                  <View className="w-1 h-5 rounded-full bg-primary-500 mr-2.5" />
                  <Text className="text-slate-900 text-[15px] font-semibold">{formatDateLabel(date)}</Text>
                </View>
                {grouped[date].map((entry, index) => {
                  const duration = (() => {
                    try {
                      const start = entry?.startTime?.split(":") ?? [];
                      const end = entry?.endTime?.split(":") ?? [];
                      const startMin = parseInt(start[0] ?? "0", 10) * 60 + parseInt(start[1] ?? "0", 10);
                      const endMin = parseInt(end[0] ?? "0", 10) * 60 + parseInt(end[1] ?? "0", 10);
                      return `${endMin - startMin} min`;
                    } catch {
                      return "-- min";
                    }
                  })();

                  return (
                    <Card key={entry?.id ?? `schedule-${index}`} className="mb-2.5">
                      <View className="flex-row items-start">
                        <View className="w-9 h-9 rounded-xl bg-indigo-50 items-center justify-center mr-3">
                          <Text className="text-indigo-600 text-sm font-bold">{index + 1}</Text>
                        </View>
                        <View className="flex-1 min-w-0">
                          <Text className="text-slate-900 text-[15px] font-semibold" numberOfLines={1}>
                            {entry?.subject ?? "Unknown Subject"}
                          </Text>
                          <Text className="text-slate-400 text-xs mt-0.5" numberOfLines={1}>
                            {entry?.className ?? ""} {entry?.section ?? ""}
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row flex-wrap gap-x-4 gap-y-2 mt-3 pt-2.5 border-t border-surface-border">
                        <View className="flex-row items-center">
                          <Ionicons name="time-outline" size={14} color="#94A3B8" />
                          <Text className="text-slate-500 text-xs ml-1.5">
                            {formatTime(entry?.startTime ?? "")} — {formatTime(entry?.endTime ?? "")}
                          </Text>
                        </View>
                        <View className="flex-row items-center">
                          <Ionicons name="hourglass-outline" size={14} color="#94A3B8" />
                          <Text className="text-slate-500 text-xs ml-1.5">{duration}</Text>
                        </View>
                        <View className="flex-row items-center">
                          <Ionicons name="location-outline" size={14} color="#94A3B8" />
                          <Text className="text-slate-500 text-xs ml-1.5">
                            {(entry as unknown as Record<string, string>)?.room ?? "Room Not Assigned"}
                          </Text>
                        </View>
                      </View>
                    </Card>
                  );
                })}
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
