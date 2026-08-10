import { useMemo, useState, useRef } from "react";
import { cardShadow } from "../theme/shadows";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScreenContainer } from "@/components";
import { HomeworkCard } from "@/components/HomeworkCard";
import { useHomework } from "@/hooks/useHomework";
import { getHomeworkStatusLabel } from "@/utils/homework";
import type { HomeworkItem } from "@/types";


const FILTERS = ["All", "Due Today", "Upcoming", "Overdue"] as const;
type FilterOption = (typeof FILTERS)[number];

function SkeletonCard() {
  return (
    <View className="rounded-2xl bg-white border border-surface-border p-4" style={cardShadow}>
      <View className="flex-row items-start justify-between mb-3">
        <View className="h-4 w-44 bg-slate-200 rounded" />
        <View className="h-5 w-16 bg-slate-100 rounded-md" />
      </View>
      <View className="gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <View key={i} className="flex-row items-center">
            <View className="w-4 h-3 mr-2 bg-slate-100 rounded" />
            <View className="h-3 w-10 bg-slate-100 rounded mr-2" />
            <View className={`h-3 rounded ${i === 0 ? "w-28" : i === 1 ? "w-36" : i === 2 ? "w-24" : "w-20"} bg-slate-200`} />
          </View>
        ))}
      </View>
    </View>
  );
}

export function HomeworkScreen() {
  const { data: homework, isLoading, error, refetch } = useHomework();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterOption>("All");
  const scrollRef = useRef<ScrollView>(null);

  const filteredHomework = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return (homework ?? []).filter((item: HomeworkItem) => {
      if (q && !item.title.toLowerCase().includes(q) && !item.subject.toLowerCase().includes(q)) {
        return false;
      }
      if (activeFilter === "All") return true;
      return getHomeworkStatusLabel(item) === activeFilter;
    });
  }, [homework, searchQuery, activeFilter]);

  const handleCreate = () => {
    router.push("/(tabs)/homework/create");
  };

  const handleHomeworkPress = (item: HomeworkItem) => {
    router.push({ pathname: "/(tabs)/homework/[id]", params: { id: item.id } });
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
        <View className="flex-1 bg-surface-background">
          <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
            <View className="flex-row items-center justify-between">
              <Text className="text-slate-900 text-[18px] font-semibold">Homework</Text>
              <View className="w-9 h-9 bg-slate-100 rounded-full" />
            </View>
          </View>
          <View className="pt-4 px-4 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </View>
        </View>
      </ScreenContainer>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
        <View className="flex-1 bg-surface-background">
          <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
            <Text className="text-slate-900 text-[18px] font-semibold">Homework</Text>
          </View>
          <View className="items-center justify-center pt-20 pb-8 px-6">
            <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="cloud-offline-outline" size={32} color="#DC2626" />
            </View>
            <Text className="text-slate-800 text-lg font-bold text-center mb-2">Connection Error</Text>
            <Text className="text-slate-400 text-sm text-center leading-5 max-w-[260px] mb-6">
              {error?.message ?? "Failed to load homework"}
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
        </View>
      </ScreenContainer>
    );
  }

  // ── Main ──
  return (
    <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
      <View className="flex-1 bg-surface-background">
        {/* Header */}
        <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
          <View className="flex-row items-center justify-between">
            <Text className="text-slate-900 text-[18px] font-semibold">Homework</Text>
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
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Search bar */}
          <View className="pt-4 pb-2">
            <View className="flex-row items-center bg-slate-100 rounded-xl h-10 px-3 gap-2">
              <Ionicons name="search-outline" size={16} color="#94A3B8" />
              <TextInput
                className="flex-1 text-slate-800 text-sm px-0 py-0"
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search by title or subject"
                placeholderTextColor="#94A3B8"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")} activeOpacity={0.7} accessibilityRole="button" accessibilityLabel="Clear search">
                  <Ionicons name="close-circle" size={16} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Filter chips */}
          <View className="flex-row gap-2 pb-3">
            {FILTERS.map((filter) => {
              const isActive = filter === activeFilter;
              return (
                <TouchableOpacity
                  key={filter}
                  className={`px-3.5 py-1.5 rounded-full border ${
                    isActive ? "bg-primary-600 border-primary-600" : "bg-white border-slate-200"
                  }`}
                  activeOpacity={0.7}
                  onPress={() => setActiveFilter(filter)}
                  accessibilityRole="button"
                  accessibilityLabel={`Filter: ${filter}`}
                  accessibilityState={{ selected: isActive }}
                >
                  <Text
                    className={`text-xs font-semibold ${isActive ? "text-white" : "text-slate-500"}`}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Homework cards */}
          {filteredHomework.length > 0 ? (
            <View className="gap-3 pt-1">
              {filteredHomework.map((item) => (
                <HomeworkCard
                  key={item.id}
                  homework={item}
                  onPress={() => handleHomeworkPress(item)}
                />
              ))}
            </View>
          ) : (
            <View className="items-center justify-center pt-12 pb-8">
              <View className="w-16 h-16 bg-primary-50 rounded-full items-center justify-center mb-4">
                <Ionicons name="document-text-outline" size={32} color="#4F46E5" />
              </View>
              <Text className="text-slate-700 text-sm font-semibold text-center">
                {homework && homework.length > 0
                  ? "No homework matches your search"
                  : "No homework assigned yet"}
              </Text>
              <Text className="text-slate-400 text-xs mt-1 text-center leading-5 max-w-[240px]">
                {homework && homework.length > 0
                  ? "Try adjusting your search or filter"
                  : "Create your first homework assignment"}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* FAB */}
        <TouchableOpacity
          className="absolute bottom-6 right-5 w-14 h-14 rounded-full bg-primary-600 items-center justify-center"
          style={{
            shadowColor: "#4F46E5",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }}
          activeOpacity={0.8}
          onPress={handleCreate}
          accessibilityRole="button"
          accessibilityLabel="Create homework"
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
