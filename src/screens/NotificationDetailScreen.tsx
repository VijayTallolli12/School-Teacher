import { useCallback, useEffect } from "react";
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
import { NotificationBadge } from "@/components/NotificationBadge";
import { useMarkAsRead } from "@/hooks/useNotifications";
import type { NotificationType } from "@/types";


const TYPE_CONFIG: Record<string, { icon: keyof typeof Ionicons.glyphMap; tint: string; color: string; label: string }> = {
  attendance: { icon: "checkbox-outline", tint: "#EFF6FF", color: "#2563EB", label: "Attendance" },
  homework: { icon: "document-text-outline", tint: "#FFF7ED", color: "#EA580C", label: "Homework" },
  exam: { icon: "school-outline", tint: "#F5F3FF", color: "#7C3AED", label: "Exam" },
  fee: { icon: "wallet-outline", tint: "#FFFBEB", color: "#D97706", label: "Fee" },
  transport: { icon: "bus-outline", tint: "#F0FDF4", color: "#16A34A", label: "Transport" },
  system: { icon: "megaphone-outline", tint: "#F8FAFC", color: "#64748B", label: "School update" },
  ai_agent: { icon: "hardware-chip-outline", tint: "#ECFEFF", color: "#0891B2", label: "Assistant" },
};

function formatFullDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
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

export function NotificationDetailScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    title?: string;
    body?: string;
    type?: string;
    is_read?: string;
    created_at?: string;
    priority?: string;
  }>();

  const id = params?.id ?? "";
  const title = params?.title ?? "Notification";
  const message = params?.body ?? "";
  const type = (params?.type ?? "system") as NotificationType;
  const isRead = params?.is_read === "true";
  const createdAt = params?.created_at ?? new Date().toISOString();
  const priority = params?.priority ?? "";

  const config = TYPE_CONFIG[type] ?? TYPE_CONFIG.system;
  const markAsRead = useMarkAsRead();

  useEffect(() => {
    if (id && !isRead && !markAsRead.isSuccess) {
      markAsRead.mutate(id, {
        onError: () => {
          Alert.alert("Unable to mark as read", "Check your connection and try again.");
        },
      });
    }
  }, [id, isRead]);

  const handleBack = useCallback(() => router.back(), []);

  const PRIORITY_CONFIG: Record<string, { color: string; label: string }> = {
    high: { color: "#DC2626", label: "High" },
    medium: { color: "#D97706", label: "Medium" },
    low: { color: "#22C55E", label: "Low" },
  };

  const priorityCfg = priority ? PRIORITY_CONFIG[priority] : null;
  const currentIsRead = isRead || markAsRead.isSuccess;

  if (!id) {
    return (
      <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
        <View className="flex-1 bg-surface-background">
          <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
            <View className="flex-row items-center">
              <TouchableOpacity className="w-9 h-9 items-center justify-center -ml-1 mr-2" onPress={handleBack} accessibilityRole="button" accessibilityLabel="Go back">
                <Ionicons name="chevron-back" size={22} color="#4F46E5" />
              </TouchableOpacity>
              <Text className="text-slate-900 text-[18px] font-semibold">Alert Details</Text>
            </View>
          </View>
          <View className="items-center justify-center pt-20 pb-8 px-6">
            <View className="w-16 h-16 bg-slate-50 rounded-full items-center justify-center mb-3">
              <Ionicons name="notifications-off-outline" size={32} color="#CBD5E1" />
            </View>
            <Text className="text-slate-700 text-sm font-semibold text-center">Alert not found</Text>
            <Text className="text-slate-400 text-xs mt-1 text-center leading-5 max-w-[240px]">
              This alert may have been removed.
            </Text>
          </View>
        </View>
      </ScreenContainer>
    );
  }

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
              Alert Details
            </Text>
            {!currentIsRead && (
              <View className="w-2 h-2 rounded-full bg-primary-500" />
            )}
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Type badge + priority */}
          <View className="flex-row items-center gap-2 pt-4 pb-2">
            <View className="rounded-md px-2 py-0.5" style={{ backgroundColor: config.tint }}>
              <Text className="text-[11px] font-bold" style={{ color: config.color }}>
                {config.label}
              </Text>
            </View>
            {priorityCfg && (
              <View className="flex-row items-center gap-1">
                <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: priorityCfg.color }} />
                <Text className="text-[10px] font-medium" style={{ color: priorityCfg.color }}>
                  {priorityCfg.label} Priority
                </Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text className="text-slate-900 text-xl font-bold mb-1">{title}</Text>

          {/* Created date */}
          <Text className="text-slate-400 text-xs mb-4">{formatFullDate(createdAt)}</Text>

          {/* Status */}
          <View className="flex-row items-center gap-1.5 mb-4">
            <Ionicons
              name={currentIsRead ? "checkmark-circle" : "time-outline"}
              size={14}
              color={currentIsRead ? "#22C55E" : "#D97706"}
            />
            <Text className={`text-xs font-semibold ${currentIsRead ? "text-status-success" : "text-status-warning"}`}>
              {markAsRead.isPending ? "Marking read..." : currentIsRead ? "Read" : "Unread"}
            </Text>
          </View>

          {/* Message */}
          <View className="rounded-2xl bg-white border border-surface-border p-4 mb-3" style={cardShadow}>
            <Text className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Message</Text>
            <Text className="text-slate-700 text-sm leading-6">
              {message || "No message content."}
            </Text>
          </View>

          {/* Details */}
          <View className="rounded-2xl bg-white border border-surface-border p-4" style={cardShadow}>
            <Text className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">Details</Text>
            <InfoRow icon="pricetag-outline" label="Category" value={config.label} valueColor={config.color} />
            {priorityCfg && (
              <InfoRow icon="flag-outline" label="Priority" value={priorityCfg.label} valueColor={priorityCfg.color} />
            )}
            <InfoRow icon="calendar-outline" label="Sent" value={formatFullDate(createdAt)} />
            <InfoRow
              icon={currentIsRead ? "checkmark-circle" : "time-outline"}
              label="Status"
              value={currentIsRead ? "Read" : "Unread"}
              valueColor={currentIsRead ? "#22C55E" : "#D97706"}
            />
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
