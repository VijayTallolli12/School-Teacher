import { useEffect } from "react";
import { cardShadow } from "../theme/shadows";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScreenContainer } from "@/components";
import { Card } from "@/components/ui/Card";
import { useSettingsStore } from "../store/settingsStore";


function ToggleRow({
  label,
  icon,
  value,
  onToggle,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: boolean;
  onToggle: (value: boolean) => void;
}) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 border-b border-surface-border">
      <View className="flex-row items-center flex-1">
        <View className="w-9 h-9 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: "#EFF6FF" }}>
          <Ionicons name={icon} size={18} color="#2563EB" />
        </View>
        <Text className="text-slate-800 text-sm font-medium">{label}</Text>
      </View>
      <TouchableOpacity
        className={`w-11 h-6 rounded-full px-0.5 justify-center ${value ? "bg-primary-600" : "bg-slate-300"}`}
        onPress={() => onToggle(!value)}
        activeOpacity={0.8}
        accessibilityRole="switch"
        accessibilityState={{ checked: value }}
        accessibilityLabel={label}
      >
        <View className={`w-5 h-5 rounded-full bg-white ${value ? "self-end" : "self-start"}`} />
      </TouchableOpacity>
    </View>
  );
}

export function SettingsScreen() {
  const {
    theme: currentTheme,
    pushNotifications,
    emailNotifications,
    smsNotifications,
    loadPreferences,
    setTheme,
    setPushNotifications,
    setEmailNotifications,
    setSmsNotifications,
  } = useSettingsStore();

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

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
            <Text className="text-slate-900 text-[18px] font-semibold">Settings</Text>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 mt-4 px-0.5">
            Preferences
          </Text>
          <Card padding="none" className="overflow-hidden" style={cardShadow}>
            <ToggleRow
              label="Dark Theme"
              icon="moon-outline"
              value={currentTheme === "dark"}
              onToggle={(v) => setTheme(v ? "dark" : "light")}
            />
            <ToggleRow
              label="Push Notifications"
              icon="notifications-outline"
              value={pushNotifications}
              onToggle={setPushNotifications}
            />
            <ToggleRow
              label="Email Notifications"
              icon="mail-outline"
              value={emailNotifications}
              onToggle={setEmailNotifications}
            />
            <ToggleRow
              label="SMS Notifications"
              icon="chatbubble-ellipses-outline"
              value={smsNotifications}
              onToggle={setSmsNotifications}
            />
          </Card>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
