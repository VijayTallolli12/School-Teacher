import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cardShadow } from "../theme/shadows";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components";
import { Card } from "@/components/ui/Card";
import { useMarks, useSaveMarks, useExamDetail } from "@/hooks/useExams";
import type { MarksEntry } from "@/types";


const STATUS_CONFIG = {
  not_entered: { label: "Not Entered", color: "#94A3B8", tint: "#F1F5F9" },
  saved: { label: "Saved", color: "#059669", tint: "#ECFDF5" },
  submitted: { label: "Submitted", color: "#4F46E5", tint: "#EEF2FF" },
};

function getStatus(entry: MarksEntry): "not_entered" | "saved" | "submitted" {
  if (entry?.marks === null || entry?.marks === undefined) return "not_entered";
  if (entry?.isDraft) return "saved";
  return "submitted";
}

export function MarksEntryScreen() {
  const { examId } = useLocalSearchParams<{ examId: string }>();
  const { data: exam } = useExamDetail(examId ?? "");
  const { data: marksData, isLoading, error, refetch, isRefetching } = useMarks(
    examId ?? "",
    exam?.classSectionId ?? "",
    exam?.subjectId ?? ""
  );
  const saveMarksMutation = useSaveMarks();
  const [marksMap, setMarksMap] = useState<Record<string, number | null>>({});
  const [refreshing, setRefreshing] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (marksData) {
      const map: Record<string, number | null> = {};
      marksData.forEach((entry) => {
        map[entry.studentId] = entry?.marks ?? null;
      });
      setMarksMap(map);
    }
  }, [marksData]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try { await refetch(); } finally { setRefreshing(false); }
  }, [refetch]);

  const handleChangeMarks = useCallback((studentId: string, value: string) => {
    const parsed = value === "" ? null : Number(value);
    setMarksMap((prev) => ({ ...prev, [studentId]: isNaN(parsed as number) ? null : parsed }));
  }, []);

  const enteredCount = useMemo(
    () => Object.values(marksMap).filter((v) => v !== null && v !== undefined).length,
    [marksMap]
  );

  const handleSave = useCallback(
    (saveAsDraft: boolean) => {
      const marksPayload = Object.entries(marksMap)
        .filter(([_, marks]) => marks !== null && marks !== undefined)
        .map(([studentId, marks]) => ({
          studentId,
          marks: marks as number,
        }));

      if (marksPayload.length === 0) {
        Alert.alert("No Marks", "Please enter marks for at least one student.");
        return;
      }

      saveMarksMutation.mutate(
        {
          examId: examId ?? "",
          classId: exam?.classSectionId ?? "",
          subjectId: exam?.subjectId ?? "",
          marks: marksPayload,
          isDraft: saveAsDraft,
        },
        {
          onSuccess: (response) => {
            Alert.alert("Success", response?.message ?? "Marks saved successfully", [
              {
                text: "OK",
                onPress: () => {
                  if (!saveAsDraft) router.back();
                  refetch();
                },
              },
            ]);
          },
          onError: (err) => {
            Alert.alert("Error", err?.message ?? "Failed to save marks");
          },
        }
      );
    },
    [marksMap, examId, exam, saveMarksMutation, refetch]
  );

  if (error) {
    return (
      <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
        <View className="flex-1 bg-surface-background">
          <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
            <View className="flex-row items-center">
              <TouchableOpacity className="mr-3" activeOpacity={0.7} onPress={() => router.back()}>
                <Ionicons name="close" size={24} color="#334155" />
              </TouchableOpacity>
              <Text className="text-slate-900 text-[18px] font-semibold">Marks Entry</Text>
            </View>
          </View>
          <View className="items-center justify-center flex-1 px-4">
            <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="cloud-offline-outline" size={32} color="#DC2626" />
            </View>
            <Text className="text-slate-800 text-lg font-bold text-center mb-2">Unable to Load</Text>
            <Text className="text-slate-400 text-sm text-center leading-5 max-w-[260px] mb-6">
              {error?.message ?? "Failed to load student marks data"}
            </Text>
            <TouchableOpacity
              className="flex-row items-center bg-primary-600 px-6 py-3 rounded-xl"
              activeOpacity={0.7}
              onPress={() => refetch()}
            >
              <Ionicons name="refresh-outline" size={18} color="#FFFFFF" />
              <Text className="text-white font-semibold text-sm ml-2">Retry</Text>
            </TouchableOpacity>
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
            <View className="flex-row items-center flex-1 min-w-0">
              <TouchableOpacity className="mr-3" activeOpacity={0.7} onPress={() => router.back()}>
                <Ionicons name="close" size={24} color="#334155" />
              </TouchableOpacity>
              <Text className="text-slate-900 text-[18px] font-semibold" numberOfLines={1}>Marks Entry</Text>
            </View>
            {exam && (
              <View className="items-end">
                <Text className="text-slate-900 text-sm font-bold">{exam?.totalMarks ?? 0}</Text>
                <Text className="text-slate-400 text-[10px]">max</Text>
              </View>
            )}
          </View>
        </View>

        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {isLoading ? (
            <View className="items-center justify-center flex-1">
              <ActivityIndicator size="large" color="#4F46E5" />
              <Text className="text-slate-400 text-sm mt-3">Loading students...</Text>
            </View>
          ) : !marksData || marksData.length === 0 ? (
            <View className="items-center justify-center flex-1 px-4">
              <View className="w-16 h-16 bg-slate-50 rounded-full items-center justify-center mb-4">
                <Ionicons name="people-outline" size={32} color="#CBD5E1" />
              </View>
              <Text className="text-slate-800 text-lg font-bold text-center mb-2">No Students</Text>
              <Text className="text-slate-400 text-sm text-center leading-5 max-w-[260px]">
                No students found for this exam class and subject.
              </Text>
            </View>
          ) : (
            <>
              <View className="flex-row items-center px-4 py-2.5 bg-white border-b border-surface-border gap-2">
                <Ionicons name="people-outline" size={16} color="#64748B" />
                <Text className="text-slate-500 text-xs font-medium">{marksData.length} students</Text>
                <View className="w-px h-3 bg-slate-200 mx-1" />
                <Ionicons name="checkmark-done-outline" size={16} color="#64748B" />
                <Text className="text-slate-500 text-xs font-medium">{enteredCount} entered</Text>
              </View>

              <ScrollView
                ref={scrollRef}
                className="flex-1"
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#4F46E5" colors={["#4F46E5"]} />
                }
              >
                {marksData.map((entry, index) => {
                  const marks = marksMap[entry.studentId] ?? null;
                  const status = getStatus(entry);
                  const statusCfg = STATUS_CONFIG[status];
                  return (
                    <Card key={entry?.studentId ?? `student-${index}`} className="mb-3">
                      <View className="flex-row items-center">
                        <View className="flex-1 min-w-0 mr-3">
                          <Text className="text-slate-900 text-[15px] font-semibold" numberOfLines={1}>
                            {entry?.studentName ?? "Unknown Student"}
                          </Text>
                          <Text className="text-slate-400 text-xs mt-0.5">
                            Roll No: {entry?.rollNumber ?? "—"}
                          </Text>
                        </View>
                        <View className="items-end">
                          <TextInput
                            className="w-20 h-10 bg-slate-50 rounded-xl text-center text-slate-900 text-sm font-semibold border border-surface-border"
                            keyboardType="number-pad"
                            placeholder="—"
                            placeholderTextColor="#CBD5E1"
                            value={marks !== null ? String(marks) : ""}
                            onChangeText={(v) => handleChangeMarks(entry.studentId, v)}
                          />
                          <Text className="text-slate-400 text-[10px] mt-1 text-center">
                            / {entry?.maxMarks ?? 0}
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row items-center mt-2 pt-2 border-t border-surface-border">
                        <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: statusCfg.tint }}>
                          <Text className="text-[11px] font-medium" style={{ color: statusCfg.color }}>
                            {statusCfg.label}
                          </Text>
                        </View>
                      </View>
                    </Card>
                  );
                })}
              </ScrollView>

              <View className="flex-row gap-3 px-4 py-3 bg-white border-t border-surface-border">
                <TouchableOpacity
                  className="flex-1 items-center justify-center bg-white border border-surface-border px-4 py-3 rounded-2xl"
                  activeOpacity={0.7}
                  onPress={() => handleSave(true)}
                  disabled={saveMarksMutation.isPending}
                  style={cardShadow}
                >
                  <Text className="text-slate-700 font-semibold text-sm">
                    {saveMarksMutation.isPending ? "Saving..." : "Save Draft"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 items-center justify-center bg-primary-600 px-4 py-3 rounded-2xl"
                  activeOpacity={0.7}
                  onPress={() => handleSave(false)}
                  disabled={saveMarksMutation.isPending}
                >
                  <View className="flex-row items-center">
                    <Ionicons name="checkmark-done" size={18} color="#FFFFFF" />
                    <Text className="text-white font-semibold text-sm ml-1.5">
                      {saveMarksMutation.isPending ? "Submitting..." : "Submit"}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          )}
        </KeyboardAvoidingView>
      </View>
    </ScreenContainer>
  );
}
