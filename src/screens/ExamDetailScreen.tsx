import { useCallback, useState } from "react";
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
import { useExamDetail, usePublishResults } from "@/hooks/useExams";


const STATUS_CONFIG = {
  upcoming: { label: "Upcoming", color: "#4F46E5", tint: "#EEF2FF" },
  ongoing: { label: "Ongoing", color: "#059669", tint: "#ECFDF5" },
  completed: { label: "Completed", color: "#64748B", tint: "#F1F5F9" },
};

function DetailRow({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View className="flex-row items-center py-2.5">
      <View className="w-8 h-8 rounded-lg bg-slate-50 items-center justify-center mr-3">
        <Ionicons name={icon} size={16} color="#64748B" />
      </View>
      <View className="flex-1 min-w-0">
        <Text className="text-slate-400 text-[11px] font-medium">{label}</Text>
        <Text className="text-slate-800 text-sm font-medium mt-0.5" numberOfLines={1}>{value}</Text>
      </View>
    </View>
  );
}

export function ExamDetailScreen() {
  const { examId } = useLocalSearchParams<{ examId: string }>();
  const { data: exam, isLoading, error, refetch } = useExamDetail(examId ?? "");
  const publishMutation = usePublishResults();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try { await refetch(); } finally { setRefreshing(false); }
  }, [refetch]);

  const handleEnterMarks = useCallback(() => {
    router.push({ pathname: "/(tabs)/more/marks-entry", params: { examId } });
  }, [examId]);

  const handleViewSchedule = useCallback(() => {
    router.push({ pathname: "/(tabs)/more/exam-schedule", params: { examId } });
  }, [examId]);

  const handlePublishResults = useCallback(() => {
    Alert.alert(
      "Publish Results",
      "Are you sure you want to publish the results for this exam? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Publish",
          style: "destructive",
          onPress: () => {
            publishMutation.mutate(examId ?? "", {
              onSuccess: (response) => {
                Alert.alert("Success", response?.message ?? "Results published successfully");
                refetch();
              },
              onError: (err) => {
                Alert.alert("Error", err?.message ?? "Failed to publish results");
              },
            });
          },
        },
      ]
    );
  }, [examId, publishMutation, refetch]);

  const statusConfig = STATUS_CONFIG[exam?.status ?? "upcoming"];

  if (error) {
    return (
      <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
        <View className="flex-1 bg-surface-background">
          <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
            <View className="flex-row items-center">
              <TouchableOpacity className="mr-3" activeOpacity={0.7} onPress={() => router.back()}>
                <Ionicons name="close" size={24} color="#334155" />
              </TouchableOpacity>
              <Text className="text-slate-900 text-[18px] font-semibold">Exam Details</Text>
            </View>
          </View>
          <View className="items-center justify-center flex-1 px-4">
            <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="cloud-offline-outline" size={32} color="#DC2626" />
            </View>
            <Text className="text-slate-800 text-lg font-bold text-center mb-2">Unable to Load Exam</Text>
            <Text className="text-slate-400 text-sm text-center leading-5 max-w-[260px] mb-6">
              {error?.message ?? "Please check your connection and try again"}
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

  if (isLoading || !exam) {
    return (
      <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
        <View className="flex-1 bg-surface-background">
          <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
            <View className="flex-row items-center">
              <TouchableOpacity className="mr-3" activeOpacity={0.7} onPress={() => router.back()}>
                <Ionicons name="close" size={24} color="#334155" />
              </TouchableOpacity>
              <Text className="text-slate-900 text-[18px] font-semibold">Exam Details</Text>
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
            <View className="flex-row items-center flex-1 min-w-0">
              <TouchableOpacity className="mr-3" activeOpacity={0.7} onPress={() => router.back()}>
                <Ionicons name="close" size={24} color="#334155" />
              </TouchableOpacity>
              <Text className="text-slate-900 text-[18px] font-semibold" numberOfLines={1}>Exam Details</Text>
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#4F46E5" colors={["#4F46E5"]} />
          }
        >
          <Card>
            <View className="flex-row items-start justify-between mb-1">
              <Text className="text-slate-900 text-[17px] font-bold flex-1 mr-3" numberOfLines={2}>
                {exam?.name ?? "Unnamed Exam"}
              </Text>
              <View className="px-2.5 py-1 rounded-full shrink-0" style={{ backgroundColor: statusConfig.tint }}>
                <Text className="text-xs font-semibold" style={{ color: statusConfig.color }}>{statusConfig.label}</Text>
              </View>
            </View>

            <View className="mt-2 border-t border-surface-border pt-1">
              <DetailRow icon="book-outline" label="Subject" value={exam?.subject ?? "Unknown Subject"} />
              <DetailRow icon="school-outline" label="Class" value={`${exam?.className ?? ""} ${exam?.section ?? ""}`} />
              <DetailRow icon="calendar-outline" label="Date" value={exam?.date ?? "--"} />
              {(exam?.duration ?? 0) > 0 && (
                <DetailRow icon="time-outline" label="Duration" value={`${exam?.duration} minutes`} />
              )}
              <DetailRow icon="stats-chart-outline" label="Total Marks" value={`${exam?.totalMarks ?? 0}`} />
            </View>
          </Card>

          <View className="mt-5">
            <Card>
              <Text className="text-slate-900 text-[15px] font-semibold mb-3">Result Status</Text>
              {exam?.resultPublished ? (
                <View className="flex-row items-center">
                  <View className="w-8 h-8 rounded-lg bg-emerald-50 items-center justify-center mr-3">
                    <Ionicons name="checkmark-circle" size={18} color="#059669" />
                  </View>
                  <View>
                    <Text className="text-emerald-700 text-sm font-semibold">Result Published</Text>
                    <Text className="text-slate-400 text-xs mt-0.5">Results have been published</Text>
                  </View>
                </View>
              ) : (
                <View className="flex-row items-center">
                  <View className="w-8 h-8 rounded-lg bg-slate-50 items-center justify-center mr-3">
                    <Ionicons name="time-outline" size={18} color="#94A3B8" />
                  </View>
                  <View>
                    <Text className="text-slate-600 text-sm font-semibold">Not Published</Text>
                    <Text className="text-slate-400 text-xs mt-0.5">Results have not been published yet</Text>
                  </View>
                </View>
              )}
            </Card>
          </View>

          <View className="mt-5 gap-3">
            {exam?.status !== "upcoming" && (
              <TouchableOpacity
                className="flex-row items-center justify-center bg-primary-600 px-6 py-3.5 rounded-2xl"
                activeOpacity={0.7}
                onPress={handleEnterMarks}
              >
                <Ionicons name="create-outline" size={18} color="#FFFFFF" />
                <Text className="text-white font-semibold text-sm ml-2">Enter Marks</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className="flex-row items-center justify-center bg-white border border-surface-border px-6 py-3.5 rounded-2xl"
              activeOpacity={0.7}
              onPress={handleViewSchedule}
              style={cardShadow}
            >
              <Ionicons name="calendar-outline" size={18} color="#4F46E5" />
              <Text className="text-primary-600 font-semibold text-sm ml-2">View Schedule</Text>
            </TouchableOpacity>
            {exam?.status === "completed" && !exam?.resultPublished && (
              <TouchableOpacity
                className="flex-row items-center justify-center bg-white border border-surface-border px-6 py-3.5 rounded-2xl"
                activeOpacity={0.7}
                onPress={handlePublishResults}
                disabled={publishMutation.isPending}
                style={cardShadow}
              >
                <Ionicons name="megaphone-outline" size={18} color="#4F46E5" />
                <Text className="text-primary-600 font-semibold text-sm ml-2">
                  {publishMutation.isPending ? "Publishing..." : "Publish Results"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
