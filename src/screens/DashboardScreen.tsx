import { useCallback, useMemo, useState } from "react";
import { cardShadow } from "../theme/shadows";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { ScreenContainer } from "@/components";
import { Card } from "@/components/ui/Card";
import { ClassSelector } from "@/components/ClassSelector";
import { markNavFromDashboard } from "@/utils/navigation";
import { useDashboard } from "@/hooks/useDashboard";
import { useClasses, useStudents } from "@/hooks/useAttendance";
import { useTodayTimetable } from "@/hooks/useTimetable";
import { useNotifications, useUnreadCount } from "@/hooks/useNotifications";
import { useAuthStore } from "@/store/authStore";
import type { NotificationItem, PeriodItem, TeacherClass } from "@/types";

type IoniconName = keyof typeof Ionicons.glyphMap;

interface DashboardAction {
  label: string;
  icon: IoniconName;
  route: Href;
  color: string;
  tint: string;
}

interface MetricItem {
  label: string;
  value: string | number;
  icon: IoniconName;
  color: string;
  tint: string;
}


const TEACHING_ACTIONS: DashboardAction[] = [
  { label: "Attendance", icon: "checkbox-outline", route: "/(tabs)/attendance", color: "#2563EB", tint: "#EFF6FF" },
  { label: "Homework", icon: "document-text-outline", route: "/(tabs)/homework", color: "#D97706", tint: "#FFFBEB" },
  { label: "Students", icon: "people-outline", route: "/(tabs)/more/students", color: "#0891B2", tint: "#ECFEFF" },
  { label: "Timetable", icon: "time-outline", route: "/(tabs)/more/timetable", color: "#7C3AED", tint: "#F5F3FF" },
];

const ACADEMIC_ACTIONS: DashboardAction[] = [
  { label: "Exams", icon: "school-outline", route: "/(tabs)/more/exams", color: "#4F46E5", tint: "#EEF2FF" },
  { label: "Results", icon: "trophy-outline", route: "/(tabs)/more/results", color: "#BE185D", tint: "#FDF2F8" },
  { label: "Calendar", icon: "calendar-outline", route: "/(tabs)/more/calendar", color: "#047857", tint: "#ECFDF5" },
];

const ADMIN_ACTIONS: DashboardAction[] = [
  { label: "Leave", icon: "exit-outline", route: "/(tabs)/more/leave", color: "#16A34A", tint: "#F0FDF4" },
  { label: "Alerts", icon: "notifications-outline", route: "/(tabs)/notifications", color: "#DC2626", tint: "#FEF2F2" },
  { label: "Transport", icon: "bus-outline", route: "/(tabs)/more/transport", color: "#0F766E", tint: "#F0FDFA" },
  { label: "Circulars", icon: "megaphone-outline", route: "/(tabs)/more/circulars", color: "#B45309", tint: "#FFFBEB" },
  { label: "Documents", icon: "folder-open-outline", route: "/(tabs)/more/documents", color: "#475569", tint: "#F8FAFC" },
  { label: "Profile", icon: "person-outline", route: "/(tabs)/more", color: "#4338CA", tint: "#EEF2FF" },
  { label: "Settings", icon: "settings-outline", route: "/(tabs)/more/settings", color: "#334155", tint: "#F1F5F9" },
];

const NOTIF_TYPE_CONFIG: Record<string, { icon: IoniconName; tint: string; color: string; label: string }> = {
  attendance: { icon: "checkbox-outline", tint: "#EFF6FF", color: "#2563EB", label: "Attendance" },
  homework: { icon: "document-text-outline", tint: "#FFF7ED", color: "#EA580C", label: "Homework" },
  exam: { icon: "school-outline", tint: "#F5F3FF", color: "#7C3AED", label: "Exam" },
  fee: { icon: "wallet-outline", tint: "#FFFBEB", color: "#D97706", label: "Fee" },
  transport: { icon: "bus-outline", tint: "#F0FDF4", color: "#16A34A", label: "Transport" },
  system: { icon: "megaphone-outline", tint: "#F8FAFC", color: "#64748B", label: "School update" },
  ai_agent: { icon: "hardware-chip-outline", tint: "#ECFEFF", color: "#0891B2", label: "Assistant" },
};

