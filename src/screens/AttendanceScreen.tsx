import { useCallback, useEffect, useState, useRef } from "react";
import { cardShadow } from "../theme/shadows";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { ScreenContainer } from "@/components";
import { ClassSelector } from "@/components/ClassSelector";
import { useClasses, useStudents, useMarkAttendance } from "@/hooks/useAttendance";
import type { TeacherClass, MarkAttendancePayload, MarkAttendanceResponse } from "@/types";

type AttendanceStatus = "present" | "absent" | "late";


const STATUS_CONFIG: Record<AttendanceStatus, { label: string; icon: keyof typeof Ionicons.glyphMap; color: string; tint: string }> = {
  present: { label: "Present", icon: "checkmark-circle", color: "#22C55E", tint: "#F0FDF4" },
  absent: { label: "Absent", icon: "close-circle", color: "#DC2626", tint: "#FEF2F2" },
  late: { label: "Late", icon: "time-outline", color: "#D97706", tint: "#FFFBEB" },
};

function StatusChip({
  status,
  selected,
  onPress,
  disabled,
}: {
  status: AttendanceStatus;
  selected: boolean;
  onPress: () => void;
  disabled: boolean;
}) {
  const config = STATUS_CONFIG[status];
  return (
    <TouchableOpacity
      className={`rounded-xl px-3 py-2 ${selected ? "" : "bg-white border"}`}
      style={selected ? { backgroundColor: config.color } : { borderColor: config.color }}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Mark ${status}`}
      accessibilityState={{ selected }}
    >
      <Text
        className={`text-xs font-semibold ${selected ? "text-white" : ""}`}
        style={selected ? undefined : { color: config.color }}
      >
        {config.label}
      </Text>
    </TouchableOpacity>
  );
}

function StudentCard({
  student,
  status,
  onStatusChange,
  disabled,
}: {
  student: { id: string; name: string; rollNumber: string };
  status: AttendanceStatus | null;
  onStatusChange: (status: AttendanceStatus) => void;
  disabled: boolean;
}) {
  const initial = student?.name?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <View className="rounded-2xl bg-white border border-surface-border p-4" style={cardShadow}>
      <View className="flex-row items-center">
        <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-3">
          <Text className="text-slate-600 font-bold text-sm">{initial}</Text>
        </View>
        <View className="flex-1 min-w-0">
          <Text className="text-slate-900 font-semibold text-sm" numberOfLines={1}>
            {student?.name ?? "Unknown Student"}
          </Text>
          <Text className="text-slate-400 text-xs mt-0.5">
            Roll: {student?.rollNumber ?? "—"}
          </Text>
        </View>
      </View>
      <View className="flex-row gap-2 mt-3">
        {(Object.keys(STATUS_CONFIG) as AttendanceStatus[]).map((s) => (
          <StatusChip
            key={s}
            status={s}
            selected={status === s}
            onPress={() => onStatusChange(s)}
            disabled={disabled}
          />
        ))}
      </View>
    </View>
  );
}

function SummaryMetric({
  icon,
  value,
  label,
  color,
  tint,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
  label: string;
  color: string;
  tint: string;
}) {
  return (
    <View className="flex-1 rounded-2xl bg-white border border-surface-border p-4 overflow-hidden" style={cardShadow}>
      <View className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-sm" style={{ backgroundColor: color }} />
      <View className="w-10 h-10 rounded-xl items-center justify-center mb-3" style={{ backgroundColor: tint }}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text className="text-slate-900 text-[28px] font-bold" numberOfLines={1}>
        {value}
      </Text>
      <Text className="text-slate-500 text-[13px] font-medium mt-1" numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

export function AttendanceScreen() {
  const [selectedClass, setSelectedClass] = useState<TeacherClass | null>(null);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{
    markedCount: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
  } | null>(null);
  const [isAlreadyMarked, setIsAlreadyMarked] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useFocusEffect(
    useCallback(() => {
      setShowSuccess(false);
      setSuccessData(null);
    }, [])
  );

  const { data: classes, isLoading: classesLoading, error: classesError, refetch: refetchClasses } = useClasses();
  const { data: students, isLoading: studentsLoading, error: studentsError, refetch: refetchStudents } = useStudents(
    selectedClass?.id ?? ""
  );
  const { mutate: markAttendance, isPending: isSubmitting } = useMarkAttendance();

  // Auto-select when exactly 1 class (single-class users shouldn't need to tap)
  useEffect(() => {
    if (classes && classes.length === 1 && !selectedClass) {
      setSelectedClass(classes[0]);
    }
  }, [classes, selectedClass]);

  // Detect if attendance already marked
  useEffect(() => {
    if (students && students.length > 0) {
      const existing = students.some((s) => s.attendanceStatus != null);
      setIsAlreadyMarked(existing);
      if (existing) {
        const prefill: Record<string, AttendanceStatus> = {};
        students.forEach((s) => {
          if (s.attendanceStatus) prefill[s.id] = s.attendanceStatus;
        });
        setAttendanceMap(prefill);
      } else {
        setAttendanceMap({});
      }
    }
  }, [students]);

  const handleStatusChange = useCallback(
    (studentId: string, status: AttendanceStatus) => {
      if (isAlreadyMarked) return;
      setAttendanceMap((prev) => ({
        ...prev,
        [studentId]: status,
      }));
    },
    [isAlreadyMarked]
  );

  const handleSubmit = useCallback(() => {
    if (!selectedClass) {
      Alert.alert("Error", "Please select a class first");
      return;
    }
    if (!students || students.length === 0) {
      Alert.alert("Error", "No students loaded for this class");
      return;
    }
    const markedCount = Object.keys(attendanceMap).length;
    if (markedCount === 0) {
      Alert.alert("Error", "Please mark attendance for at least one student");
      return;
    }

    const doSubmit = () => {
      const records = Object.entries(attendanceMap).map(([studentId, status]) => ({
        student_id: Number(studentId),
        status,
      }));
      const payload: MarkAttendancePayload = {
        class_section_id: Number(selectedClass.id),
        attendance_date: new Date().toISOString().split("T")[0],
        students: records,
      };
      markAttendance(payload, {
        onSuccess: (data: MarkAttendanceResponse) => {
          const records = data.data.records;
          setSuccessData({
            markedCount: data.data.marked_count,
            presentCount: records.filter((r) => r.status === "present").length,
            absentCount: records.filter((r) => r.status === "absent").length,
            lateCount: records.filter((r) => r.status === "late").length,
          });
          setShowSuccess(true);
          setAttendanceMap({});
          setSelectedClass(null);
          setIsAlreadyMarked(false);
        },
        onError: (error) => {
          const message = error?.message ?? "";
          if (message.toLowerCase().includes("already") || message.toLowerCase().includes("already marked")) {
            Alert.alert("Already Marked", "Attendance has already been recorded for this class today.");
          } else {
            Alert.alert("Error", message || "Failed to submit attendance");
          }
        },
      });
    };

    if (markedCount < students.length) {
      Alert.alert(
        "Incomplete",
        `You have marked ${markedCount} out of ${students.length} students. Submit anyway?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Submit", onPress: doSubmit },
        ]
      );
    } else {
      doSubmit();
    }
  }, [selectedClass, students, attendanceMap, markAttendance]);

  const handleReset = useCallback(() => {
    setShowSuccess(false);
    setSuccessData(null);
    setAttendanceMap({});
    setSelectedClass(null);
    setIsAlreadyMarked(false);
  }, []);

  const handleEditAttendance = useCallback(() => {
    setIsAlreadyMarked(false);
  }, []);

  // ── Loading state (classes) ──
  if (classesLoading) {
    return (
      <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
        <View className="flex-1 bg-surface-background">
          <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
            <Text className="text-slate-900 text-[18px] font-semibold">Attendance</Text>
          </View>
          <View className="items-center justify-center pt-24 pb-8">
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text className="text-slate-400 text-sm mt-3">Loading classes...</Text>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  // ── Error state (classes) ──
  if (classesError) {
    return (
      <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
        <View className="flex-1 bg-surface-background">
          <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
            <Text className="text-slate-900 text-[18px] font-semibold">Attendance</Text>
          </View>
          <View className="items-center justify-center pt-20 pb-8 px-6">
            <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="cloud-offline-outline" size={32} color="#DC2626" />
            </View>
            <Text className="text-slate-800 text-lg font-bold text-center mb-2">Connection Error</Text>
            <Text className="text-slate-400 text-sm text-center leading-5 max-w-[260px] mb-6">
              {classesError?.message ?? "Failed to load classes"}
            </Text>
            <TouchableOpacity
              className="flex-row items-center bg-primary-600 px-6 py-3 rounded-xl"
              activeOpacity={0.7}
              onPress={() => refetchClasses()}
              accessibilityRole="button"
              accessibilityLabel="Retry"
            >
              <Ionicons name="refresh-outline" size={18} color="#FFFFFF" />
              <Text className="text-white font-semibold text-sm ml-2">Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  // ── Success screen ──
  if (showSuccess && successData) {
    return (
      <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
        <View className="flex-1 bg-surface-background">
          <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
            <Text className="text-slate-900 text-[18px] font-semibold">Attendance</Text>
          </View>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="items-center pt-12 pb-4">
              <View className="w-16 h-16 bg-green-50 rounded-full items-center justify-center mb-4">
                <Ionicons name="checkmark-circle" size={36} color="#22C55E" />
              </View>
              <Text className="text-slate-900 text-xl font-bold mb-1">Attendance Saved</Text>
              <Text className="text-slate-400 text-xs text-center mb-6">
                Attendance recorded and notifications sent.
              </Text>
            </View>

            <View className="rounded-2xl bg-white border border-surface-border p-4" style={cardShadow}>
              <View className="gap-3">
                <View className="flex-row gap-3">
                  <SummaryMetric
                    icon="people-outline"
                    value={successData.markedCount}
                    label="Processed"
                    color="#4F46E5"
                    tint="#EEF2FF"
                  />
                  <SummaryMetric
                    icon="checkmark-circle"
                    value={successData.presentCount}
                    label="Present"
                    color="#22C55E"
                    tint="#F0FDF4"
                  />
                </View>
                <View className="flex-row gap-3">
                  <SummaryMetric
                    icon="close-circle"
                    value={successData.absentCount}
                    label="Absent"
                    color="#DC2626"
                    tint="#FEF2F2"
                  />
                  <SummaryMetric
                    icon="time-outline"
                    value={successData.lateCount}
                    label="Late"
                    color="#D97706"
                    tint="#FFFBEB"
                  />
                </View>
              </View>
            </View>

            <View className="mt-6">
              <TouchableOpacity
                className="flex-row items-center justify-center bg-primary-600 px-6 py-3.5 rounded-xl"
                activeOpacity={0.7}
                onPress={handleReset}
                accessibilityRole="button"
                accessibilityLabel="Mark another class"
              >
                <Ionicons name="add-outline" size={18} color="#FFFFFF" />
                <Text className="text-white font-semibold text-sm ml-2">Mark Another Class</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </ScreenContainer>
    );
  }

  // ── Main screen ──
  return (
    <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
      <View className="flex-1 bg-surface-background">
        <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
          <View className="flex-row items-center justify-between">
            <Text className="text-slate-900 text-[18px] font-semibold">Attendance</Text>
            <TouchableOpacity
              className="w-9 h-9 bg-slate-100 rounded-full items-center justify-center"
              activeOpacity={0.7}
              onPress={() => router.push("/(tabs)/notifications")}
              accessibilityRole="button"
              accessibilityLabel="Open alerts"
            >
              <Ionicons name="notifications-outline" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Class Selector */}
          {classes && classes.length > 0 && (
            <View className="pt-4">
              <ClassSelector
                classes={classes}
                selectedClass={selectedClass}
                onSelectClass={setSelectedClass}
              />
            </View>
          )}

          {/* No class selected — empty state */}
          {!selectedClass && (
            <View className="items-center justify-center pt-16 pb-8">
              <View className="w-16 h-16 bg-primary-50 rounded-full items-center justify-center mb-4">
                <Ionicons name="checkbox-outline" size={32} color="#4F46E5" />
              </View>
              <Text className="text-slate-800 text-lg font-bold text-center mb-2">Select a Class</Text>
              <Text className="text-slate-400 text-sm text-center leading-5 max-w-[260px]">
                Choose a class above to start marking attendance
              </Text>
            </View>
          )}

          {/* Students error */}
          {selectedClass && studentsError && (
            <View className="items-center justify-center pt-10 pb-6">
              <View className="w-14 h-14 bg-red-50 rounded-full items-center justify-center mb-3">
                <Ionicons name="cloud-offline-outline" size={28} color="#DC2626" />
              </View>
              <Text className="text-slate-700 text-sm font-semibold text-center mb-2">Failed to Load Students</Text>
              <Text className="text-slate-400 text-xs text-center leading-5 max-w-[240px] mb-4">
                {studentsError?.message ?? "Please check your connection"}
              </Text>
              <TouchableOpacity
                className="flex-row items-center bg-primary-600 px-5 py-2.5 rounded-xl"
                activeOpacity={0.7}
                onPress={() => refetchStudents()}
                accessibilityRole="button"
                accessibilityLabel="Retry"
              >
                <Ionicons name="refresh-outline" size={16} color="#FFFFFF" />
                <Text className="text-white font-semibold text-xs ml-1.5">Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Students loading skeleton */}
          {selectedClass && studentsLoading && (
            <View className="pt-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <View key={i} className="rounded-2xl bg-white border border-surface-border p-4" style={cardShadow}>
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-3">
                      <View className="w-10 h-10 rounded-full bg-slate-200" />
                    </View>
                    <View className="flex-1 gap-1.5">
                      <View className="h-3 w-40 bg-slate-200 rounded" />
                      <View className="h-2.5 w-24 bg-slate-100 rounded" />
                    </View>
                  </View>
                  <View className="flex-row gap-2 mt-3">
                    <View className="h-8 flex-1 bg-slate-100 rounded-xl" />
                    <View className="h-8 flex-1 bg-slate-100 rounded-xl" />
                    <View className="h-8 flex-1 bg-slate-100 rounded-xl" />
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Students loaded — empty */}
          {selectedClass && students && students.length === 0 && !studentsLoading && (
            <View className="items-center justify-center pt-12 pb-6">
              <View className="w-16 h-16 bg-slate-50 rounded-full items-center justify-center mb-3">
                <Ionicons name="people-outline" size={32} color="#CBD5E1" />
              </View>
              <Text className="text-slate-700 text-sm font-semibold">No Students Found</Text>
              <Text className="text-slate-400 text-xs mt-1 text-center leading-5 max-w-[240px]">
                No students are assigned to this class.
              </Text>
            </View>
          )}

          {/* Students list */}
          {selectedClass && students && students.length > 0 && (
            <View className="pt-4">
              {/* Already-marked banner */}
              {isAlreadyMarked && (
                <View className="flex-row items-center gap-2 rounded-2xl bg-amber-50 border border-amber-200 p-3 mb-3">
                  <Ionicons name="information-circle-outline" size={18} color="#D97706" />
                  <Text className="text-amber-700 text-sm flex-1">
                    Attendance already submitted for today
                  </Text>
                  <TouchableOpacity onPress={handleEditAttendance} activeOpacity={0.7}>
                    <Text className="text-primary-600 text-sm font-semibold">Edit</Text>
                  </TouchableOpacity>
                </View>
              )}

              <Text className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">
                Students ({students.length})
              </Text>

              <View className="gap-3">
                {students.map((student, index) => (
                  <StudentCard
                    key={student?.id ?? `student-${index}`}
                    student={student}
                    status={attendanceMap[student?.id] ?? null}
                    onStatusChange={(status) => handleStatusChange(student?.id ?? "", status)}
                    disabled={isAlreadyMarked}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Submit button */}
          {selectedClass && students && students.length > 0 && (
            <View className="pt-6 pb-4">
              <TouchableOpacity
                className={`flex-row items-center justify-center py-3.5 rounded-xl ${
                  isSubmitting ? "bg-primary-400" : "bg-primary-600"
                }`}
                activeOpacity={0.7}
                onPress={handleSubmit}
                disabled={isSubmitting}
                accessibilityRole="button"
                accessibilityLabel={isAlreadyMarked ? "Update attendance" : "Submit attendance"}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="checkmark-outline" size={18} color="#FFFFFF" />
                    <Text className="text-white font-semibold text-sm ml-2">
                      {isAlreadyMarked ? "Update Attendance" : "Submit Attendance"}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
