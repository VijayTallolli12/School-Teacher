import { useCallback, useMemo, useState } from "react";
import { cardShadow } from "../theme/shadows";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScreenContainer } from "@/components";
import { Card } from "@/components/ui/Card";
import { useLeaveTypes, useApplyLeave } from "@/hooks/useLeave";
import type { LeaveType } from "@/types";


function formatDateDisplay(d: Date): string {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function calcDays(from: Date | null, to: Date | null): number {
  if (!from || !to) return 0;
  const diff = to.getTime() - from.getTime();
  if (diff < 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
}

function formatDateParam(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function LeaveApplyScreen() {
  const { data: leaveTypes, isLoading: typesLoading } = useLeaveTypes();
  const applyMutation = useApplyLeave();

  const [selectedType, setSelectedType] = useState<(LeaveType & { name: string }) | null>(null);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [reason, setReason] = useState("");
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const totalDays = useMemo(() => calcDays(fromDate, toDate), [fromDate, toDate]);

  const handleTypeSelect = useCallback(() => {
    if (!leaveTypes || leaveTypes.length === 0) return;
    Alert.alert("Select Leave Type", "Choose the type of leave you want to apply for", [
      ...leaveTypes.map((lt) => ({
        text: lt.name,
        onPress: () => setSelectedType(lt as LeaveType & { name: string }),
      })),
      { text: "Cancel", style: "cancel" },
    ]);
  }, [leaveTypes]);

  const handleSubmit = useCallback(async () => {
    if (!selectedType) {
      Alert.alert("Validation Error", "Please select a leave type");
      return;
    }
    if (!fromDate) {
      Alert.alert("Validation Error", "Please select start date");
      return;
    }
    if (!toDate) {
      Alert.alert("Validation Error", "Please select end date");
      return;
    }
    if (totalDays < 1) {
      Alert.alert("Validation Error", "End date must be on or after start date");
      return;
    }
    if (!reason.trim()) {
      Alert.alert("Validation Error", "Please provide a reason for leave");
      return;
    }

    try {
      await applyMutation.mutateAsync({
        leaveTypeId: selectedType.id,
        fromDate: formatDateParam(fromDate),
        toDate: formatDateParam(toDate),
        reason: reason.trim(),
      });
      Alert.alert("Success", "Leave application submitted successfully.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "Failed to apply for leave";
      Alert.alert("Error", message);
    }
  }, [selectedType, fromDate, toDate, totalDays, reason, applyMutation]);

  if (typesLoading) {
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
                <Text className="text-slate-900 text-[18px] font-semibold">Apply Leave</Text>
              </View>
            </View>
          </View>
          <View className="items-center justify-center flex-1">
            <ActivityIndicator size="large" color="#4F46E5" />
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
              <Text className="text-slate-900 text-[18px] font-semibold">Apply Leave</Text>
            </View>
          </View>
        </View>

        <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Leave Type */}
            <Card padding="md" className="mt-4">
              <Text className="text-slate-500 text-[12px] font-semibold mb-2">LEAVE TYPE</Text>
              <TouchableOpacity
                className="flex-row items-center justify-between bg-slate-50 rounded-xl px-4 py-3.5 border border-slate-200"
                activeOpacity={0.7}
                onPress={handleTypeSelect}
                accessibilityRole="button"
                accessibilityLabel="Select leave type"
              >
                <View className="flex-row items-center flex-1 min-w-0">
                  <Ionicons
                    name={selectedType ? "checkmark-circle" : "layers-outline"}
                    size={18}
                    color={selectedType ? "#4F46E5" : "#94A3B8"}
                  />
                  <Text
                    className={`text-[15px] ml-2 flex-1 min-w-0 ${selectedType ? "text-slate-900 font-medium" : "text-slate-400"}`}
                    numberOfLines={1}
                  >
                    {selectedType?.name ?? "Select leave type"}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={18} color="#94A3B8" />
              </TouchableOpacity>
            </Card>

            {/* Dates */}
            <Card padding="md" className="mt-3">
              <Text className="text-slate-500 text-[12px] font-semibold mb-3">DATES</Text>
              <View className="flex-row gap-3">
                {/* From Date */}
                <View className="flex-1">
                  <Text className="text-slate-400 text-[11px] font-medium mb-1.5">Start Date</Text>
                  <TouchableOpacity
                    className="flex-row items-center bg-slate-50 rounded-xl px-3 py-3.5 border border-slate-200"
                    activeOpacity={0.7}
                    onPress={() => {
                      if (Platform.OS === "android") setShowFromPicker(true);
                      else setShowFromPicker((p) => !p);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel="Select start date"
                  >
                    <Ionicons name="calendar-outline" size={16} color={fromDate ? "#4F46E5" : "#94A3B8"} />
                    <Text className={`text-[13px] ml-1.5 ${fromDate ? "text-slate-900" : "text-slate-400"}`}>
                      {fromDate ? formatDateDisplay(fromDate) : "Select"}
                    </Text>
                  </TouchableOpacity>
                  {showFromPicker && (
                    <DateTimePicker
                      value={fromDate ?? new Date()}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      minimumDate={new Date()}
                      onChange={(_: any, date?: Date) => {
                        setShowFromPicker(Platform.OS !== "ios");
                        if (date) {
                          setFromDate(date);
                          if (toDate && date > toDate) setToDate(null);
                        }
                      }}
                    />
                  )}
                </View>

                {/* To Date */}
                <View className="flex-1">
                  <Text className="text-slate-400 text-[11px] font-medium mb-1.5">End Date</Text>
                  <TouchableOpacity
                    className="flex-row items-center bg-slate-50 rounded-xl px-3 py-3.5 border border-slate-200"
                    activeOpacity={0.7}
                    onPress={() => {
                      if (!fromDate) {
                        Alert.alert("Select Start Date", "Please select a start date first");
                        return;
                      }
                      if (Platform.OS === "android") setShowToPicker(true);
                      else setShowToPicker((p) => !p);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel="Select end date"
                  >
                    <Ionicons name="calendar-outline" size={16} color={toDate ? "#4F46E5" : "#94A3B8"} />
                    <Text className={`text-[13px] ml-1.5 ${toDate ? "text-slate-900" : "text-slate-400"}`}>
                      {toDate ? formatDateDisplay(toDate) : "Select"}
                    </Text>
                  </TouchableOpacity>
                  {showToPicker && (
                    <DateTimePicker
                      value={toDate ?? fromDate ?? new Date()}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      minimumDate={fromDate ?? new Date()}
                      onChange={(_: any, date?: Date) => {
                        setShowToPicker(Platform.OS !== "ios");
                        if (date) setToDate(date);
                      }}
                    />
                  )}
                </View>
              </View>

              {/* Total Days */}
              {totalDays > 0 && (
                <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-slate-100">
                  <Text className="text-slate-500 text-[13px] font-medium">Total Days</Text>
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 bg-indigo-50 rounded-lg items-center justify-center mr-2">
                      <Ionicons name="layers-outline" size={14} color="#4F46E5" />
                    </View>
                    <Text className="text-indigo-600 text-[20px] font-bold">{totalDays}</Text>
                    <Text className="text-indigo-400 text-[13px] ml-1">day{totalDays !== 1 ? "s" : ""}</Text>
                  </View>
                </View>
              )}
            </Card>

            {/* Reason */}
            <Card padding="md" className="mt-3">
              <Text className="text-slate-500 text-[12px] font-semibold mb-2">REASON</Text>
              <TextInput
                className="bg-slate-50 rounded-xl px-4 py-3.5 border border-slate-200 text-slate-900 text-[14px] min-h-[120px] text-align-vertical-top"
                placeholder="Enter the reason for your leave request..."
                placeholderTextColor="#94A3B8"
                value={reason}
                onChangeText={setReason}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                accessibilityLabel="Leave reason"
              />
              <Text className="text-slate-400 text-[11px] mt-1.5 text-right">{reason.length} characters</Text>
            </Card>

            {/* Submit */}
            <TouchableOpacity
              className="w-full bg-indigo-600 rounded-2xl py-4 items-center justify-center mt-6 flex-row"
              style={cardShadow}
              activeOpacity={0.8}
              onPress={handleSubmit}
              disabled={applyMutation.isPending}
              accessibilityRole="button"
              accessibilityLabel="Submit leave application"
            >
              {applyMutation.isPending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="paper-plane-outline" size={18} color="#FFFFFF" />
                  <Text className="text-white text-[16px] font-bold ml-2">Submit Application</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ScreenContainer>
  );
}
