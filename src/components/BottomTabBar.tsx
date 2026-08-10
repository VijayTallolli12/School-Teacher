import { View, TouchableOpacity, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const TAB_ICONS: Record<
  string,
  { focused: keyof typeof Ionicons.glyphMap; default: keyof typeof Ionicons.glyphMap }
> = {
  index: { focused: "grid", default: "grid-outline" },
  attendance: { focused: "checkbox", default: "checkbox-outline" },
  homework: { focused: "document-text", default: "document-text-outline" },
  notifications: { focused: "notifications", default: "notifications-outline" },
  more: { focused: "person", default: "person-outline" },
};

export function BottomTabBar({ state, navigation, descriptors }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingBottom: Math.max(insets.bottom, 0), backgroundColor: "#FFFFFF" }}>
      <View style={{ height: 0.5, backgroundColor: "#E2E8F0" }} />
      <View
        style={{
          flexDirection: "row",
          height: 56,
        }}
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const icons = TAB_ICONS[route.name];
          if (!icons) return null;

          const iconName = isFocused ? icons.focused : icons.default;
          const { options } = descriptors[route.key];
          const label =
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : options.title ?? route.name;
          const badge =
            typeof options.tabBarBadge === "number" || typeof options.tabBarBadge === "string"
              ? options.tabBarBadge
              : undefined;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.6}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View style={{ position: "relative", alignItems: "center", justifyContent: "center" }}>
                <Ionicons
                  name={iconName}
                  size={isFocused ? 22 : 21}
                  color={isFocused ? "#4F46E5" : "#94A3B8"}
                />
                {badge != null && badge !== 0 && badge !== "" && (
                  <View
                    style={{
                      position: "absolute",
                      top: -3,
                      right: -9,
                      minWidth: 16,
                      height: 16,
                      paddingHorizontal: 4,
                      borderRadius: 8,
                      backgroundColor: "#DC2626",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ color: "#FFFFFF", fontSize: 9, fontWeight: "700" }}>
                      {badge}
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: isFocused ? "600" : "400",
                  color: isFocused ? "#4F46E5" : "#94A3B8",
                  marginTop: 2,
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
