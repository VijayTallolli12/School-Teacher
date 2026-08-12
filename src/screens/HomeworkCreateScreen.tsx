import { useCallback } from "react";
import { cardShadow } from "../theme/shadows";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components";
import { HomeworkForm } from "@/components/HomeworkForm";
import { useCreateHomework, useHomeworkDetail, useUpdateHomework } from "@/hooks/useHomework";
import { useClasses } from "@/hooks/useAttendance";
import type { HomeworkPayload } from "@/types";


export function HomeworkCreateScreen() {
  const { homeworkId, subject, className, section } = useLocalSearchParams<{
    homeworkId?: string;
    subject?: string;
    className?: string;
    section?: string;
  }>();
  const isEdit = Boolean(homeworkId);

  const { mutate: createHomework, isPending: isCreating } = useCreateHomework();
  const { mutate: updateHomework, isPending: isUpdating } = useUpdateHomework();
  const { data: classes, isLoading: classesLoading, error: classesError } = useClasses();
  const { data: existingHomework, isLoading: detailLoading, error: detailError } = useHomeworkDetail(homeworkId ?? "");

  const prefillData: HomeworkPayload | undefined =
    isEdit || !subject
      ? undefined
      : {
          title: "",
          description: "",
          subject: subject ?? "",
          class: className ?? "",
          section: section ?? "",
          dueDate: "",
        };

  const handleBack = useCallback(() => router.back(), []);

  const handleSubmit = useCallback(
    (data: HomeworkPayload) => {
      const onSuccess = () => {
        Alert.alert("Success", `Homework ${isEdit ? "updated" : "created"} successfully`, [
          { text: "OK", onPress: () => router.back() },
        ]);
      };
      const onError = (err: Error) => {
        Alert.alert("Error", err?.message ?? `Failed to ${isEdit ? "update" : "create"} homework`);
      };

      if (isEdit && homeworkId) {
        updateHomework({ id: homeworkId, payload: data }, { onSuccess, onError });
      } else {
        createHomework(data, { onSuccess, onError });
      }
    },
    [isEdit, homeworkId, createHomework, updateHomework]
  );

  // ── Loading ──
  if (classesLoading || (isEdit && detailLoading)) {
    return (
      <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
        <View className="flex-1 bg-surface-background">
          <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
            <View className="flex-row items-center">
              <TouchableOpacity className="w-9 h-9 items-center justify-center -ml-1 mr-2" onPress={handleBack} accessibilityRole="button" accessibilityLabel="Go back">
                <Ionicons name="chevron-back" size={22} color="#4F46E5" />
              </TouchableOpacity>
              <Text className="text-slate-900 text-[18px] font-semibold">
                {isEdit ? "Edit Homework" : "Create Homework"}
              </Text>
            </View>
          </View>
          <View className="items-center justify-center pt-24 pb-8">
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text className="text-slate-400 text-sm mt-3">Loading...</Text>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  // ── Error ──
  if (classesError || detailError) {
    return (
      <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
        <View className="flex-1 bg-surface-background">
          <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
            <View className="flex-row items-center">
              <TouchableOpacity className="w-9 h-9 items-center justify-center -ml-1 mr-2" onPress={handleBack} accessibilityRole="button" accessibilityLabel="Go back">
                <Ionicons name="chevron-back" size={22} color="#4F46E5" />
              </TouchableOpacity>
              <Text className="text-slate-900 text-[18px] font-semibold">Error</Text>
            </View>
          </View>
          <View className="items-center justify-center pt-20 pb-8 px-6">
            <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="alert-circle-outline" size={32} color="#DC2626" />
            </View>
            <Text className="text-slate-800 text-lg font-bold text-center mb-2">Unable to Load Data</Text>
            <Text className="text-slate-400 text-sm text-center leading-5 max-w-[260px]">
              {classesError?.message || detailError?.message || "Could not load required data"}
            </Text>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  // ── Form ──
  return (
    <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
      <View className="flex-1 bg-surface-background">
        {/* Header */}
        <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
          <View className="flex-row items-center">
            <TouchableOpacity
              className="w-9 h-9 items-center justify-center -ml-1 mr-2"
              onPress={handleBack}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={22} color="#4F46E5" />
            </TouchableOpacity>
            <Text className="text-slate-900 text-[18px] font-semibold">
              {isEdit ? "Edit Homework" : "Create Homework"}
            </Text>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <HomeworkForm
            initialData={isEdit ? existingHomework : prefillData}
            classes={classes ?? []}
            onSubmit={handleSubmit}
            isSubmitting={isCreating || isUpdating}
          />
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
