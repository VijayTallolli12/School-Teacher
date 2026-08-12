import React, { useMemo, useState, useCallback } from "react";
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
import { router } from "expo-router";
import { ScreenContainer } from "@/components";
import { Card } from "@/components/ui/Card";
import { useTodayTimetable, useWeeklyTimetable } from "@/hooks/useTimetable";
import { useNavParamStore } from "@/store/navParams.store";
import type { PeriodItem } from "@/types";


const STATUS_CONFIG = {
  current: { dot: "#4F46E5", bg: "#EEF2FF", label: "Current" },
  upcoming: { dot: "#94A3B8", bg: "#F8FAFC", label: "Upcoming" },
  completed: { dot: "#22C55E", bg: "#F0FDF4", label: "Completed" },
} as const;

function PeriodStatusDot({ status }: { status: "current" | "upcoming" | "completed" }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <View
      className="w-2.5 h-2.5 rounded-full mt-1.5"
      style={{ backgroundColor: cfg.dot }}
    />
  );
}

function PeriodStatusBadge({ status }: { status: "current" | "upcoming" | "completed" }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: cfg.bg }}>
      <Text className="text-[11px] font-medium" style={{ color: cfg.dot }}>
        {cfg.label}
      </Text>
    </View>
  );
}

function PeriodCardItem({
  period,
  status,
  onPress,
}: {
  period: PeriodItem;
  status: "current" | "upcoming" | "completed";
  onPress: () => void;
}) {
  const subject = period?.subject ?? "Unnamed Period";
  const periodNumber = period?.periodNumber ?? "?";
  const startTime = period?.startTime ?? "--:--";
  const endTime = period?.endTime ?? "--:--";
  const className = period?.className ?? "";
  const section = period?.section ?? "";
  const room = period?.room ?? "Room Not Assigned";
  const classLabel = [className, section].filter(Boolean).join(" - ");

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} accessibilityRole="button">
      <Card variant="elevated" padding="md" className="mb-3">
        <View className="flex-row items-start">
          <View className="mr-3 pt-0.5">
            <PeriodStatusDot status={status} />
          </View>
          <View className="flex-1 min-w-0">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-slate-900 text-[15px] font-semibold" numberOfLines={1}>
                Period {periodNumber}
              </Text>
              <PeriodStatusBadge status={status} />
            </View>
            <Text className="text-slate-800 text-[15px] mb-1.5" numberOfLines={1}>
              {subject}
            </Text>
            <View className="flex-row items-center mb-0.5">
              <Ionicons name="time-outline" size={13} color="#94A3B8" />
              <Text className="text-slate-500 text-[12px] ml-1.5">
                {startTime} - {endTime}
              </Text>
            </View>
            <View className="flex-row items-center mb-0.5">
              <Ionicons name="people-outline" size={13} color="#94A3B8" />
              <Text className="text-slate-500 text-[12px] ml-1.5" numberOfLines={1}>
                {classLabel || "No class assigned"}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={13} color="#94A3B8" />
              <Text className="text-slate-500 text-[12px] ml-1.5" numberOfLines={1}>
                {room}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#CBD5E1" className="ml-2 mt-0.5" />
        </View>
      </Card>
    </TouchableOpacity>
  );
}

function CurrentPeriodBannerInline({
  currentPeriod,
  nextPeriod,
  onCurrentPress,
  onNextPress,
}: {
  currentPeriod: PeriodItem | null | undefined;
  nextPeriod: PeriodItem | null | undefined;
  onCurrentPress?: () => void;
  onNextPress?: () => void;
}) {
  if (!currentPeriod && !nextPeriod) return null;

  return (
    <Card variant="elevated" padding="md" className="mb-4" style={{ backgroundColor: "#EEF2FF" }}>
      {currentPeriod ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onCurrentPress}
          accessibilityRole="button"
          className="flex-row items-center"
        >
          <View className="w-10 h-10 bg-primary-600 rounded-xl items-center justify-center mr-3">
            <Ionicons name="play-circle" size={20} color="#FFFFFF" />
          </View>
          <View className="flex-1 min-w-0">
            <Text className="text-primary-700 text-[11px] font-semibold uppercase tracking-wide">
              Current Period
            </Text>
            <Text className="text-slate-900 text-[15px] font-semibold mt-0.5" numberOfLines={1}>
              {currentPeriod?.subject ?? "Unnamed Period"}
            </Text>
            <Text className="text-slate-500 text-[12px] mt-0.5" numberOfLines={1}>
              {currentPeriod?.startTime ?? "--:--"} - {currentPeriod?.endTime ?? "--:--"} · Room {currentPeriod?.room ?? "N/A"}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#A5B4FC" />
        </TouchableOpacity>
      ) : null}
      {currentPeriod && nextPeriod ? (
        <View className="h-px bg-blue-100 my-3" />
      ) : null}
      {nextPeriod ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onNextPress}
          accessibilityRole="button"
          className="flex-row items-center"
        >
          <View className="w-10 h-10 bg-slate-100 rounded-xl items-center justify-center mr-3">
            <Ionicons name="time-outline" size={20} color="#64748B" />
          </View>
          <View className="flex-1 min-w-0">
            <Text className="text-slate-400 text-[11px] font-semibold uppercase tracking-wide">
              Next Period
            </Text>
            <Text className="text-slate-900 text-[15px] font-semibold mt-0.5" numberOfLines={1}>
              {nextPeriod?.subject ?? "Unnamed Period"}
            </Text>
            <Text className="text-slate-500 text-[12px] mt-0.5" numberOfLines={1}>
              {nextPeriod?.startTime ?? "--:--"} - {nextPeriod?.endTime ?? "--:--"} · Room {nextPeriod?.room ?? "N/A"}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
        </TouchableOpacity>
      ) : null}
    </Card>
  );
}

