import { Text, TouchableOpacity, View } from "react-native";
import type { NotificationFilterValue } from "@/types";

interface NotificationFilterProps {
  value: NotificationFilterValue;
  onChange: (value: NotificationFilterValue) => void;
}

const FILTERS: Array<{ label: string; value: NotificationFilterValue }> = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Read", value: "read" },
];

export function NotificationFilter({ value, onChange }: NotificationFilterProps) {
  return (
    <View className="flex-row gap-2 pb-3">
      {FILTERS.map((f) => {
        const isActive = f.value === value;
        return (
          <TouchableOpacity
            key={f.value}
            className={`px-3.5 py-1.5 rounded-full border ${
              isActive ? "bg-primary-600 border-primary-600" : "bg-white border-slate-200"
            }`}
            activeOpacity={0.7}
            onPress={() => onChange(f.value)}
            accessibilityRole="button"
            accessibilityLabel={`Filter: ${f.label}`}
            accessibilityState={{ selected: isActive }}
          >
            <Text className={`text-xs font-semibold ${isActive ? "text-white" : "text-slate-500"}`}>
              {f.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
