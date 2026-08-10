import { useCallback, useState } from "react";
import { cardShadow } from "../theme/shadows";
import {
  Alert,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScreenContainer } from "@/components";
import { Card } from "@/components/ui/Card";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";
import { useAuthStore } from "@/store/authStore";
import { APP_CONSTANTS } from "@/config/constants";


export function ProfileScreen() {
  const { user, logout, isLoading } = useAuthStore();
  const [showChangePassword, setShowChangePassword] = useState(false);

  const initials = (user?.name ?? "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const assignments = user?.classTeacherAssignments ?? [];

  const handleLogout = useCallback(() => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch {
            Alert.alert("Error", "Failed to logout");
          }
        },
      },
    ]);
  }, [logout]);

  const handlePrivacyPolicy = useCallback(() => {
    Linking.openURL(APP_CONSTANTS.PRIVACY_POLICY_URL).catch(() => {
      Alert.alert("Error", "Could not open link");
    });
  }, []);

  const handleTerms = useCallback(() => {
    Linking.openURL(APP_CONSTANTS.TERMS_OF_SERVICE_URL).catch(() => {
      Alert.alert("Error", "Could not open link");
    });
  }, []);

  const handleEdit = useCallback(() => {
    router.push("/(tabs)/more/edit-profile");
  }, []);

  const handleOpenSettings = useCallback(() => {
    router.push("/(tabs)/more/settings");
  }, []);

  return (
    <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
      <View className="flex-1 bg-surface-background">
        {/* Header */}
        <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
          <View className="flex-row items-center justify-between">
            <Text className="text-slate-900 text-[18px] font-semibold">Profile</Text>
            <TouchableOpacity
              className="w-9 h-9 bg-slate-100 rounded-full items-center justify-center"
              activeOpacity={0.7}
              onPress={handleEdit}
              accessibilityRole="button"
              accessibilityLabel="Edit profile"
            >
              <Ionicons name="pencil-outline" size={18} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Header Card */}
          <View className="pt-4">
            <Card padding="lg">
              <View className="flex-row items-center">
                <View className="w-14 h-14 bg-primary-100 rounded-full items-center justify-center mr-4">
                  <Text className="text-primary-700 text-lg font-bold">{initials}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-slate-900 text-base font-bold mb-0.5">
                    {user?.name ?? "N/A"}
                  </Text>
                  <Text className="text-slate-500 text-xs">{user?.email ?? "N/A"}</Text>
                  {user?.employeeId && (
                    <View className="flex-row items-center mt-1 gap-1">
                      <Ionicons name="briefcase-outline" size={12} color="#94A3B8" />
                      <Text className="text-slate-400 text-[11px]">ID: {user.employeeId}</Text>
                    </View>
                  )}
                </View>
              </View>
              {user?.designation && (
                <View className="flex-row items-center mt-3 pt-3 border-t border-surface-border">
                  <View className="w-8 h-8 bg-indigo-50 rounded-lg items-center justify-center mr-3">
                    <Ionicons name="briefcase-outline" size={16} color="#4F46E5" />
                  </View>
                  <View>
                    <Text className="text-slate-500 text-[11px]">Designation</Text>
                    <Text className="text-slate-800 text-sm font-medium">{user.designation}</Text>
                  </View>
                </View>
              )}
            </Card>
          </View>

          {/* Personal Information */}
          <View className="mt-6">
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 px-0.5">
              Personal Information
            </Text>
            <Card padding="md">
              <InfoRow label="Phone" value={user?.phone ?? "—"} />
              <InfoRow label="Email" value={user?.email ?? "—"} />
              <InfoRow label="Employee ID" value={user?.employeeId ?? "—"} />
              <InfoRow label="Department" value={user?.department ?? "—"} last />
            </Card>
          </View>

          {/* Teaching Information */}
          {assignments.length > 0 && (
            <View className="mt-6">
              <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 px-0.5">
                Teaching Assignments
              </Text>
              <Card padding="none" className="overflow-hidden">
                {assignments.map((assignment, index) => (
                  <View
                    key={index}
                    className={`flex-row items-center px-4 py-3 ${index < assignments.length - 1 ? "border-b border-surface-border" : ""}`}
                  >
                    <View className="w-9 h-9 bg-primary-100 rounded-full items-center justify-center mr-3">
                      <Ionicons name="school-outline" size={16} color="#4F46E5" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-slate-800 text-sm font-semibold">
                        {assignment.className}
                      </Text>
                      <Text className="text-slate-500 text-[11px]">
                        {assignment.section} - {assignment.subject}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
                  </View>
                ))}
              </Card>
            </View>
          )}

          {/* Settings */}
          <View className="mt-6">
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 px-0.5">
              Settings
            </Text>
            <Card padding="none" className="overflow-hidden">
              <SettingsLink
                label="Notification Preferences"
                icon="notifications-outline"
                onPress={handleOpenSettings}
              />
              <SettingsLink
                label="Change Password"
                icon="lock-closed-outline"
                onPress={() => setShowChangePassword(true)}
              />
              <SettingsLink
                label="App Version"
                icon="information-circle-outline"
                value={APP_CONSTANTS.APP_VERSION}
              />
              <SettingsLink
                label="Privacy Policy"
                icon="shield-checkmark-outline"
                onPress={handlePrivacyPolicy}
              />
              <View className="border-b border-surface-border" />
              <SettingsLink
                label="Terms of Service"
                icon="document-text-outline"
                onPress={handleTerms}
              />
            </Card>
          </View>

          {/* Logout */}
          <View className="mt-6 mb-4">
            <TouchableOpacity
              className="flex-row items-center justify-center bg-white rounded-2xl border border-red-200 px-6 py-3.5"
              style={cardShadow}
              activeOpacity={0.7}
              onPress={handleLogout}
              accessibilityRole="button"
              accessibilityLabel="Logout"
            >
              <Ionicons name="log-out-outline" size={18} color="#DC2626" />
              <Text className="text-red-600 font-semibold text-sm ml-2">Logout</Text>
            </TouchableOpacity>
          </View>

          {isLoading && (
            <Text className="text-slate-400 text-xs text-center mb-4">Logging out...</Text>
          )}
        </ScrollView>
      </View>

      <ChangePasswordModal
        visible={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </ScreenContainer>
  );
}

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View className={`flex-row items-center py-3 ${!last ? "border-b border-surface-border" : ""}`}>
      <Text className="text-slate-500 text-sm flex-1">{label}</Text>
      <Text className="text-slate-900 text-sm font-medium text-right max-w-[55%]" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function SettingsLink({
  label,
  icon,
  value,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value?: string;
  onPress?: () => void;
}) {
  const Container = onPress ? TouchableOpacity : View;
  return (
    <Container
      className={`flex-row items-center px-4 py-3.5 ${onPress ? "" : ""} border-b border-surface-border`}
      onPress={onPress}
      activeOpacity={0.6}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={label}
    >
      <View className="w-8 h-8 bg-slate-100 rounded-lg items-center justify-center mr-3">
        <Ionicons name={icon} size={16} color="#64748B" />
      </View>
      <Text className="text-slate-800 text-sm flex-1">{label}</Text>
      {value && <Text className="text-slate-400 text-sm mr-1">{value}</Text>}
      {onPress && <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />}
    </Container>
  );
}