function EmptyTimetableState({ isWeekView, dayName }: { isWeekView?: boolean; dayName?: string }) {
  return (
    <View className="items-center justify-center pt-16 pb-8">
      <View className="w-16 h-16 bg-slate-50 rounded-full items-center justify-center mb-4">
        <Ionicons name="calendar-outline" size={32} color="#CBD5E1" />
      </View>
      <Text className="text-slate-700 text-[15px] font-semibold mb-1">
        {isWeekView ? (dayName ? `No classes on ${dayName}` : "No classes this week") : "No classes today"}
      </Text>
      <Text className="text-slate-400 text-[13px] text-center leading-5 max-w-[260px]">
        {isWeekView
          ? "You have no classes scheduled for this period."
          : "Enjoy your day off!"}
      </Text>
    </View>
  );
}

function RetryView({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View className="items-center justify-center pt-20 pb-8">
      <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
        <Ionicons name="cloud-offline-outline" size={32} color="#DC2626" />
      </View>
      <Text className="text-slate-800 text-lg font-bold text-center mb-2">Connection Error</Text>
      <Text className="text-slate-400 text-sm text-center leading-5 max-w-[260px] mb-6">
        {message}
      </Text>
      <TouchableOpacity
        className="flex-row items-center bg-primary-600 px-6 py-3 rounded-xl"
        activeOpacity={0.7}
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Retry"
      >
        <Ionicons name="refresh-outline" size={18} color="#FFFFFF" />
        <Text className="text-white font-semibold text-sm ml-2">Retry</Text>
      </TouchableOpacity>
    </View>
  );
}

const WEEKDAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday",
];

function getPeriodStatus(
  period: PeriodItem,
  currentPeriodId?: string | null,
  nextPeriodId?: string | null,
): "current" | "upcoming" | "completed" {
  if (!period?.id) return "completed";
  if (currentPeriodId && period.id === currentPeriodId) return "current";
  if (nextPeriodId && period.id === nextPeriodId) return "upcoming";
  return "completed";
}

