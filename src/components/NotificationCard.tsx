import { Text, TouchableOpacity, View } from "react-native";
import { cardShadow } from "../theme/shadows";
import { Ionicons } from "@expo/vector-icons";
import type { NotificationItem, NotificationType } from "@/types";


const TYPE_CONFIG: Record<NotificationType, { icon: keyof typeof Ionicons.glyphMap; tint: string; color: string; label: string }> = {
  attendance: { icon: "checkbox-outline", tint: "#EFF6FF", color: "#2563EB", label: "Attendance" },
  homework: { icon: "document-text-outline", tint: "#FFF7ED", color: "#EA580C", label: "Homework" },
  exam: { icon: "school-outline", tint: "#F5F3FF", color: "#7C3AED", label: "Exam" },
  fee: { icon: "wallet-outline", tint: "#FFFBEB", color: "#D97706", label: "Fee" },
  transport: { icon: "bus-outline", tint: "#F0FDF4", color: "#16A34A", label: "Transport" },
  system: { icon: "megaphone-outline", tint: "#F8FAFC", color: "#64748B", label: "School update" },
  ai_agent: { icon: "hardware-chip-outline", tint: "#ECFEFF", color: "#0891B2", label: "Assistant" },
};

const PRIORITY_CONFIG: Record<string, { color: string; label: string }> = {
  high: { color: "#DC2626", label: "High" },
  medium: { color: "#D97706", label: "Medium" },
  low: { color: "#22C55E", label: "Low" },
};

function formatRelativeTime(dateStr: string): string {
  const ts = new Date(dateStr).getTime();
  if (isNaN(ts)) return "Recently";
  const diff = Date.now() - ts;
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return "Just now";
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

interface NotificationCardProps {
  notification: NotificationItem;
  onPress: () => void;
}

export function NotificationCard({ notification, onPress }: NotificationCardProps) {
  const config = TYPE_CONFIG[notification?.type ?? "system"] ?? TYPE_CONFIG.system;
  const priority = notification?.data?.priority as string | undefined;
  const priorityCfg = priority ? PRIORITY_CONFIG[priority] : null;

  return (
    <TouchableOpacity
      className="rounded-2xl bg-white border border-surface-border p-4"
      style={cardShadow}
      activeOpacity={0.7}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${notification?.isRead ? "Read" : "Unread"} ${notification?.title ?? "alert"}`}
    >
      <View className="flex-row items-start">
        {/* Icon with unread dot */}
        <View className="relative mr-3">
          <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: config.tint }}>
            <Ionicons name={config.icon} size={18} color={config.color} />
          </View>
          {!notification?.isRead && (
            <View className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary-500 rounded-full border-2 border-white" />
          )}
        </View>

        {/* Content */}
        <View className="flex-1 min-w-0">
          {/* Meta row */}
          <View className="flex-row items-center mb-0.5">
            <Text className="text-slate-400 text-[10px] font-semibold uppercase" numberOfLines={1}>
              {config.label}
            </Text>
            <Text className="text-slate-300 text-[10px] mx-1">-</Text>
            <Text className="text-slate-400 text-[10px]" numberOfLines={1}>
              {formatRelativeTime(notification?.createdAt ?? "")}
            </Text>
          </View>

          {/* Title */}
          <Text className="text-slate-800 text-sm font-semibold" numberOfLines={1}>
            {notification?.title ?? "Alert"}
          </Text>

          {/* Message */}
          <Text className="text-slate-400 text-xs mt-0.5" numberOfLines={2}>
            {notification?.message ?? ""}
          </Text>

          {/* Priority + Read status */}
          <View className="flex-row items-center mt-1.5 gap-2">
            {priorityCfg && (
              <View className="flex-row items-center gap-1">
                <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: priorityCfg.color }} />
                <Text className="text-[10px] font-medium" style={{ color: priorityCfg.color }}>
                  {priorityCfg.label}
                </Text>
              </View>
            )}
            <Text className="text-slate-300 text-[10px]">
              {notification?.isRead ? "Read" : "New"}
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={16} color="#CBD5E1" style={{ marginLeft: 8 }} />
      </View>
    </TouchableOpacity>
  );
}
