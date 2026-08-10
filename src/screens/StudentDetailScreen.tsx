import { useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
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
import { useStudentDetail } from "../hooks/useStudents";

function getInitials(name: string): string {
  return (
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "?"
  );
}

function InfoRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onPress?: () => void;
}) {
  const content = (
    <View className="flex-row items-center justify-between py-2.5 border-b border-slate-50">
      <View className="flex-row items-center flex-1">
        <Ionicons name={icon} size={14} color="#94A3B8" />
        <Text className="text-slate-500 text-[13px] ml-2">{label}</Text>
      </View>
      <Text className="text-slate-800 text-[13px] font-medium text-right flex-1" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} accessibilityRole="button" accessibilityLabel={label}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

export function StudentDetailScreen() {
  const { studentId } = useLocalSearchParams<{ studentId: string }>();

  const {
    data: student,
    isLoading,
    isError,
    refetch,
  } = useStudentDetail(studentId ?? "");

  const handleCall = useCallback((phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() =>
      Alert.alert("Error", "Could not initiate call")
    );
  }, []);

  const handleAttendance = useCallback(() => {
    router.push("/(tabs)/attendance");
  }, []);

  const handleHomework = useCallback(() => {
    router.push("/(tabs)/homework");
  }, []);

  return (
    <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
      <View className="flex-1 bg-surface-background">
        {/* Header */}
        <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-9 h-9 bg-slate-100 rounded-full items-center justify-center"
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
            <Text className="text-slate-900 text-[18px] font-semibold ml-3">Student Detail</Text>
          </View>
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text className="text-slate-400 text-sm mt-3">Loading student details...</Text>
          </View>
        ) : isError || !student ? (
          <View className="flex-1 items-center justify-center px-8">
            <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="cloud-offline-outline" size={32} color="#DC2626" />
            </View>
            <Text className="text-slate-800 text-lg font-bold text-center mb-2">Something went wrong</Text>
            <Text className="text-slate-400 text-sm text-center leading-5 max-w-[260px] mb-6">
              Could not load student details
            </Text>
            <TouchableOpacity
              className="flex-row items-center bg-primary-600 px-6 py-3 rounded-xl"
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
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={refetch} tintColor="#4F46E5" colors={["#4F46E5"]} />
            }
          >
            {/* Profile Card */}
            <View className="mt-4">
              <Card padding="lg">
                <View className="items-center">
                  <View className="w-20 h-20 rounded-full bg-primary-50 items-center justify-center mb-3">
                    <Text className="text-primary-600 text-[28px] font-bold">
                      {getInitials(student?.name ?? "")}
                    </Text>
                  </View>
                  <Text className="text-slate-900 text-[20px] font-bold">
                    {student?.name ?? "Unknown Student"}
                  </Text>
                  <Text className="text-slate-500 text-[13px] mt-1">
                    {student?.admissionNo ?? "—"} · {student?.className ?? ""}
                    {student?.section ? ` - ${student.section}` : ""}
                  </Text>
                </View>

                <View className="mt-4 pt-4 border-t border-slate-100">
                  <InfoRow icon="list-outline" label="Roll Number" value={student?.rollNumber ?? "—"} />
                  <InfoRow icon="person-outline" label="Gender" value={student?.gender ?? "—"} />
                  <InfoRow icon="calendar-outline" label="Date of Birth" value={student?.dateOfBirth ?? "—"} />
                  <InfoRow icon="color-palette-outline" label="Blood Group" value={student?.bloodGroup ?? "—"} />
                </View>
              </Card>
            </View>

            {/* Quick Actions */}
            <View className="flex-row gap-3 mt-6">
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center bg-primary-50 rounded-xl py-3"
                activeOpacity={0.7}
                onPress={() => handleCall(student?.parentInfo?.fatherPhone ?? "")}
                accessibilityRole="button"
                accessibilityLabel="Call parent"
              >
                <Ionicons name="call-outline" size={18} color="#4F46E5" />
                <Text className="text-primary-600 text-[13px] font-semibold ml-2">Call Parent</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center bg-amber-50 rounded-xl py-3"
                activeOpacity={0.7}
                onPress={handleAttendance}
                accessibilityRole="button"
                accessibilityLabel="View attendance"
              >
                <Ionicons name="clipboard-outline" size={18} color="#D97706" />
                <Text className="text-amber-600 text-[13px] font-semibold ml-2">Attendance</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center bg-rose-50 rounded-xl py-3"
                activeOpacity={0.7}
                onPress={handleHomework}
                accessibilityRole="button"
                accessibilityLabel="View homework"
              >
                <Ionicons name="create-outline" size={18} color="#E11D48" />
                <Text className="text-rose-600 text-[13px] font-semibold ml-2">Homework</Text>
              </TouchableOpacity>
            </View>

            {/* Attendance Summary */}
            <View className="mt-6">
              <View className="flex-row items-center mb-2">
                <Ionicons name="bar-chart-outline" size={14} color="#94A3B8" />
                <Text className="text-slate-400 text-[12px] font-semibold uppercase ml-1.5 tracking-wider">
                  Attendance
                </Text>
              </View>
              <Card padding="md">
                <View className="items-center mb-4">
                  <Text className="text-slate-900 text-[36px] font-bold">
                    {student?.attendance?.percentage ?? 0}%
                  </Text>
                  <Text className="text-slate-500 text-[13px] mt-1">Attendance Rate</Text>
                </View>
                <View className="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(student?.attendance?.percentage ?? 0, 100)}%`,
                      backgroundColor:
                        (student?.attendance?.percentage ?? 0) >= 75
                          ? "#10B981"
                          : (student?.attendance?.percentage ?? 0) >= 50
                          ? "#F59E0B"
                          : "#EF4444",
                    }}
                  />
                </View>
                <View className="flex-row gap-3">
                  <View className="flex-1 items-center bg-emerald-50 rounded-xl py-2.5">
                    <Text className="text-emerald-700 text-[18px] font-bold">
                      {student?.attendance?.present ?? 0}
                    </Text>
                    <Text className="text-emerald-600 text-[11px] font-medium">Present</Text>
                  </View>
                  <View className="flex-1 items-center bg-red-50 rounded-xl py-2.5">
                    <Text className="text-red-700 text-[18px] font-bold">
                      {student?.attendance?.absent ?? 0}
                    </Text>
                    <Text className="text-red-600 text-[11px] font-medium">Absent</Text>
                  </View>
                  <View className="flex-1 items-center bg-amber-50 rounded-xl py-2.5">
                    <Text className="text-amber-700 text-[18px] font-bold">
                      {student?.attendance?.late ?? 0}
                    </Text>
                    <Text className="text-amber-600 text-[11px] font-medium">Late</Text>
                  </View>
                </View>
              </Card>
            </View>

            {/* Parent Info */}
            <View className="mt-6">
              <View className="flex-row items-center mb-2">
                <Ionicons name="people-outline" size={14} color="#94A3B8" />
                <Text className="text-slate-400 text-[12px] font-semibold uppercase ml-1.5 tracking-wider">
                  Parent / Guardian
                </Text>
              </View>
              <Card padding="md">
                <InfoRow icon="person-outline" label="Father" value={student?.parentInfo?.fatherName ?? "—"} />
                <InfoRow icon="person-outline" label="Mother" value={student?.parentInfo?.motherName ?? "—"} />
                <InfoRow
                  icon="call-outline"
                  label="Father Phone"
                  value={student?.parentInfo?.fatherPhone ?? "—"}
                  onPress={() => handleCall(student?.parentInfo?.fatherPhone ?? "")}
                />
                <InfoRow
                  icon="call-outline"
                  label="Mother Phone"
                  value={student?.parentInfo?.motherPhone ?? "—"}
                  onPress={() => handleCall(student?.parentInfo?.motherPhone ?? "")}
                />
                {student?.parentInfo?.fatherEmail ? (
                  <InfoRow
                    icon="mail-outline"
                    label="Father Email"
                    value={student.parentInfo.fatherEmail}
                  />
                ) : null}
                {student?.parentInfo?.motherEmail ? (
                  <InfoRow
                    icon="mail-outline"
                    label="Mother Email"
                    value={student.parentInfo.motherEmail}
                  />
                ) : null}
                <InfoRow
                  icon="location-outline"
                  label="Address"
                  value={student?.parentInfo?.address ?? "—"}
                />
              </Card>
            </View>

            {/* Transport */}
            {student?.transport ? (
              <View className="mt-6">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="bus-outline" size={14} color="#94A3B8" />
                  <Text className="text-slate-400 text-[12px] font-semibold uppercase ml-1.5 tracking-wider">
                    Transport
                  </Text>
                </View>
                <Card padding="md">
                  <InfoRow icon="map-outline" label="Route" value={student.transport.route ?? "—"} />
                  <InfoRow icon="location-outline" label="Stop" value={student.transport.stop ?? "—"} />
                  <InfoRow icon="time-outline" label="Pickup" value={student.transport.pickupTime ?? "—"} />
                  <InfoRow icon="time-outline" label="Drop" value={student.transport.dropTime ?? "—"} />
                  {student.transport.driverName ? (
                    <InfoRow icon="person-outline" label="Driver" value={student.transport.driverName} />
                  ) : null}
                  {student.transport.driverPhone ? (
                    <InfoRow
                      icon="call-outline"
                      label="Driver Phone"
                      value={student.transport.driverPhone}
                      onPress={() => handleCall(student?.transport?.driverPhone ?? "")}
                    />
                  ) : null}
                </Card>
              </View>
            ) : null}

            {/* Fee Status */}
            {student?.feeStatus ? (
              <View className="mt-6">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="cash-outline" size={14} color="#94A3B8" />
                  <Text className="text-slate-400 text-[12px] font-semibold uppercase ml-1.5 tracking-wider">
                    Fee Status
                  </Text>
                </View>
                <Card padding="md">
                  <InfoRow
                    icon="wallet-outline"
                    label="Total Fee"
                    value={`₹${(student.feeStatus.totalFee ?? 0).toLocaleString()}`}
                  />
                  <InfoRow
                    icon="checkmark-circle"
                    label="Paid"
                    value={`₹${(student.feeStatus.paid ?? 0).toLocaleString()}`}
                  />
                  <InfoRow
                    icon="alert-circle"
                    label="Due"
                    value={`₹${(student.feeStatus.due ?? 0).toLocaleString()}`}
                  />
                  <InfoRow icon="calendar-outline" label="Due Date" value={student.feeStatus.dueDate ?? "—"} />
                  <InfoRow
                    icon="information-circle-outline"
                    label="Status"
                    value={
                      student.feeStatus.status
                        ? student.feeStatus.status.charAt(0).toUpperCase() + student.feeStatus.status.slice(1)
                        : "—"
                    }
                  />
                </Card>
              </View>
            ) : null}

            {/* Recent Homework */}
            {student?.recentHomework && student.recentHomework.length > 0 ? (
              <View className="mt-6">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="create-outline" size={14} color="#94A3B8" />
                  <Text className="text-slate-400 text-[12px] font-semibold uppercase ml-1.5 tracking-wider">
                    Recent Homework
                  </Text>
                </View>
                {student.recentHomework.map((hw, index) => (
                  <Card key={hw?.id ?? `hw-${index}`} padding="md" className="mb-2">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1 mr-3">
                        <Text className="text-primary-600 text-[12px] font-bold mb-0.5">
                          {hw?.subject ?? "—"}
                        </Text>
                        <Text className="text-slate-800 text-[14px] font-semibold" numberOfLines={1}>
                          {hw?.title ?? "Untitled"}
                        </Text>
                      </View>
                      <View className="items-end">
                        <Text className="text-slate-400 text-[11px]">{hw?.dueDate ?? "—"}</Text>
                        <Text className="text-slate-500 text-[11px] font-medium mt-0.5">
                          {hw?.status ?? "—"}
                        </Text>
                      </View>
                    </View>
                  </Card>
                ))}
              </View>
            ) : null}
          </ScrollView>
        )}
      </View>
    </ScreenContainer>
  );
}
