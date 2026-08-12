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
import { router } from "expo-router";
import { ScreenContainer } from "@/components";
import { Card } from "@/components/ui/Card";
import { useLeaves, useLeaveBalance } from "@/hooks/useLeave";
import type { LeaveStatus } from "@/types";


const STATUS_TABS: { label: string; value: LeaveStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const LEAVE_TYPE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Sick: "medkit-outline",
  Casual: "umbrella-outline",
  Earned: "airplane-outline",
};

function getLeaveIcon(leaveType: string): keyof typeof Ionicons.glyphMap {
  return LEAVE_TYPE_ICONS[leaveType] ?? "calendar-outline";
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "--";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function StatusBadge({ status }: { status: LeaveStatus }) {
  const config: Record<string, { bg: string; text: string; icon: keyof typeof Ionicons.glyphMap }> = {
    pending: { bg: "bg-amber-50 border border-amber-200", text: "text-amber-700", icon: "time-outline" },
    approved: { bg: "bg-emerald-50 border border-emerald-200", text: "text-emerald-700", icon: "checkmark-circle-outline" },
    rejected: { bg: "bg-red-50 border border-red-200", text: "text-red-700", icon: "close-circle-outline" },
    cancelled: { bg: "bg-slate-50 border border-slate-200", text: "text-slate-500", icon: "close-outline" },
  };
  const c = config[status] ?? config.pending;
  return (
    <View className={`flex-row items-center px-2.5 py-1 rounded-full ${c.bg}`}>
      <Ionicons name={c.icon} size={12} color={status === "pending" ? "#D97706" : status === "approved" ? "#059669" : "#DC2626"} />
      <Text className={`text-[11px] font-semibold ml-1 capitalize ${c.text}`}>{status}</Text>
    </View>
  );
}

export function LeaveScreen() {
  const [filter, setFilter] = useState<LeaveStatus | "all">("all");
  const [refreshing, setRefreshing] = useState(false);

  const { data: leaves, isLoading: leavesLoading, isError: leavesError, refetch: refetchLeaves } = useLeaves();
  const { data: balances, isLoading: balanceLoading, isError: balanceError, refetch: refetchBalance } = useLeaveBalance();

  const filteredLeaves = useMemo(() => {
    if (!leaves) return [];
    if (filter === "all") return leaves;
    return leaves.filter((l) => l.status === filter);
  }, [leaves, filter]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchLeaves(), refetchBalance()]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchLeaves, refetchBalance]);

  const isLoading = leavesLoading || balanceLoading;

  return (
    <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
      <View className="flex-1 bg-surface-background">
        <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 min-w-0">
              <TouchableOpacity
                className="w-9 h-9 bg-slate-100 rounded-full items-center justify-center mr-2"
                activeOpacity={0.7}
                onPress={() => router.back()}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <Ionicons name="chevron-back" size={22} color="#334155" />
              </TouchableOpacity>
              <Text className="text-slate-900 text-[18px] font-semibold flex-1" numberOfLines={1}>Leave Applications</Text>
            </View>
            <TouchableOpacity
              className="w-9 h-9 bg-slate-100 rounded-full items-center justify-center"
              activeOpacity={0.7}
              onPress={() => router.push("/(tabs)/notifications")}
              accessibilityRole="button"
              accessibilityLabel="Open notifications"
            >
              <Ionicons name="notifications-outline" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#4F46E5" colors={["#4F46E5"]} />
          }
        >
          {isLoading ? (
            <View className="items-center justify-center pt-24 pb-8">
              <ActivityIndicator size="large" color="#4F46E5" />
              <Text className="text-slate-400 text-sm mt-3">Loading leaves...</Text>
            </View>
          ) : leavesError ? (
            <View className="items-center justify-center pt-20 pb-8">
              <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
                <Ionicons name="cloud-offline-outline" size={32} color="#DC2626" />
              </View>
              <Text className="text-slate-800 text-lg font-bold text-center mb-2">Connection Error</Text>
              <Text className="text-slate-400 text-sm text-center leading-5 max-w-[260px] mb-2">
                Could not load leave records
              </Text>
              <TouchableOpacity
                className="flex-row items-center bg-primary-600 px-6 py-3 rounded-xl mt-2"
                activeOpacity={0.7}
                onPress={handleRefresh}
                accessibilityRole="button"
                accessibilityLabel="Retry"
              >
                <Ionicons name="refresh-outline" size={18} color="#FFFFFF" />
                <Text className="text-white font-semibold text-sm ml-2">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Balance Cards */}
              {balances && balances.length > 0 && !balanceError && (
                <View className="pt-4">
                  <View className="flex-row gap-3">
                    {balances.slice(0, 3).map((b, i) => (
                      <View
                        key={b.leaveTypeId ?? `balance-${i}`}
                        className="flex-1 rounded-2xl bg-white border border-surface-border p-3"
                        style={cardShadow}
                      >
                        <View className="flex-row items-center justify-between mb-2">
                          <View className="w-8 h-8 rounded-lg bg-indigo-50 items-center justify-center">
                            <Ionicons name={getLeaveIcon(b.leaveTypeName)} size={15} color="#4F46E5" />
                          </View>
                        </View>
                        <Text className="text-slate-900 text-[20px] font-bold">
                          {b.used ?? 0}/{b.total ?? 0}
                        </Text>
                        <Text className="text-slate-400 text-[11px] font-medium mt-0.5" numberOfLines={1}>
                          {b.leaveTypeName ?? "Leave"}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Filter Tabs */}
              <View className="flex-row gap-2 pt-5 pb-1">
                {STATUS_TABS.map((tab) => {
                  const active = filter === tab.value;
                  return (
                    <TouchableOpacity
                      key={tab.value}
                      className={`px-4 py-2 rounded-full ${active ? "bg-indigo-600" : "bg-white border border-surface-border"}`}
                      activeOpacity={0.7}
                      onPress={() => setFilter(tab.value)}
                      accessibilityRole="button"
                      accessibilityLabel={`Filter by ${tab.label}`}
                    >
                      <Text className={`text-[13px] font-semibold ${active ? "text-white" : "text-slate-600"}`}>
                        {tab.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Leave Cards */}
              {filteredLeaves.length === 0 ? (
                <View className="items-center justify-center pt-16 pb-8">
                  <View className="w-16 h-16 bg-slate-50 rounded-full items-center justify-center mb-4">
                    <Ionicons name="calendar-outline" size={32} color="#CBD5E1" />
                  </View>
                  <Text className="text-slate-700 text-sm font-semibold">No leave records</Text>
                  <Text className="text-slate-400 text-xs mt-1 text-center leading-5 max-w-[240px]">
                    {filter === "all"
                      ? "Apply for leave to get started."
                      : `No ${filter} leave records found.`}
                  </Text>
                </View>
              ) : (
                <View className="pt-3 gap-3">
                  {filteredLeaves.map((leave) => (
                    <Card
                      key={leave.id}
                      padding="md"
                      onPress={() =>
                        router.push({
                          pathname: "/(tabs)/more/leave-detail",
                          params: { leaveId: leave.id },
                        })
                      }
                    >
                      <View className="flex-row items-start">
                        <View className="w-10 h-10 rounded-xl bg-indigo-50 items-center justify-center mr-3">
                          <Ionicons name={getLeaveIcon(leave.leaveType)} size={20} color="#4F46E5" />
                        </View>
                        <View className="flex-1 min-w-0">
                          <View className="flex-row items-center justify-between mb-1">
                            <Text className="text-slate-900 text-[15px] font-semibold flex-1 mr-2" numberOfLines={1}>
                              {leave.leaveType ?? "Leave"}
                            </Text>
                            <StatusBadge status={leave.status} />
                          </View>
                          <View className="flex-row items-center mb-1">
                            <Ionicons name="calendar-outline" size={12} color="#94A3B8" />
                            <Text className="text-slate-500 text-[12px] ml-1">
                              {formatDate(leave.fromDate)} - {formatDate(leave.toDate)}
                            </Text>
                          </View>
                          <View className="flex-row items-center">
                            <Ionicons name="layers-outline" size={12} color="#94A3B8" />
                            <Text className="text-slate-500 text-[12px] ml-1">{leave.days ?? 0} day{(leave.days ?? 0) !== 1 ? "s" : ""}</Text>
                          </View>
                          {leave.reason ? (
                            <Text className="text-slate-400 text-[12px] mt-1 leading-4" numberOfLines={2}>
                              {leave.reason}
                            </Text>
                          ) : null}
                        </View>
                        <View className="ml-2 mt-1">
                          <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
                        </View>
                      </View>
                    </Card>
                  ))}
                </View>
              )}
            </>
          )}
        </ScrollView>

        {/* FAB */}
        <TouchableOpacity
          className="absolute bottom-6 right-6 w-14 h-14 bg-indigo-600 rounded-full items-center justify-center"
          style={{
            shadowColor: "#4F46E5",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }}
          activeOpacity={0.8}
          onPress={() => router.push("/(tabs)/more/leave-apply")}
          accessibilityRole="button"
          accessibilityLabel="Apply for leave"
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
