import { useCallback } from "react";
import { cardShadow } from "../theme/shadows";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components";
import { Card } from "@/components/ui/Card";
import { useLeaveDetail, useLeaveBalance, useCancelLeave } from "@/hooks/useLeave";
import type { LeaveStatus } from "@/types";


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

function formatDateFull(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "--";
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
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
    <View className={`flex-row items-center px-3 py-1.5 rounded-full ${c.bg}`}>
      <Ionicons name={c.icon} size={14} color={status === "pending" ? "#D97706" : status === "approved" ? "#059669" : "#DC2626"} />
      <Text className={`text-[13px] font-semibold ml-1.5 capitalize ${c.text}`}>{status}</Text>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  if (!value || value === "--") return null;
  return (
    <View className="flex-row items-center justify-between py-2.5">
      <View className="flex-row items-center flex-1 min-w-0">
        <Ionicons name={icon} size={15} color="#94A3B8" />
        <Text className="text-slate-500 text-[13px] ml-2">{label}</Text>
      </View>
      <Text className="text-slate-900 text-[13px] font-medium ml-4 text-right flex-1 min-w-0" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

export function LeaveDetailScreen() {
  const { leaveId } = useLocalSearchParams<{ leaveId: string }>();
  const {
    data: leave,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useLeaveDetail(leaveId ?? "");
  const { data: balances } = useLeaveBalance();
  const cancelMutation = useCancelLeave();

  const handleCancel = useCallback(() => {
    Alert.alert("Cancel Leave", "Are you sure you want to cancel this leave request?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, Cancel",
        style: "destructive",
        onPress: async () => {
          try {
            await cancelMutation.mutateAsync(leaveId ?? "");
            Alert.alert("Success", "Leave request cancelled successfully.", [
              { text: "OK", onPress: () => router.back() },
            ]);
          } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || "Failed to cancel leave";
            Alert.alert("Error", message);
          }
        },
      },
    ]);
  }, [cancelMutation, leaveId]);

  if (!leaveId) {
    return (
      <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
        <View className="flex-1 bg-surface-background">
          <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
            <View className="flex-row items-center min-w-0">
              <TouchableOpacity
                className="w-9 h-9 bg-slate-100 rounded-full items-center justify-center mr-3"
                activeOpacity={0.7}
                onPress={() => router.back()}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
              <Text className="text-slate-900 text-[18px] font-semibold">Leave Details</Text>
            </View>
          </View>
          <View className="items-center justify-center flex-1">
            <View className="w-16 h-16 bg-slate-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="alert-circle-outline" size={32} color="#CBD5E1" />
            </View>
            <Text className="text-slate-700 text-sm font-semibold">No leave selected</Text>
            <Text className="text-slate-400 text-xs mt-1 text-center max-w-[240px]">
              Leave ID is required to view details.
            </Text>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
      <View className="flex-1 bg-surface-background">
        <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center min-w-0">
              <TouchableOpacity
                className="w-9 h-9 bg-slate-100 rounded-full items-center justify-center mr-3"
                activeOpacity={0.7}
                onPress={() => router.back()}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
              <Text className="text-slate-900 text-[18px] font-semibold">Leave Details</Text>
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} tintColor="#4F46E5" colors={["#4F46E5"]} />
          }
        >
          {isLoading ? (
            <View className="items-center justify-center pt-24 pb-8">
              <ActivityIndicator size="large" color="#4F46E5" />
              <Text className="text-slate-400 text-sm mt-3">Loading details...</Text>
            </View>
          ) : isError || !leave ? (
            <View className="items-center justify-center pt-20 pb-8">
              <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
                <Ionicons name="cloud-offline-outline" size={32} color="#DC2626" />
              </View>
              <Text className="text-slate-800 text-lg font-bold text-center mb-2">Connection Error</Text>
              <Text className="text-slate-400 text-sm text-center leading-5 max-w-[260px] mb-2">
                Could not load leave details
              </Text>
              <TouchableOpacity
                className="flex-row items-center bg-primary-600 px-6 py-3 rounded-xl mt-2"
                activeOpacity={0.7}
                onPress={() => refetch()}
                accessibilityRole="button"
                accessibilityLabel="Retry"
              >
                <Ionicons name="refresh-outline" size={18} color="#FFFFFF" />
                <Text className="text-white font-semibold text-sm ml-2">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Leave Info Card */}
              <Card padding="md" className="mt-4">
                <View className="flex-row items-start">
                  <View className="w-12 h-12 rounded-2xl bg-indigo-50 items-center justify-center mr-4">
                    <Ionicons name={getLeaveIcon(leave.leaveType)} size={24} color="#4F46E5" />
                  </View>
                  <View className="flex-1 min-w-0">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-slate-900 text-[18px] font-bold flex-1 mr-2" numberOfLines={1}>
                        {leave.leaveType ?? "Leave"}
                      </Text>
                      <StatusBadge status={leave.status} />
                    </View>
                    <View className="flex-row items-center mt-1.5">
                      <Ionicons name="layers-outline" size={14} color="#4F46E5" />
                      <Text className="text-indigo-600 text-[20px] font-bold ml-1.5">{leave.days ?? 0}</Text>
                      <Text className="text-indigo-400 text-[13px] ml-1">day{(leave.days ?? 0) !== 1 ? "s" : ""}</Text>
                    </View>
                  </View>
                </View>

                <View className="mt-4 pt-4 border-t border-slate-100 gap-0">
                  <InfoRow icon="calendar-outline" label="From" value={formatDateFull(leave.fromDate)} />
                  <InfoRow icon="calendar-outline" label="To" value={formatDateFull(leave.toDate)} />
                  <InfoRow icon="create-outline" label="Applied On" value={formatDateFull(leave.appliedDate)} />
                  {leave.approver ? (
                    <InfoRow icon="person-outline" label="Approver" value={leave.approver} />
                  ) : null}
                  {leave.approvalDate ? (
                    <InfoRow icon="checkmark-circle-outline" label="Approval Date" value={formatDateFull(leave.approvalDate)} />
                  ) : null}
                </View>
              </Card>

              {/* Reason */}
              {leave.reason ? (
                <Card padding="md" className="mt-3">
                  <Text className="text-slate-500 text-[12px] font-semibold mb-2 uppercase tracking-wide">Reason</Text>
                  <Text className="text-slate-800 text-[14px] leading-6">{leave.reason}</Text>
                </Card>
              ) : null}

              {/* Remarks */}
              {leave.remarks ? (
                <Card padding="md" className="mt-3">
                  <Text className="text-slate-500 text-[12px] font-semibold mb-2 uppercase tracking-wide">Remarks</Text>
                  <View className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <Text className="text-amber-800 text-[14px] leading-5">{leave.remarks}</Text>
                  </View>
                </Card>
              ) : null}

              {/* Timeline */}
              {leave.timeline && leave.timeline.length > 0 ? (
                <Card padding="md" className="mt-3">
                  <Text className="text-slate-500 text-[12px] font-semibold mb-3 uppercase tracking-wide">Timeline</Text>
                  {leave.timeline.map((entry, i) => (
                    <View
                      key={entry.date + (entry.status ?? "") + i}
                      className={`flex-row items-start py-2.5 ${i < (leave.timeline?.length ?? 0) - 1 ? "border-b border-slate-50" : ""}`}
                    >
                      <View className="w-6 items-center">
                        <View
                          className={`w-2.5 h-2.5 rounded-full mt-1 ${
                            entry.status === "approved"
                              ? "bg-emerald-500"
                              : entry.status === "rejected"
                                ? "bg-red-500"
                                : "bg-amber-500"
                          }`}
                        />
                        {i < (leave.timeline?.length ?? 0) - 1 ? (
                          <View className="w-px flex-1 bg-slate-200 mt-1" />
                        ) : null}
                      </View>
                      <View className="flex-1 ml-3">
                        <Text className="text-slate-800 text-[13px] font-medium capitalize">{entry.status}</Text>
                        <Text className="text-slate-400 text-[11px] mt-0.5">{formatDate(entry.date)}</Text>
                        {entry.remark ? (
                          <Text className="text-slate-500 text-[12px] mt-1">{entry.remark}</Text>
                        ) : null}
                        {entry.updatedBy ? (
                          <Text className="text-slate-400 text-[11px] mt-0.5">by {entry.updatedBy}</Text>
                        ) : null}
                      </View>
                    </View>
                  ))}
                </Card>
              ) : null}

              {/* Balance Summary */}
              {balances && balances.length > 0 ? (
                <Card padding="md" className="mt-3">
                  <Text className="text-slate-500 text-[12px] font-semibold mb-3 uppercase tracking-wide">Leave Balance</Text>
                  <View className="flex-row gap-2">
                    {balances.slice(0, 3).map((b, i) => (
                      <View
                        key={b.leaveTypeId ?? `bal-${i}`}
                        className="flex-1 bg-slate-50 rounded-xl p-3 items-center"
                      >
                        <Text className="text-slate-900 text-[16px] font-bold">{b.used ?? 0}/{b.total ?? 0}</Text>
                        <Text className="text-slate-500 text-[10px] font-medium mt-0.5" numberOfLines={1}>
                          {b.leaveTypeName ?? "Leave"}
                        </Text>
                      </View>
                    ))}
                  </View>
                </Card>
              ) : null}

              {/* Actions */}
              <View className="mt-6">
                {leave.status === "pending" ? (
                  <TouchableOpacity
                    className="flex-row items-center justify-center border-2 border-red-400 bg-red-50 rounded-2xl py-4"
                    activeOpacity={0.7}
                    onPress={handleCancel}
                    disabled={cancelMutation.isPending}
                    accessibilityRole="button"
                    accessibilityLabel="Cancel this leave request"
                  >
                    {cancelMutation.isPending ? (
                      <ActivityIndicator size="small" color="#DC2626" />
                    ) : (
                      <>
                        <Ionicons name="close-circle-outline" size={20} color="#DC2626" />
                        <Text className="text-red-600 text-[16px] font-bold ml-2">Cancel Request</Text>
                      </>
                    )}
                  </TouchableOpacity>
                ) : leave.status === "rejected" ? (
                  <View className="bg-red-50 border border-red-200 rounded-2xl p-4 items-center">
                    <Ionicons name="close-circle-outline" size={28} color="#DC2626" />
                    <Text className="text-red-700 text-[15px] font-semibold mt-2">Leave Rejected</Text>
                    <Text className="text-red-500 text-[13px] mt-1 text-center">
                      {leave.remarks ?? "No remarks provided."}
                    </Text>
                  </View>
                ) : leave.status === "approved" ? (
                  <View className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 items-center">
                    <Ionicons name="checkmark-circle-outline" size={28} color="#059669" />
                    <Text className="text-emerald-700 text-[15px] font-semibold mt-2">Leave Approved</Text>
                    {leave.approver ? (
                      <Text className="text-emerald-500 text-[13px] mt-1">Approved by {leave.approver}</Text>
                    ) : null}
                  </View>
                ) : null}
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