function formatRelativeTime(dateStr: string): string {
  const timestamp = new Date(dateStr).getTime();
  if (Number.isNaN(timestamp)) return "Recently";

  const diffMs = Date.now() - timestamp;
  const diffHrs = Math.floor(diffMs / 3600000);
  if (diffHrs < 1) return "Just now";
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function formatToday(): string {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatClassName(period: PeriodItem | null | undefined): string {
  if (!period) return "No upcoming class";
  const className = period?.className ?? "";
  const section = period?.section ?? "";
  const classLabel = [className, section].filter(Boolean).join(" ");
  return classLabel || "Class not assigned";
}

function SectionHeader({ title, subtitle, action }: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <View className="flex-row items-end justify-between mb-2">
      <View className="flex-1 min-w-0">
        <Text className="text-slate-900 text-[18px] font-semibold" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text className="text-slate-400 text-xs mt-0.5" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {action}
    </View>
  );
}

function SectionPanel({ children }: { children: React.ReactNode }) {
  return (
    <View className="rounded-2xl bg-white border border-surface-border p-4" style={cardShadow}>
      {children}
    </View>
  );
}

function MetricCard({ item }: { item: MetricItem }) {
  return (
    <View className="flex-1 rounded-2xl bg-white border border-surface-border p-4 overflow-hidden" style={cardShadow}>
      <View className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-sm" style={{ backgroundColor: item.color }} />
      <View className="flex-row items-center justify-between mb-3">
        <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: item.tint }}>
          <Ionicons name={item.icon} size={18} color={item.color} />
        </View>
      </View>
      <Text className="text-slate-900 text-[28px] font-bold" numberOfLines={1}>
        {item.value}
      </Text>
      <Text className="text-slate-500 text-[13px] font-medium mt-1" numberOfLines={1}>
        {item.label}
      </Text>
    </View>
  );
}

