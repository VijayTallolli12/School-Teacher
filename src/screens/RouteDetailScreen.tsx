import { useCallback, useState } from "react";
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
import { router, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components";
import { Card } from "@/components/ui/Card";
import { useNavParamStore } from "@/store/navParams.store";
import { useRouteDetail } from "@/hooks/useTransport";
import type { Route, TransportStatusType } from "@/types";


const STATUS_STYLES: Record<
  TransportStatusType,
  { label: string; bg: string; text: string }
> = {
  on_time: { label: "On Time", bg: "bg-emerald-50", text: "text-emerald-700" },
  arriving: { label: "Arriving", bg: "bg-blue-50", text: "text-blue-700" },
  delayed: { label: "Delayed", bg: "bg-amber-50", text: "text-amber-700" },
  completed: {
    label: "Completed",
    bg: "bg-slate-50",
    text: "text-slate-600",
  },
};

function StatusTag({ status }: { status?: TransportStatusType }) {
  const s = status ? STATUS_STYLES[status] : STATUS_STYLES.completed;
  return (
    <View className={`px-2.5 py-1 rounded-full ${s.bg}`}>
      <Text className={`text-[12px] font-semibold ${s.text}`}>{s.label}</Text>
    </View>
  );
}

interface DetailRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <View className="flex-row items-center py-2.5 border-b border-surface-border">
      <View className="w-8 items-center">
        <Ionicons name={icon} size={16} color="#94A3B8" />
      </View>
      <View className="flex-1 ml-2">
        <Text className="text-slate-400 text-[11px] font-medium">{label}</Text>
        <Text className="text-slate-800 text-[14px] font-medium mt-0.5">
          {value}
        </Text>
      </View>
    </View>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <Text className="text-slate-900 text-[15px] font-semibold mb-2">
      {title}
    </Text>
  );
}

