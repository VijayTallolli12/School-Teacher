import { useCallback, useMemo } from "react";
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
import { useExams } from "@/hooks/useExams";
import type { ExamItem } from "@/types";


function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
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
    </View>
  );
}

function StatusBadge({ status, resultPublished }: { status: ExamItem["status"]; resultPublished: boolean }) {
  if (resultPublished) {
    return (
      <View className="bg-green-50 px-2 py-0.5 rounded-full">
        <Text className="text-green-700 text-[11px] font-semibold">Published</Text>
      </View>
    );
  }
  if (status === "completed") {
    return (
      <View className="bg-blue-50 px-2 py-0.5 rounded-full">
        <Text className="text-blue-700 text-[11px] font-semibold">Completed</Text>
      </View>
    );
  }
  return (
    <View className="bg-amber-50 px-2 py-0.5 rounded-full">
      <Text className="text-amber-700 text-[11px] font-semibold">Pending</Text>
    </View>
  );
}

export function ResultsScreen() {
  const { data: exams, isLoading, isError, refetch, isRefetching } = useExams();

  const resultExams = useMemo(
    () => (exams ?? []).filter((exam) => exam?.status === "completed" || exam?.resultPublished),
    [exams]
  );

  const summary = useMemo(() => {
    const completed = resultExams.length;
    const published = resultExams.filter((exam) => exam?.resultPublished).length;
    const pending = completed - published;
    return { completed, published, pending };
  }, [resultExams]);

  const handleExamPress = useCallback((exam: ExamItem) => {
    router.push({ pathname: "/(tabs)/more/exam-detail", params: { examId: exam?.id ?? "" } });
  }, []);

  const handleRefresh = useCallback(async () => {
    try {
      await refetch();
    } catch {
      // silently ignore
    }
  }, [refetch]);

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
              <Text className="text-slate-900 text-[18px] font-semibold flex-1" numberOfLines={1}>Results</Text>
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} tintColor="#4F46E5" colors={["#4F46E5"]} />
          }
        >
          {isLoading ? (
            <View className="items-center justify-center pt-24 pb-8">
              <ActivityIndicator size="large" color="#4F46E5" />
              <Text className="text-slate-400 text-sm mt-3">Loading results...</Text>
            </View>
          ) : isError ? (
            <View className="items-center justify-center pt-20 pb-8">
              <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
                <Ionicons name="cloud-offline-outline" size={32} color="#DC2626" />
              </View>
              <Text className="text-slate-800 text-lg font-bold text-center mb-2">Connection Error</Text>
              <Text className="text-slate-400 text-sm text-center leading-5 max-w-[260px] mb-6">
                Failed to load results. Pull down to retry or tap the button below.
              </Text>
              <TouchableOpacity
                className="flex-row items-center bg-primary-600 px-6 py-3 rounded-xl"
                activeOpacity={0.7}
                onPress={handleRefresh}
                accessibilityRole="button"
                accessibilityLabel="Retry results"
              >
                <Ionicons name="refresh-outline" size={18} color="#FFFFFF" />
                <Text className="text-white font-semibold text-sm ml-2">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : resultExams.length === 0 ? (
            <View className="items-center justify-center pt-20 pb-8">
              <View className="w-16 h-16 bg-slate-50 rounded-full items-center justify-center mb-4">
                <Ionicons name="trophy-outline" size={32} color="#CBD5E1" />
              </View>
              <Text className="text-slate-700 text-lg font-bold text-center mb-2">No results found</Text>
              <Text className="text-slate-400 text-sm text-center leading-5 max-w-[260px]">
                Completed exams and published results will appear here.
              </Text>
            </View>
          ) : (
            <>
              <View className="pt-4">
                <SectionHeader title="Summary" subtitle="Overview of exam results" />
                <View className="flex-row gap-3">
                  <Card padding="md" className="flex-1" style={cardShadow}>
                    <View className="items-center gap-1.5">
                      <View className="w-10 h-10 rounded-xl items-center justify-center bg-pink-50">
                        <Ionicons name="trophy-outline" size={18} color="#BE185D" />
                      </View>
                      <Text className="text-slate-900 text-[22px] font-bold">{summary.completed}</Text>
                      <Text className="text-slate-500 text-[11px] font-medium" numberOfLines={1}>Completed</Text>
                    </View>
                  </Card>
                  <Card padding="md" className="flex-1" style={cardShadow}>
                    <View className="items-center gap-1.5">
                      <View className="w-10 h-10 rounded-xl items-center justify-center bg-green-50">
                        <Ionicons name="checkmark-circle-outline" size={18} color="#16A34A" />
                      </View>
                      <Text className="text-slate-900 text-[22px] font-bold">{summary.published}</Text>
                      <Text className="text-slate-500 text-[11px] font-medium" numberOfLines={1}>Published</Text>
                    </View>
                  </Card>
                  <Card padding="md" className="flex-1" style={cardShadow}>
                    <View className="items-center gap-1.5">
                      <View className="w-10 h-10 rounded-xl items-center justify-center bg-amber-50">
                        <Ionicons name="create-outline" size={18} color="#D97706" />
                      </View>
                      <Text className="text-slate-900 text-[22px] font-bold">{summary.pending}</Text>
                      <Text className="text-slate-500 text-[11px] font-medium" numberOfLines={1}>Pending</Text>
                    </View>
                  </Card>
                </View>
              </View>

              <View className="pt-6">
                <SectionHeader title="Exam Results" subtitle={`${resultExams.length} exam${resultExams.length === 1 ? "" : "s"}`} />
                <View className="gap-3">
                  {resultExams.map((exam, index) => (
                    <Card
                      key={exam?.id ?? `exam-${index}`}
                      padding="md"
                      onPress={() => handleExamPress(exam)}
                      style={cardShadow}
                    >
                      <View className="flex-row items-start justify-between mb-2">
                        <Text className="text-slate-900 text-[15px] font-semibold flex-1 mr-2" numberOfLines={1}>
                          {exam?.name ?? "Unnamed Exam"}
                        </Text>
                        <StatusBadge status={exam?.status ?? "completed"} resultPublished={exam?.resultPublished ?? false} />
                      </View>
                      <View className="flex-row items-center mb-1.5">
                        <Ionicons name="book-outline" size={14} color="#64748B" />
                        <Text className="text-slate-600 text-[13px] ml-1.5 flex-1" numberOfLines={1}>
                          {exam?.subject ?? "No Subject"}
                        </Text>
                      </View>
                      <View className="flex-row items-center mb-1.5">
                        <Ionicons name="people-outline" size={14} color="#64748B" />
                        <Text className="text-slate-600 text-[13px] ml-1.5 flex-1" numberOfLines={1}>
                          {[exam?.className, exam?.section].filter(Boolean).join(" - ") || "N/A"}
                        </Text>
                      </View>
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <Ionicons name="calendar-outline" size={14} color="#64748B" />
                          <Text className="text-slate-500 text-[12px] ml-1.5">
                            {exam?.date ?? "No date"}
                          </Text>
                        </View>
                        <View className="flex-row items-center">
                          <Ionicons name="stats-chart-outline" size={14} color="#64748B" />
                          <Text className="text-slate-500 text-[12px] ml-1.5">
                            {exam?.totalMarks ?? 0} marks
                          </Text>
                        </View>
                      </View>
                      {exam?.resultPublished ? (
                        <View className="mt-2 bg-green-50 -mx-4 -mb-4 px-4 py-2 rounded-b-2xl">
                          <View className="flex-row items-center">
                            <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
                            <Text className="text-green-700 text-[12px] font-semibold ml-1.5">Result Published</Text>
                          </View>
                        </View>
                      ) : null}
                    </Card>
                  ))}
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
