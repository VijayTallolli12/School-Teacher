import { useCallback } from "react";
import {
  Alert,
  Linking,
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
import { cardShadow } from "@/theme/shadows";
import { useCirculars } from "@/hooks/useCirculars";
import type { CircularItem } from "@/types";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function SkeletonCard() {
  return (
    <View className="rounded-2xl bg-white border border-surface-border p-4 mb-3" style={cardShadow}>
      <View className="flex-row items-center">
        <View className="w-10 h-10 rounded-xl bg-slate-200 mr-3" />
        <View className="flex-1 gap-1.5">
          <View className="h-3.5 w-36 bg-slate-200 rounded" />
          <View className="h-3 w-48 bg-slate-100 rounded" />
        </View>
        <View className="w-4 h-4 bg-slate-100 rounded" />
      </View>
    </View>
  );
}

export function CircularsScreen() {
  const { data: circulars, isLoading, isError, refetch, isRefetching } = useCirculars();

  const handleOpen = useCallback((item: CircularItem) => {
    if (item?.attachmentUrl) {
      Linking.openURL(item.attachmentUrl).catch(() => {
        Alert.alert("Error", "Could not open the attachment.");
      });
      return;
    }
    router.push({
      pathname: "/(tabs)/notifications/[id]",
      params: {
        id: item?.id ?? "",
        title: item?.title ?? "Circular",
        body: item?.message ?? "",
        type: "system",
        is_read: "true",
        created_at: item?.date ?? "",
      },
    });
  }, []);

  if (isLoading) {
    return (
      <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
        <View className="flex-1 bg-surface-background">
          <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
            <View className="flex-row items-center">
              <Text className="text-slate-900 text-[18px] font-semibold">Circulars</Text>
            </View>
          </View>
          <View className="pt-4 px-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
      <View className="flex-1 bg-surface-background">
        <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
          <View className="flex-row items-center">
            <TouchableOpacity
              className="w-8 h-8 rounded-full items-center justify-center mr-2"
              activeOpacity={0.7}
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="close" size={22} color="#334155" />
            </TouchableOpacity>
            <Text className="text-slate-900 text-[18px] font-semibold">Circulars</Text>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#4F46E5" colors={["#4F46E5"]} />
          }
        >
          {isError ? (
            <View className="items-center justify-center pt-20 pb-8">
              <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
                <Ionicons name="cloud-offline-outline" size={32} color="#DC2626" />
              </View>
              <Text className="text-slate-800 text-lg font-bold text-center mb-2">Unable to Load Circulars</Text>
              <Text className="text-slate-400 text-sm text-center leading-5 max-w-[260px] mb-6">
                Pull down to retry or tap the button below.
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
          ) : !circulars || circulars.length === 0 ? (
            <View className="items-center justify-center pt-20 pb-8">
              <View className="w-16 h-16 bg-slate-100 rounded-full items-center justify-center mb-4">
                <Ionicons name="megaphone-outline" size={32} color="#CBD5E1" />
              </View>
              <Text className="text-slate-700 text-sm font-semibold text-center">No circulars found</Text>
              <Text className="text-slate-400 text-xs mt-1 text-center leading-5 max-w-[240px]">
                School circulars and announcements will appear here.
              </Text>
            </View>
          ) : (
            <View className="pt-4 gap-3">
              {circulars.map((item, index) => (
                <TouchableOpacity
                  key={item?.id ?? `circular-${index}`}
                  activeOpacity={0.72}
                  onPress={() => handleOpen(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`Open ${item?.title ?? "circular"}`}
                >
                  <Card padding="md" style={cardShadow}>
                    <View className="flex-row items-center">
                      <View className="w-10 h-10 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: "#FFFBEB" }}>
                        <Ionicons name="megaphone-outline" size={18} color="#B45309" />
                      </View>
                      <View className="flex-1 min-w-0">
                        <Text className="text-slate-800 text-sm font-bold" numberOfLines={1}>
                          {item?.title ?? "Circular"}
                        </Text>
                        <Text className="text-slate-400 text-xs mt-0.5" numberOfLines={2}>
                          {item?.message ?? ""}
                        </Text>
                        {item?.date ? (
                          <Text className="text-slate-300 text-[11px] mt-1">{formatDate(item.date)}</Text>
                        ) : null}
                      </View>
                      <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
