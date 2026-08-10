import { useCallback } from "react";
import { cardShadow } from "../theme/shadows";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScreenContainer } from "@/components";
import { Card } from "@/components/ui/Card";
import { useNavParamStore } from "@/store/navParams.store";
import type { PeriodItem } from "@/types";


function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between py-3 border-b border-slate-100">
      <Text className="text-slate-500 text-[13px]">{label}</Text>
      <Text className="text-slate-900 text-[13px] font-medium text-right flex-1 ml-4" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function QuickActionButton({
  icon,
  label,
  onPress,
  tint,
  iconColor,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  tint: string;
  iconColor: string;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="flex-1 items-center rounded-2xl bg-white border border-surface-border px-4 py-4"
      style={cardShadow}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View
        className="w-12 h-12 rounded-2xl items-center justify-center mb-2"
        style={{ backgroundColor: tint }}
      >
        <Ionicons name={icon} size={24} color={iconColor} />
      </View>
      <Text className="text-slate-700 text-[13px] font-medium text-center leading-5" numberOfLines={2}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function PeriodDetailScreen() {
  const storedPeriod = useNavParamStore((s) => s.params.period);
  const period = storedPeriod as PeriodItem | undefined;

  const handleMarkAttendance = useCallback(() => {
    router.push("/(tabs)/attendance");
  }, []);

  const handleAssignHomework = useCallback(() => {
    if (!period) return;
    router.push({
      pathname: "/(tabs)/homework/create",
      params: {
        subject: period?.subject ?? "",
        className: period?.className ?? "",
        section: period?.section ?? "",
      },
    });
  }, [period]);

  if (!period) {
    return (
      <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
        <View className="flex-1 bg-surface-background">
          <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.back()}
                className="w-9 h-9 bg-slate-100 rounded-full items-center justify-center"
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
              <Text className="text-slate-900 text-[18px] font-semibold">Period Detail</Text>
              <View className="w-9" />
            </View>
          </View>
          <View className="items-center justify-center flex-1 px-4">
            <View className="w-16 h-16 bg-slate-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="alert-circle-outline" size={32} color="#CBD5E1" />
            </View>
            <Text className="text-slate-700 text-[15px] font-semibold mb-1">Period not found</Text>
            <Text className="text-slate-400 text-[13px] text-center leading-5 max-w-[260px]">
              The period details could not be loaded.
            </Text>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  const subject = period?.subject ?? "Unnamed Period";
  const periodNumber = period?.periodNumber ?? "?";
  const className = period?.className ?? "";
  const section = period?.section ?? "";
  const teacher = period?.teacher ?? "Not assigned";
  const room = period?.room ?? "Room Not Assigned";
  const startTime = period?.startTime ?? "--:--";
  const endTime = period?.endTime ?? "--:--";
  const studentCount = period?.studentCount ?? 0;
  const classLabel = [className, section].filter(Boolean).join(" - ");
  const initial = subject.charAt(0) ?? "?";
  const timeRange = `${startTime} - ${endTime}`;

  return (
    <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
      <View className="flex-1 bg-surface-background">
        <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.back()}
              className="w-9 h-9 bg-slate-100 rounded-full items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
            <Text className="text-slate-900 text-[18px] font-semibold">Period Detail</Text>
            <View className="w-9" />
          </View>
        </View>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="pt-4">
            <Card variant="elevated" padding="md" className="mb-4">
              <View className="flex-row items-center">
                <View className="w-14 h-14 bg-primary-600 rounded-2xl items-center justify-center mr-4">
                  <Text className="text-white text-[22px] font-bold">{initial}</Text>
                </View>
                <View className="flex-1 min-w-0">
                  <Text className="text-slate-900 text-[18px] font-semibold" numberOfLines={1}>
                    {subject}
                  </Text>
                  <Text className="text-slate-500 text-[13px] mt-0.5">Period {periodNumber}</Text>
                </View>
              </View>
            </Card>

            <Card variant="elevated" padding="md" className="mb-4">
              {classLabel ? <DetailRow label="Class" value={classLabel} /> : null}
              <DetailRow label="Teacher" value={teacher} />
              <DetailRow label="Room" value={room} />
              <DetailRow label="Time" value={timeRange} />
              <DetailRow label="Students" value={`${studentCount} enrolled`} />
            </Card>

            <Text className="text-slate-400 text-[11px] font-semibold uppercase tracking-wide mb-3 ml-1">
              Quick Actions
            </Text>
            <View className="flex-row gap-3">
              <QuickActionButton
                icon="clipboard-outline"
                label="Mark Attendance"
                onPress={handleMarkAttendance}
                tint="#EFF6FF"
                iconColor="#2563EB"
              />
              <QuickActionButton
                icon="create-outline"
                label="Assign Homework"
                onPress={handleAssignHomework}
                tint="#FFFBEB"
                iconColor="#D97706"
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