function ActionCard({ item }: { item: DashboardAction }) {
  return (
    <TouchableOpacity
      style={{ width: "47.9%" }}
      activeOpacity={0.7}
      onPress={() => {
        const routeStr = typeof item.route === "string" ? item.route : item.route.pathname;
        if (routeStr.startsWith("/(tabs)/more/") || routeStr === "/(tabs)/more") {
          markNavFromDashboard();
        }
        router.push(item.route);
      }}
      accessibilityRole="button"
      accessibilityLabel={`Open ${item.label}`}
    >
      <View
        className="items-center rounded-2xl bg-white border border-surface-border px-4 py-4"
        style={cardShadow}
      >
        <View className="w-12 h-12 rounded-2xl items-center justify-center" style={{ backgroundColor: item.tint }}>
          <Ionicons name={item.icon} size={24} color={item.color} />
        </View>
        <Text className="text-slate-700 text-[13px] font-medium text-center mt-2 leading-5" numberOfLines={2}>
          {item.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function HeroInfo({ label, value, icon }: { label: string; value: string; icon: IoniconName }) {
  return (
    <View className="flex-1 rounded-2xl bg-white/90 border border-blue-100 p-3">
      <View className="flex-row items-center mb-1.5">
        <Ionicons name={icon} size={12} color="#64748B" />
        <Text className="text-slate-400 text-[11px] font-medium ml-1.5" numberOfLines={1}>
          {label}
        </Text>
      </View>
      <Text className="text-slate-800 text-[13px] font-semibold" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

export function DashboardScreen() {
  const [selectedClass, setSelectedClass] = useState<TeacherClass | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, error, refetch } = useDashboard();
  const { data: unreadCount = 0 } = useUnreadCount();
  const { data: notifs = [] } = useNotifications();
  const { data: classes = [] } = useClasses();
  const { data: students } = useStudents(selectedClass?.id ?? "");
  const { data: todayTimetable } = useTodayTimetable();
  const user = useAuthStore((s) => s.user);

  const teacherName = data?.teacherName ?? user?.name ?? "Teacher";
  const nextClass = todayTimetable?.currentPeriod ?? todayTimetable?.nextPeriod ?? null;
  const assignedClasses = classes.length;
  const studentsValue = selectedClass ? (students?.length ?? "--") : "--";

  const metrics = useMemo<MetricItem[]>(
    () => [
      {
        label: "Classes Today",
        value: data?.todaysClasses ?? todayTimetable?.day?.periods?.length ?? 0,
        icon: "school-outline",
        color: "#2563EB",
        tint: "#EFF6FF",
      },
      {
        label: "Students",
        value: studentsValue,
        icon: "people-outline",
        color: "#0891B2",
        tint: "#ECFEFF",
      },
      {
        label: "Attendance Pending",
        value: data?.attendancePending ?? 0,
        icon: "checkbox-outline",
        color: "#D97706",
        tint: "#FFFBEB",
      },
      {
        label: "Homework Pending",
        value: data?.homeworkPending ?? 0,
        icon: "document-text-outline",
        color: "#EA580C",
        tint: "#FFF7ED",
      },
    ],
    [data, studentsValue, todayTimetable]
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const handleOpenNotification = useCallback((item: NotificationItem) => {
    router.push({
      pathname: "/(tabs)/notifications/[id]",
      params: {
        id: item?.id ?? "",
        title: item?.title ?? "Notification",
        body: item?.message ?? "",
        type: item?.type ?? "system",
        is_read: String(!!item?.isRead),
        created_at: item?.createdAt ?? "",
      },
    });
  }, []);

  return (
    <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
      <View className="flex-1 bg-surface-background">
        <View className="bg-white px-4 pt-1 pb-2 border-b border-surface-border">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 min-w-0">
              <Text className="text-slate-500 text-xs font-medium">{getGreeting()}</Text>
              <Text className="text-slate-900 text-[22px] font-semibold mt-0.5" numberOfLines={1} style={{ lineHeight: 28 }}>
                {teacherName}
              </Text>
            </View>
            <TouchableOpacity
              className="w-9 h-9 bg-slate-100 rounded-full items-center justify-center relative ml-2"
              activeOpacity={0.7}
              onPress={() => router.push("/(tabs)/notifications")}
              accessibilityRole="button"
              accessibilityLabel="Open alerts"
            >
              <Ionicons name="notifications-outline" size={20} color="#64748B" />
              {unreadCount > 0 && (
                <View className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-0.5 bg-status-error rounded-full items-center justify-center">
                  <Text className="text-white text-[9px] font-bold">{unreadCount > 99 ? "99+" : unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {classes.length > 0 && (
            <View className="mt-2">
              <ClassSelector
                classes={classes}
                selectedClass={selectedClass}
                onSelectClass={setSelectedClass}
              />
            </View>
          )}
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#4F46E5" colors={["#4F46E5"]} />
          }
        >
          {isLoading ? (
            <View className="items-center justify-center pt-24 pb-8">
              <ActivityIndicator size="large" color="#4F46E5" />
              <Text className="text-slate-400 text-sm mt-3">Loading dashboard...</Text>
            </View>
          ) : error ? (
            <View className="items-center justify-center pt-20 pb-8">
              <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
                <Ionicons name="cloud-offline-outline" size={32} color="#DC2626" />
              </View>
              <Text className="text-slate-800 text-lg font-bold text-center mb-2">Connection Error</Text>
              <Text className="text-slate-400 text-sm text-center leading-5 max-w-[260px] mb-6">
                {error?.message ?? "Failed to load dashboard"}
              </Text>
              <TouchableOpacity
                className="flex-row items-center bg-primary-600 px-6 py-3 rounded-xl"
                activeOpacity={0.7}
                onPress={handleRefresh}
                accessibilityRole="button"
                accessibilityLabel="Retry dashboard"
              >
                <Ionicons name="refresh-outline" size={18} color="#FFFFFF" />
                <Text className="text-white font-semibold text-sm ml-2">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View className="mt-4 rounded-3xl p-5 overflow-hidden" style={{ backgroundColor: "#EEF5FF", borderColor: "#DBEAFE", borderWidth: 1 }}>
                <View className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/40" />
                <View className="absolute left-16 bottom-0 w-16 h-16 rounded-full bg-white/25" />
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center mr-3 border border-blue-100">
                    <Ionicons name="briefcase-outline" size={22} color="#4F46E5" />
                  </View>
                  <View className="flex-1 min-w-0">
                    <Text className="text-slate-500 text-xs font-medium">{getGreeting()}</Text>
                    <Text className="text-slate-900 text-[22px] font-semibold mt-0.5" numberOfLines={1} style={{ lineHeight: 28 }}>
                      {teacherName}
                    </Text>
                    <Text className="text-slate-500 text-xs mt-1" numberOfLines={1}>
                      {formatToday()}
                    </Text>
                  </View>
                  <TouchableOpacity
                    className="w-9 h-9 bg-white rounded-xl items-center justify-center border border-blue-100"
                    activeOpacity={0.72}
                    onPress={() => {
                      markNavFromDashboard();
                      router.push("/(tabs)/more");
                    }}
                    accessibilityRole="button"
                    accessibilityLabel="Open profile"
                  >
                    <Ionicons name="ellipsis-vertical" size={18} color="#4F46E5" />
                  </TouchableOpacity>
                </View>
                <View className="flex-row gap-3 mt-4">
                  <HeroInfo
                    label="Assigned"
                    value={`${assignedClasses} class${assignedClasses === 1 ? "" : "es"}`}
                    icon="albums-outline"
                  />
                  <HeroInfo
                    label="Next Class"
                    value={nextClass ? `${nextClass?.subject ?? "Unnamed Period"} - ${formatClassName(nextClass)}` : "No upcoming class"}
                    icon="time-outline"
                  />
                </View>
              </View>

              <View className="pt-6">
                <SectionHeader title="Today's Overview" subtitle="Your teaching load at a glance" />
                <SectionPanel>
                  <View className="gap-3">
                    <View className="flex-row gap-3">
                      {metrics.slice(0, 2).map((metric) => (
                        <MetricCard key={metric.label} item={metric} />
                      ))}
                    </View>
                    <View className="flex-row gap-3">
                      {metrics.slice(2, 4).map((metric) => (
                        <MetricCard key={metric.label} item={metric} />
                      ))}
                    </View>
                  </View>
                </SectionPanel>
              </View>

              <View className="pt-6">
                <SectionHeader title="Teaching" subtitle="Primary daily actions" />
                <SectionPanel>
                  <View className="flex-row flex-wrap gap-3">
                    {TEACHING_ACTIONS.map((module) => (
                      <ActionCard key={module.label} item={module} />
                    ))}
                  </View>
                </SectionPanel>
              </View>

              <View className="pt-6">
                <SectionHeader title="Academics" subtitle="Planning, exams and results" />
                <SectionPanel>
                  <View className="flex-row flex-wrap gap-3">
                    {ACADEMIC_ACTIONS.map((module) => (
                      <ActionCard key={module.label} item={module} />
                    ))}
                  </View>
                </SectionPanel>
              </View>

              <View className="pt-6">
                <SectionHeader title="Administration" subtitle="School operations and preferences" />
                <SectionPanel>
                  <View className="flex-row flex-wrap gap-3">
                    {ADMIN_ACTIONS.map((module) => (
                      <ActionCard key={module.label} item={module} />
                    ))}
                  </View>
                </SectionPanel>
              </View>

              <View className="pt-6">
                <SectionHeader
                  title="Recent Activity"
                  subtitle="Teacher updates that may need attention"
                  action={
                    <TouchableOpacity onPress={() => router.push("/(tabs)/notifications")} accessibilityRole="button">
                      <Text className="text-primary-600 text-xs font-semibold">See All</Text>
                    </TouchableOpacity>
                  }
                />
                <Card padding="none" className="overflow-hidden mb-2">
                  {notifs.length === 0 ? (
                    <View className="p-6 items-center">
                      <View className="w-16 h-16 bg-slate-50 rounded-full items-center justify-center mb-3">
                        <Ionicons name="notifications-off-outline" size={32} color="#CBD5E1" />
                      </View>
                      <Text className="text-slate-700 text-sm font-semibold">No teacher updates</Text>
                      <Text className="text-slate-400 text-xs mt-1 text-center leading-5 max-w-[240px]">
                        Attendance, homework and school notices will appear here.
                      </Text>
                    </View>
                  ) : (
                    notifs.slice(0, 4).map((item, index) => {
                      const config = NOTIF_TYPE_CONFIG[item?.type ?? "system"] ?? NOTIF_TYPE_CONFIG.system;
                      return (
                        <TouchableOpacity
                          key={item?.id ?? `activity-${index}`}
                          className={`flex-row items-center p-4 ${index < Math.min(notifs.length, 4) - 1 ? "border-b border-slate-50" : ""}`}
                          activeOpacity={0.7}
                          onPress={() => handleOpenNotification(item)}
                          accessibilityRole="button"
                          accessibilityLabel={`Open ${item?.title ?? "activity"}`}
                        >
                          <View className="relative">
                            <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: config.tint }}>
                              <Ionicons name={config.icon} size={18} color={config.color} />
                            </View>
                            {!item?.isRead && (
                              <View className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary-500 rounded-full border-2 border-white" />
                            )}
                          </View>
                          <View className="flex-1 ml-3 min-w-0">
                            <View className="flex-row items-center mb-0.5">
                              <Text className="text-slate-400 text-[10px] font-semibold uppercase" numberOfLines={1}>
                                {config.label}
                              </Text>
                              <Text className="text-slate-300 text-[10px] mx-1">-</Text>
                              <Text className="text-slate-400 text-[10px]" numberOfLines={1}>
                                {formatRelativeTime(item?.createdAt ?? "")}
                              </Text>
                            </View>
                            <Text className="text-slate-800 text-sm font-semibold" numberOfLines={1}>
                              {item?.title ?? "Notification"}
                            </Text>
                            <Text className="text-slate-400 text-xs mt-0.5" numberOfLines={1}>
                              {item?.message ?? ""}
                            </Text>
                          </View>
                          <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
                        </TouchableOpacity>
                      );
                    })
                  )}
                </Card>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
