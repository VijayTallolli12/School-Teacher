import { View, Text } from "react-native";

interface HomeworkStatusBadgeProps {
  label: string;
  color: string;
  tint: string;
}

export function HomeworkStatusBadge({ label, color, tint }: HomeworkStatusBadgeProps) {
  return (
    <View className="rounded-md px-2 py-0.5" style={{ backgroundColor: tint }}>
      <Text className="text-[11px] font-bold" style={{ color }}>
        {label}
      </Text>
    </View>
  );
}
