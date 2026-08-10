import { useMemo, useState } from "react";
import { cardShadow } from "../theme/shadows";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScreenContainer } from "@/components";
import { NotificationCard } from "@/components/NotificationCard";
import { NotificationFilter } from "@/components/NotificationFilter";
import { useMarkAllAsRead, useNotifications } from "@/hooks/useNotifications";
import type { NotificationFilterValue, NotificationItem } from "@/types";


function SkeletonCard() {
  return (
    <View className="rounded-2xl bg-white border border-surface-border p-4" style={cardShadow}>
      <View className="flex-row items-start">
        <View className="w-10 h-10 rounded-xl bg-slate-100 mr-3" />
        <View className="flex-1 gap-1.5">
          <View className="h-3 w-32 bg-slate-200 rounded" />
          <View className="h-3.5 w-48 bg-slate-200 rounded" />
          <View className="h-3 w-40 bg-slate-100 rounded" />
        </View>
      </View>
    </View>
  );
}

export function NotificationsScreen() {
  const [filter, setFilter] = useState<NotificationFilterValue>("all");
  const { data = [], isLoading, isRefetching, error, refetch } = useNotifications();
  const markAllAsRead = useMarkAllAsRead();

  const filteredAlerts = useMemo(() => {
    return data
      .filter((n) => {
        if (filter === "unread") return !n.isRead;
        if (filter === "read") return n.isRead;
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [data, filter]);

  const hasUnread = data.some((n) => !n.isRead);

  const handleOpenAlert = (item: NotificationItem) => {
    router.push({
      pathname: "/(tabs)/notifications/[id]",
      params: {
        id: item?.id ?? "",
        title: item?.title ?? "Notification",
        body: item?.message ?? "",
        type: item?.type ?? "system",
        is_read: String(!!item?.isRead),
        created_at: item?.createdAt ?? "",
        priority: String(item?.data?.priority ?? ""),
      },
    });
  };

  const handleCreate = () => {
    router.push("/(tabs)/notifications/create");
  };

  const handleMarkAllRead = () => {
    markAllAsRead.mutate(undefined, {
      onError: () => {
        Alert.alert("Unable to mark all as read", "Check your connection and try again.");
      },
    });
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
        <View className="flex-1 bg-surface-background">
          <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
            <View className="flex-row items-center justify-between">
              <Text className="text-slate-900 text-[18px] font-semibold">Alerts</Text>
              <View className="w-9 h-9 bg-slate-100 rounded-full" />
            </View>
          </View>
          <View className="pt-4 px-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </View>
        </View>
      </ScreenContainer>
    );
  }

  // ── Error ──
  if (error && data.length === 0) {
    return (
      <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
        <View className="flex-1 bg-surface-background">
          <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
            <Text className="text-slate-900 text-[18px] font-semibold">Alerts</Text>
          </View>
          <View className="items-center justify-center pt-20 pb-8 px-6">
            <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="cloud-offline-outline" size={32} color="#DC2626" />
            </View>
            <Text className="text-slate-800 text-lg font-bold text-center mb-2">Connection Error</Text>
            <Text className="text-slate-400 text-sm text-center leading-5 max-w-[260px] mb-6">
              {error?.message ?? "Failed to load alerts"}
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
            <Text className="text-slate-900 text-[18px] font-semibold">Alerts</Text>
            <View className="flex-row items-center gap-2">
              {hasUnread && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleMarkAllRead}
                  accessibilityRole="button"
                  accessibilityLabel="Mark all as read"
                >
                  <Text className="text-primary-600 text-xs font-semibold">
                    {markAllAsRead.isPending ? "..." : "Read all"}
                  </Text>
                </TouchableOpacity>
              )}
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
        </View>

        {/* Filter */}
        <View className="px-4 pt-3 pb-1">
          <NotificationFilter value={filter} onChange={setFilter} />
        </View>

        {/* List */}
        <FlatList
          data={filteredAlerts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 100,
            flexGrow: filteredAlerts.length === 0 ? 1 : undefined,
          }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            <NotificationCard notification={item} onPress={() => handleOpenAlert(item)} />
          )}
          ListEmptyComponent={
            <View className="items-center justify-center pt-12">
              <View className="w-16 h-16 bg-primary-50 rounded-full items-center justify-center mb-4">
                <Ionicons name="notifications-outline" size={32} color="#4F46E5" />
              </View>
              <Text className="text-slate-700 text-sm font-semibold text-center">No alerts</Text>
              <Text className="text-slate-400 text-xs mt-1 text-center leading-5 max-w-[240px]">
                {data.length > 0
                  ? `No ${filter === "unread" ? "unread" : filter === "read" ? "read" : ""} alerts to show`
                  : "New school updates will appear here."}
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#4F46E5"
              colors={["#4F46E5"]}
            />
          }
          showsVerticalScrollIndicator={false}
        />

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
          accessibilityLabel="Create alert"
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
