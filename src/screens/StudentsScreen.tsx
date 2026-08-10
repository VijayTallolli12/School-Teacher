import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScreenContainer } from "@/components";
import { Card } from "@/components/ui/Card";
import { useStudents } from "../hooks/useStudents";
import { useClasses } from "../hooks/useAttendance";
import type { StudentItem, StudentStatus } from "../types";

const STATUS_OPTIONS: { value: StudentStatus | ""; label: string }[] = [
  { value: "", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "transferred", label: "Transferred" },
];

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

function formatStatus(status: string): string {
  if (!status) return "Unknown";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function StudentsScreen() {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<{ classSectionId: string; status: StudentStatus | "" }>({
    classSectionId: "",
    status: "",
  });

  const { data: classes } = useClasses();

  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = {};
    if (search.trim()) params.search = search.trim();
    if (filters.classSectionId) params.class_section_id = filters.classSectionId;
    if (filters.status) params.status = filters.status;
    return params;
  }, [search, filters]);

  const {
    data: students,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useStudents(queryParams);

  const activeFilterCount = useMemo(
    () => [filters.classSectionId, filters.status].filter(Boolean).length,
    [filters]
  );

  const handleStudentPress = useCallback((student: StudentItem) => {
    router.push({
      pathname: "/(tabs)/more/student-detail",
      params: { studentId: student.id },
    });
  }, []);

  const handleClassFilter = useCallback(
    (className: string) => {
      if (classes?.some((c) => c.name === className && c.id === filters.classSectionId)) {
        setFilters((f) => ({ ...f, classSectionId: "" }));
      } else {
        const match = classes?.find((c) => c.name === className);
        setFilters((f) => ({ ...f, classSectionId: match?.id ?? "" }));
      }
    },
    [classes, filters.classSectionId]
  );

  const uniqueClassNames = useMemo(
    () => Array.from(new Set(classes?.map((c) => c.name) ?? [])),
    [classes]
  );

  const isClassActive = useCallback(
    (className: string) =>
      classes?.some((c) => c.name === className && c.id === filters.classSectionId) ?? false,
    [classes, filters.classSectionId]
  );

  return (
    <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
      <View className="flex-1 bg-surface-background">
        {/* Header */}
        <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
          <View className="flex-row items-center justify-between">
            <Text className="text-slate-900 text-[18px] font-semibold">Students</Text>
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

        {/* Search + Filters */}
        <View className="bg-white px-4 pb-3 border-b border-surface-border">
          <View className="flex-row items-center bg-slate-100 rounded-xl px-3 h-10 mt-3">
            <Ionicons name="search-outline" size={18} color="#94A3B8" />
            <TextInput
              className="flex-1 text-slate-800 text-[14px] ml-2"
              value={search}
              onChangeText={setSearch}
              placeholder="Search by name, admission no..."
              placeholderTextColor="#94A3B8"
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Search students"
            />
            {search.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearch("")}
                className="p-1"
                accessibilityLabel="Clear search"
                accessibilityRole="button"
              >
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => setShowFilters(!showFilters)}
              className="ml-2 p-1"
              accessibilityLabel="Toggle filters"
              accessibilityRole="button"
            >
              <Ionicons
                name="options-outline"
                size={20}
                color={showFilters || activeFilterCount > 0 ? "#4F46E5" : "#64748B"}
              />
            </TouchableOpacity>
          </View>

          {/* Filter Panel */}
          {showFilters && (
            <View className="mt-3">
              <Text className="text-slate-500 text-[12px] font-medium mb-2">Status</Text>
              <View className="flex-row flex-wrap gap-2">
                {STATUS_OPTIONS.map((option) => {
                  const isActive = filters.status === option.value;
                  return (
                    <TouchableOpacity
                      key={option.label}
                      className={`px-3 py-1.5 rounded-full border ${
                        isActive ? "bg-primary-50 border-primary-300" : "bg-slate-50 border-slate-200"
                      }`}
                      onPress={() =>
                        setFilters((f) => ({
                          ...f,
                          status: f.status === option.value ? "" : option.value,
                        }))
                      }
                      accessibilityRole="button"
                      accessibilityLabel={`Filter by ${option.label}`}
                    >
                      <Text
                        className={`text-[13px] ${
                          isActive ? "text-primary-600 font-semibold" : "text-slate-600"
                        }`}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {uniqueClassNames.length > 0 && (
                <>
                  <Text className="text-slate-500 text-[12px] font-medium mb-2 mt-3">Class</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {uniqueClassNames.map((cls) => {
                      const active = isClassActive(cls);
                      return (
                        <TouchableOpacity
                          key={cls}
                          className={`px-3 py-1.5 rounded-full border ${
                            active ? "bg-primary-50 border-primary-300" : "bg-slate-50 border-slate-200"
                          }`}
                          onPress={() => handleClassFilter(cls)}
                          accessibilityRole="button"
                          accessibilityLabel={`Filter by class ${cls}`}
                        >
                          <Text
                            className={`text-[13px] ${
                              active ? "text-primary-600 font-semibold" : "text-slate-600"
                            }`}
                          >
                            {cls}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </>
              )}
            </View>
          )}

          {/* Active filter indicator */}
          {activeFilterCount > 0 && !showFilters && (
            <View className="flex-row items-center justify-between mt-2">
              <View className="flex-row items-center">
                <Ionicons name="funnel-outline" size={12} color="#4F46E5" />
                <Text className="text-primary-600 text-[12px] font-medium ml-1">
                  {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setFilters({ classSectionId: "", status: "" })}
                accessibilityRole="button"
                accessibilityLabel="Clear all filters"
              >
                <Text className="text-slate-400 text-[12px] underline">Clear all</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Content */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#4F46E5" colors={["#4F46E5"]} />
          }
        >
          {isLoading ? (
            <View className="items-center justify-center pt-24 pb-8">
              <ActivityIndicator size="large" color="#4F46E5" />
              <Text className="text-slate-400 text-sm mt-3">Loading students...</Text>
            </View>
          ) : isError ? (
            <View className="items-center justify-center pt-20 pb-8">
              <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
                <Ionicons name="cloud-offline-outline" size={32} color="#DC2626" />
              </View>
              <Text className="text-slate-800 text-lg font-bold text-center mb-2">Something went wrong</Text>
              <Text className="text-slate-400 text-sm text-center leading-5 max-w-[260px] mb-6">
                Could not load students. Pull down to retry.
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
          ) : students && students.length > 0 ? (
            students.map((student) => (
              <Card
                key={student.id}
                padding="md"
                className="mb-3"
                onPress={() => handleStudentPress(student)}
              >
                <View className="flex-row items-center">
                  {student.photo ? (
                    <Image source={{ uri: student.photo }} className="w-12 h-12 rounded-full" />
                  ) : (
                    <View className="w-12 h-12 rounded-full bg-primary-50 items-center justify-center">
                      <Text className="text-primary-600 text-[16px] font-bold">
                        {getInitials(student?.name ?? "")}
                      </Text>
                    </View>
                  )}
                  <View className="flex-1 ml-3">
                    <Text className="text-slate-900 text-[15px] font-semibold" numberOfLines={1}>
                      {student?.name ?? "Unknown Student"}
                    </Text>
                    <Text className="text-slate-500 text-[13px] mt-0.5">
                      {student?.admissionNo ?? "—"} · {student?.className ?? ""}
                      {student?.section ? ` - ${student.section}` : ""}
                    </Text>
                  </View>
                  <View
                    className={`px-2.5 py-1 rounded-full ${
                      student.status === "active"
                        ? "bg-emerald-100"
                        : student.status === "inactive"
                        ? "bg-amber-100"
                        : student.status === "transferred"
                        ? "bg-blue-100"
                        : "bg-slate-100"
                    }`}
                  >
                    <Text
                      className={`text-[11px] font-semibold ${
                        student.status === "active"
                          ? "text-emerald-700"
                          : student.status === "inactive"
                          ? "text-amber-700"
                          : student.status === "transferred"
                          ? "text-blue-700"
                          : "text-slate-600"
                      }`}
                    >
                      {formatStatus(student?.status ?? "")}
                    </Text>
                  </View>
                </View>
              </Card>
            ))
          ) : (
            <View className="items-center justify-center pt-20 pb-8 flex-1">
              <View className="w-16 h-16 bg-slate-50 rounded-full items-center justify-center mb-4">
                <Ionicons name="people-outline" size={32} color="#CBD5E1" />
              </View>
              <Text className="text-slate-700 text-lg font-bold text-center mb-2">No students found</Text>
              <Text className="text-slate-400 text-sm text-center leading-5 max-w-[260px]">
                {search
                  ? "Try adjusting your search or filters"
                  : "No students are assigned to you"}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