export function TimetableScreen() {
  const [mode, setMode] = useState<"today" | "week">("today");
  const [selectedDay, setSelectedDay] = useState<string>("");

  const {
    data: todayData,
    isLoading: todayLoading,
    isError: todayError,
    refetch: refetchToday,
    isRefetching: todayRefetching,
  } = useTodayTimetable();

  const {
    data: weekData,
    isLoading: weekLoading,
    isError: weekError,
    refetch: refetchWeek,
    isRefetching: weekRefetching,
  } = useWeeklyTimetable();

  const setNavParams = useNavParamStore((s) => s.setParams);

  const handlePeriodPress = useCallback(
    (period: PeriodItem) => {
      setNavParams("period", period);
      router.push("/(tabs)/more/period-detail");
    },
    [setNavParams],
  );

  const isLoading = mode === "today" ? todayLoading : weekLoading;
  const isError = mode === "today" ? todayError : weekError;
  const isRefetching = mode === "today" ? todayRefetching : weekRefetching;

  const handleRefresh = useCallback(() => {
    if (mode === "today") refetchToday();
    else refetchWeek();
  }, [mode, refetchToday, refetchWeek]);

  React.useEffect(() => {
    if (weekData && weekData.length > 0 && !selectedDay) {
      const firstDay = weekData[0]?.day;
      if (firstDay) setSelectedDay(firstDay);
    }
  }, [weekData, selectedDay]);

  const weekDayMap = useMemo(() => {
    const map = new Map<string, PeriodItem[]>();
    if (weekData) {
      weekData.forEach((d) => {
        if (d?.day && d?.periods) map.set(d.day, d.periods);
      });
    }
    return map;
  }, [weekData]);

  const selectedDayPeriods = useMemo(
    () => weekDayMap.get(selectedDay) ?? [],
    [weekDayMap, selectedDay],
  );

  const availableDays = useMemo(
    () => (weekData ?? []).map((d) => d?.day).filter(Boolean) as string[],
    [weekData],
  );

  const todayName = WEEKDAY_NAMES[new Date().getDay()] ?? "Unknown";

  const renderContent = () => {
    if (isLoading) {
      return (
        <View className="items-center justify-center pt-24 pb-8">
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text className="text-slate-400 text-sm mt-3">Loading timetable...</Text>
        </View>
      );
    }

    if (isError) {
      return (
        <RetryView
          message={
            mode === "today"
              ? "Could not load today's timetable."
              : "Could not load weekly timetable."
          }
          onRetry={handleRefresh}
        />
      );
    }

    if (mode === "today") {
      if (!todayData?.day?.periods || todayData.day.periods.length === 0) {
        return <EmptyTimetableState />;
      }

      const day = todayData.day;
      const currentPeriod = todayData.currentPeriod ?? null;
      const nextPeriod = todayData.nextPeriod ?? null;

      return (
        <>
          <CurrentPeriodBannerInline
            currentPeriod={currentPeriod}
            nextPeriod={nextPeriod}
            onCurrentPress={
              currentPeriod ? () => handlePeriodPress(currentPeriod) : undefined
            }
            onNextPress={
              nextPeriod ? () => handlePeriodPress(nextPeriod) : undefined
            }
          />
          {day.periods.map((period, index) => (
            <PeriodCardItem
              key={period?.id ?? `period-${index}`}
              period={period}
              status={getPeriodStatus(period, currentPeriod?.id, nextPeriod?.id)}
              onPress={() => handlePeriodPress(period)}
            />
          ))}
        </>
      );
    }

    if (weekData && weekData.length === 0) {
      return <EmptyTimetableState isWeekView />;
    }

    const periods = selectedDayPeriods;

    return (
      <>
        <View className="mb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-1"
            contentContainerStyle={{ paddingHorizontal: 4 }}
          >
            {availableDays.map((day) => (
              <TouchableOpacity
                key={day}
                activeOpacity={0.7}
                onPress={() => setSelectedDay(day)}
                accessibilityRole="button"
                className={`px-4 py-2 rounded-full mr-2 ${
                  selectedDay === day ? "bg-primary-600" : "bg-white border border-slate-200"
                }`}
              >
                <Text
                  className={`text-[13px] font-medium ${
                    selectedDay === day ? "text-white" : "text-slate-600"
                  }`}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        {periods.length === 0 ? (
          <EmptyTimetableState isWeekView dayName={selectedDay} />
        ) : (
          periods.map((period, index) => (
            <PeriodCardItem
              key={period?.id ?? `period-${index}`}
              period={period}
              status="upcoming"
              onPress={() => handlePeriodPress(period)}
            />
          ))
        )}
      </>
    );
  };

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
              <Text className="text-slate-900 text-[18px] font-semibold flex-1" numberOfLines={1}>Timetable</Text>
            </View>
            <TouchableOpacity
              className="w-9 h-9 bg-slate-100 rounded-full items-center justify-center"
              activeOpacity={0.7}
              onPress={() => router.push("/(tabs)/notifications")}
              accessibilityRole="button"
              accessibilityLabel="Open notifications"
            >
              <Ionicons name="notifications-outline" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>
          <View className="flex-row mt-3 bg-slate-100 rounded-lg p-0.5 self-start">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setMode("today")}
              accessibilityRole="button"
              className={`px-4 py-1.5 rounded-md ${mode === "today" ? "bg-white shadow-sm" : ""}`}
              style={mode === "today" ? cardShadow : undefined}
            >
              <Text
                className={`text-[13px] font-medium ${
                  mode === "today" ? "text-slate-900" : "text-slate-500"
                }`}
              >
                Today
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setMode("week")}
              accessibilityRole="button"
              className={`px-4 py-1.5 rounded-md ${mode === "week" ? "bg-white shadow-sm" : ""}`}
              style={mode === "week" ? cardShadow : undefined}
            >
              <Text
                className={`text-[13px] font-medium ${
                  mode === "week" ? "text-slate-900" : "text-slate-500"
                }`}
              >
                Week
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              tintColor="#4F46E5"
              colors={["#4F46E5"]}
            />
          }
        >
          <View className="pt-4">{renderContent()}</View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