export function RouteDetailScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const routeParam = useNavParamStore((s) => s.params.route);
  const { routeId } = useLocalSearchParams<{ routeId: string }>();
  const {
    data: routeDetail,
    isLoading: detailLoading,
    isError: detailError,
    refetch: refetchDetail,
  } = useRouteDetail(routeId ?? "");

  const route: Route | undefined = routeParam ?? routeDetail;
  const isLoading = !route && (detailLoading || !!routeId);
  const isError = detailError && !routeParam && !route;

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (routeId) await refetchDetail();
    } finally {
      setRefreshing(false);
    }
  }, [routeId, refetchDetail]);

  if (isError) {
    return (
      <ScreenContainer
        scrollable={false}
        style={{ paddingHorizontal: 0, paddingBottom: 0 }}
        bottomInset={false}
      >
        <View className="flex-1 bg-surface-background">
          <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
            <View className="flex-row items-center">
              <TouchableOpacity
                className="w-8 h-8 rounded-full items-center justify-center mr-3"
                activeOpacity={0.7}
                onPress={() => router.back()}
              >
                <Ionicons name="close" size={22} color="#334155" />
              </TouchableOpacity>
              <Text className="text-slate-900 text-[18px] font-semibold">
                Route Details
              </Text>
            </View>
          </View>
          <View className="flex-1 items-center justify-center px-6">
            <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="cloud-offline-outline" size={32} color="#DC2626" />
            </View>
            <Text className="text-slate-800 text-lg font-bold text-center mb-2">
              Unable to Load Route
            </Text>
            <Text className="text-slate-400 text-sm text-center leading-5 max-w-[280px] mb-6">
              Please check your connection and try again.
            </Text>
            <TouchableOpacity
              className="flex-row items-center bg-primary-600 px-6 py-3 rounded-xl"
              activeOpacity={0.7}
              onPress={handleRefresh}
            >
              <Ionicons name="refresh-outline" size={18} color="#FFFFFF" />
              <Text className="text-white font-semibold text-sm ml-2">
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  if (isLoading) {
    return (
      <ScreenContainer
        scrollable={false}
        style={{ paddingHorizontal: 0, paddingBottom: 0 }}
        bottomInset={false}
      >
        <View className="flex-1 bg-surface-background">
          <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
            <View className="flex-row items-center">
              <TouchableOpacity
                className="w-8 h-8 rounded-full items-center justify-center mr-3"
                activeOpacity={0.7}
                onPress={() => router.back()}
              >
                <Ionicons name="close" size={22} color="#334155" />
              </TouchableOpacity>
              <Text className="text-slate-900 text-[18px] font-semibold">
                Route Details
              </Text>
            </View>
          </View>
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text className="text-slate-400 text-sm mt-3">
              Loading route details...
            </Text>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  const stops = route?.stops ?? [];
  const stopCount = stops?.length ?? 0;

  return (
    <ScreenContainer
      scrollable={false}
      style={{ paddingHorizontal: 0, paddingBottom: 0 }}
      bottomInset={false}
    >
      <View className="flex-1 bg-surface-background">
        <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
          <View className="flex-row items-center">
            <TouchableOpacity
              className="w-8 h-8 rounded-full items-center justify-center mr-3"
              activeOpacity={0.7}
              onPress={() => router.back()}
            >
              <Ionicons name="close" size={22} color="#334155" />
            </TouchableOpacity>
            <Text className="text-slate-900 text-[18px] font-semibold">
              Route Details
            </Text>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#4F46E5"
              colors={["#4F46E5"]}
            />
          }
        >
          <Card className="mt-4">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-3 flex-1 min-w-0">
                <View className="w-12 h-12 rounded-2xl bg-indigo-50 items-center justify-center">
                  <Ionicons name="map-outline" size={24} color="#4F46E5" />
                </View>
                <View className="flex-1 min-w-0">
                  <Text
                    className="text-slate-900 text-[17px] font-bold"
                    numberOfLines={1}
                  >
                    {route?.name ?? "Unnamed Route"}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Text className="text-slate-500 text-[12px]">
                      {stopCount} stop{stopCount === 1 ? "" : "s"}
                    </Text>
                    <Text className="text-slate-300 text-[12px] mx-2">•</Text>
                    <Text className="text-slate-500 text-[12px]">
                      {route?.assignedStudents ?? 0} students
                    </Text>
                  </View>
                </View>
              </View>
              <StatusTag status={route?.status} />
            </View>
          </Card>

          <Card className="mt-4">
            <SectionTitle title="Stops" />
            <View className="border-t border-surface-border">
              {stops.length === 0 ? (
                <Text className="text-slate-400 text-[13px] py-3 text-center">
                  No stops on this route.
                </Text>
              ) : (
                stops.map((stop, index) => (
                  <View
                    key={stop?.id ?? `stop-${index}`}
                    className={`flex-row ${index < stopCount - 1 ? "border-b border-surface-border" : ""}`}
                  >
                    <View className="items-center w-6 pt-3">
                      <View
                        className={`w-2.5 h-2.5 rounded-full mt-1 ${index === 0 ? "bg-emerald-500" : index === stopCount - 1 ? "bg-red-500" : "bg-primary-500"}`}
                      />
                      {index < stopCount - 1 && (
                        <View className="w-0.5 flex-1 bg-slate-200 mt-1" />
                      )}
                    </View>
                    <View className="flex-1 py-3 ml-3">
                      <View className="flex-row items-center justify-between">
                        <Text
                          className="text-slate-900 text-[14px] font-semibold flex-1 mr-2"
                          numberOfLines={1}
                        >
                          {stop?.name ?? `Stop ${index + 1}`}
                        </Text>
                        <Text className="text-slate-500 text-[12px] font-medium">
                          {stop?.studentCount ?? 0} students
                        </Text>
                      </View>
                      <View className="flex-row items-center mt-1.5 gap-3">
                        <View className="flex-row items-center">
                          <Ionicons name="log-in-outline" size={12} color="#94A3B8" />
                          <Text className="text-slate-400 text-[11px] ml-1">
                            {stop?.arrivalTime ?? "--:--"}
                          </Text>
                        </View>
                        <View className="flex-row items-center">
                          <Ionicons name="log-out-outline" size={12} color="#94A3B8" />
                          <Text className="text-slate-400 text-[11px] ml-1">
                            {stop?.departureTime ?? "--:--"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>
          </Card>

          <Card className="mt-4">
            <SectionTitle title="Vehicle Assignment" />
            <View className="border-t border-surface-border">
              <DetailRow
                icon="bus-outline"
                label="Vehicle"
                value={
                  [route?.vehicleName, route?.vehicleNumber]
                    .filter(Boolean)
                    .join(" — ") || "—"
                }
              />
              <DetailRow
                icon="person-outline"
                label="Driver"
                value={route?.driverName ?? "Not assigned"}
              />
              <DetailRow
                icon="call-outline"
                label="Driver Phone"
                value={route?.driverPhone ?? "—"}
              />
            </View>
          </Card>

          <Card className="mt-4 mb-4">
            <SectionTitle title="Schedule Timing" />
            <View className="border-t border-surface-border">
              <DetailRow
                icon="time-outline"
                label="Departure Time"
                value={route?.estimatedArrivalTimes ?? "--:--"}
              />
              <DetailRow
                icon="flag-outline"
                label="Estimated Arrival"
                value={route?.estimatedArrivalTimes ?? "--:--"}
              />
            </View>
          </Card>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
