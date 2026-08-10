import { useCallback } from "react";
import { cardShadow } from "../theme/shadows";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components";
import { HomeworkStatusBadge } from "@/components/HomeworkStatusBadge";
import { useHomeworkDetail } from "@/hooks/useHomework";
import { getHomeworkStatusLabel, getHomeworkStatusColor, getHomeworkStatusTint } from "@/utils/homework";


function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function InfoRow({ icon, label, value, valueColor }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; valueColor?: string }) {
  return (
    <View className="flex-row items-center mb-2">
      <View className="w-5 items-center mr-2.5">
        <Ionicons name={icon} size={15} color="#64748B" />
      </View>
      <Text className="text-slate-500 text-sm w-20">{label}</Text>
      <Text className="text-slate-800 text-sm font-medium flex-1" numberOfLines={2} style={valueColor ? { color: valueColor } : undefined}>
        {value || "—"}
      </Text>
    </View>
  );
}

export function HomeworkDetailScreen() {
  const { id: homeworkId } = useLocalSearchParams<{ id: string }>();
  const { data: homework, isLoading, error, refetch } = useHomeworkDetail(homeworkId ?? "");

  const statusLabel = homework ? getHomeworkStatusLabel(homework) : "Upcoming";
  const statusColor = getHomeworkStatusColor(statusLabel);
  const statusTint = getHomeworkStatusTint(statusLabel);

  const handleEdit = useCallback(() => {
    if (!homework) return;
    router.push({ pathname: "/(tabs)/homework/create", params: { homeworkId: homework.id } });
  }, [homework]);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  // ── Loading ──
  if (isLoading || !homework) {
    return (
      <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
        <View className="flex-1 bg-surface-background">
          <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
            <View className="flex-row items-center">
              <TouchableOpacity className="w-9 h-9 items-center justify-center -ml-1 mr-2" onPress={handleBack} accessibilityRole="button" accessibilityLabel="Go back">
                <Ionicons name="chevron-back" size={22} color="#4F46E5" />
              </TouchableOpacity>
              <Text className="text-slate-900 text-[18px] font-semibold">Homework Details</Text>
            </View>
          </View>
          <View className="pt-4 px-4 gap-3">
            <View className="rounded-2xl bg-white border border-surface-border p-4" style={cardShadow}>
              {Array.from({ length: 6 }).map((_, i) => (
                <View key={i} className={`h-3 bg-slate-200 rounded mb-3 ${i === 0 ? "w-3/4" : i === 5 ? "w-1/2" : "w-full"}`} />
              ))}
            </View>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
        <View className="flex-1 bg-surface-background">
          <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
            <View className="flex-row items-center">
              <TouchableOpacity className="w-9 h-9 items-center justify-center -ml-1 mr-2" onPress={handleBack} accessibilityRole="button" accessibilityLabel="Go back">
                <Ionicons name="chevron-back" size={22} color="#4F46E5" />
              </TouchableOpacity>
              <Text className="text-slate-900 text-[18px] font-semibold">Homework Details</Text>
            </View>
          </View>
          <View className="items-center justify-center pt-20 pb-8 px-6">
            <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="cloud-offline-outline" size={32} color="#DC2626" />
            </View>
            <Text className="text-slate-800 text-lg font-bold text-center mb-2">Connection Error</Text>
            <Text className="text-slate-400 text-sm text-center leading-5 max-w-[260px] mb-6">
              {error?.message ?? "Failed to load homework"}
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
        </View>
      </ScreenContainer>
    );
  }

  // ── Detail ──
  return (
    <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
      <View className="flex-1 bg-surface-background">
        {/* Header */}
        <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
          <View className="flex-row items-center">
            <TouchableOpacity
              className="w-9 h-9 items-center justify-center -ml-1 mr-2"
              onPress={handleBack}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={22} color="#4F46E5" />
            </TouchableOpacity>
            <Text className="text-slate-900 text-[18px] font-semibold flex-1" numberOfLines={1}>
              Homework Details
            </Text>
            <TouchableOpacity
              className="w-9 h-9 bg-slate-100 rounded-full items-center justify-center"
              activeOpacity={0.7}
              onPress={handleEdit}
              accessibilityRole="button"
              accessibilityLabel="Edit homework"
            >
              <Ionicons name="create-outline" size={18} color="#4F46E5" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Title & Status */}
          <View className="pt-4 pb-2">
            <View className="flex-row items-start justify-between mb-1">
              <Text className="text-slate-900 text-xl font-bold flex-1 mr-3" numberOfLines={3}>
                {homework?.title ?? "Untitled"}
              </Text>
              <HomeworkStatusBadge label={statusLabel} color={statusColor} tint={statusTint} />
            </View>
          </View>

          {/* Description */}
          <View className="rounded-2xl bg-white border border-surface-border p-4 mb-3" style={cardShadow}>
            <Text className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Description</Text>
            <Text className="text-slate-700 text-sm leading-6">
              {homework?.description || "No description provided."}
            </Text>
          </View>

          {/* Class Information */}
          <View className="rounded-2xl bg-white border border-surface-border p-4 mb-3" style={cardShadow}>
            <Text className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">Class Information</Text>
            <InfoRow icon="school-outline" label="Class" value={`${homework?.class ?? ""}${homework?.section ? ` - ${homework.section}` : ""}`} />
            <InfoRow icon="book-outline" label="Subject" value={homework?.subject ?? "—"} />
          </View>

          {/* Schedule */}
          <View className="rounded-2xl bg-white border border-surface-border p-4 mb-3" style={cardShadow}>
            <Text className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">Schedule</Text>
            <InfoRow icon="calendar-outline" label="Created" value={formatDate(homework?.createdAt ?? "")} />
            <InfoRow icon="alarm-outline" label="Due Date" value={formatDate(homework?.dueDate ?? "")} valueColor={statusColor} />
          </View>

          {/* Attachments */}
          <View className="rounded-2xl bg-white border border-surface-border p-4" style={cardShadow}>
            <Text className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">Attachments</Text>
            {homework?.attachmentUrl ? (
              <TouchableOpacity
                className="flex-row items-center bg-slate-50 rounded-xl p-3"
                activeOpacity={0.7}
                onPress={() => {
                  // Open attachment URL
                }}
                accessibilityRole="button"
                accessibilityLabel="View attachment"
              >
                <View className="w-9 h-9 bg-primary-100 rounded-xl items-center justify-center mr-3">
                  <Ionicons name="link-outline" size={18} color="#4F46E5" />
                </View>
                <View className="flex-1 min-w-0">
                  <Text className="text-slate-700 text-sm font-medium" numberOfLines={1}>
                    Attachment
                  </Text>
                  <Text className="text-slate-400 text-xs mt-0.5" numberOfLines={1}>
                    {homework.attachmentUrl}
                  </Text>
                </View>
                <Ionicons name="open-outline" size={16} color="#94A3B8" />
              </TouchableOpacity>
            ) : (
              <View className="items-center py-4">
                <View className="w-12 h-12 bg-slate-50 rounded-full items-center justify-center mb-2">
                  <Ionicons name="link-outline" size={22} color="#CBD5E1" />
                </View>
                <Text className="text-slate-400 text-xs">No attachments</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
