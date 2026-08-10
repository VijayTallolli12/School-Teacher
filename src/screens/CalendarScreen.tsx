import { useMemo } from "react";
import { cardShadow } from "../theme/shadows";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScreenContainer } from "@/components";
import { Card } from "@/components/ui/Card";
import { useWeeklyTimetable } from "../hooks/useTimetable";


function SkeletonCard() {
  return (
    <View className="rounded-2xl bg-white border border-surface-border p-4 mb-3" style={cardShadow}>
      <View className="flex-row items-center">
        <View className="w-10 h-10 rounded-xl bg-slate-200 mr-3" />
        <View className="flex-1 gap-1.5">
          <View className="h-3.5 w-28 bg-slate-200 rounded" />
          <View className="h-3 w-36 bg-slate-100 rounded" />
        </View>
        <View className="w-4 h-4 bg-slate-100 rounded" />
      </View>
    </View>
  );
}

export function CalendarScreen() {
  const { data: weekData, isLoading, isError, refetch, isRefetching } = useWeeklyTimetable();

  const days = useMemo(() => weekData ?? [], [weekData]);

  if (isLoading) {
    return (
      <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
        <View className="flex-1 bg-surface-background">
          <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
            <View className="flex-row items-center">
              <Text className="text-slate-900 text-[18px] font-semibold">Calendar</Text>
            </View>
          </View>
          <View className="pt-4 px-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
      <View className="flex-1 bg-surface-background">
        <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
          <View className="flex-row items-center">
            <TouchableOpacity
              className="w-8 h-8 rounded-full items-center justify-center mr-2"
              activeOpacity={0.7}
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="close" size={22} color="#334155" />
            </TouchableOpacity>
            <Text className="text-slate-900 text-[18px] font-semibold">Calendar</Text>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#4F46E5" colors={["#4F46E5"]} />
          }
        >
          {isError ? (
            <View className="items-center justify-center pt-20 pb-8">
              <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
                <Ionicons name="cloud-offline-outline" size={32} color="#DC2626" />
              </View>
              <Text className="text-slate-800 text-lg font-bold text-center mb-2">Unable to Load Calendar</Text>
              <Text className="text-slate-400 text-sm text-center leading-5 max-w-[260px] mb-6">
                Pull down to retry.
              </Text>
              <TouchableOpacity
                className="flex-row items-center bg-primary-600 px-6 py-3 rounded-xl"
                activeOpacity={0.7}
                onPress={() => refetch()}
                accessibilityRole="button"
                accessibilityLabel="Retry"
              >
                <Ionicons name="refresh-outline" size={18} color="#FFFFFF" />
                <Text className="text-white font-semibold text-sm ml-2">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : days.length === 0 ? (
            <View className="items-center justify-center pt-20 pb-8">
              <View className="w-16 h-16 bg-slate-100 rounded-full items-center justify-center mb-4">
                <Ionicons name="calendar-outline" size={32} color="#CBD5E1" />
              </View>
              <Text className="text-slate-700 text-sm font-semibold text-center">No calendar items found</Text>
              <Text className="text-slate-400 text-xs mt-1 text-center leading-5 max-w-[240px]">
                Your timetable calendar will appear here.
              </Text>
            </View>
          ) : (
            <View className="pt-4 gap-3">
              {days.map((day, index) => {
                const periods = day?.periods ?? [];
                return (
                  <TouchableOpacity
                    key={day?.day ?? `day-${index}`}
                    activeOpacity={0.72}
                    onPress={() => router.push("/(tabs)/more/timetable")}
                    accessibilityRole="button"
                    accessibilityLabel={`Open timetable for ${day?.day ?? "day"}`}
                  >
                    <Card padding="md" style={cardShadow}>
                      <View className="flex-row items-center">
                        <View className="w-10 h-10 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: "#EFF6FF" }}>
                          <Ionicons name="calendar-outline" size={18} color="#2563EB" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-slate-800 text-sm font-bold">{day?.day ?? "Unknown Day"}</Text>
                          <Text className="text-slate-400 text-xs mt-0.5">
                            {periods.length === 0
                              ? "No classes scheduled"
                              : `${periods.length} period${periods.length > 1 ? "s" : ""} scheduled`}
                          </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                      </View>
                    </Card>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
