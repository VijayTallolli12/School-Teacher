import { View, Text } from "react-native";

interface NotificationBadgeProps {
  count?: number;
  label?: string;
}

export function NotificationBadge({ count, label }: NotificationBadgeProps) {
  if (typeof count === "number" && count <= 0) return null;

  return (
    <View className="min-w-[20px] h-5 px-1 rounded-full bg-status-error items-center justify-center">
      <Text className="text-white text-[10px] font-bold">
        {label ?? (count && count > 99 ? "99+" : count)}
      </Text>
    </View>
  );
}
