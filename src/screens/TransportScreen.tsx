import { useCallback, useMemo, useState } from "react";
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
import { useNavParamStore } from "@/store/navParams.store";
import {
  useAssignedRoutes,
  useLiveTransportStatus,
  useVehicles,
} from "@/hooks/useTransport";
import type { Route, TransportStatusType, Vehicle } from "@/types";


const STATUS_STYLES: Record<
  TransportStatusType,
  { label: string; bg: string; text: string; dot: string }
> = {
  on_time: {
    label: "On Time",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  arriving: {
    label: "Arriving",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  delayed: {
    label: "Delayed",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  completed: {
    label: "Completed",
    bg: "bg-slate-50",
    text: "text-slate-600",
    dot: "bg-slate-400",
  },
};

function StatusBadge({ status }: { status?: TransportStatusType }) {
  const s = status ? STATUS_STYLES[status] : STATUS_STYLES.completed;
  return (
    <View className={`flex-row items-center px-2 py-0.5 rounded-full ${s.bg}`}>
      <View className={`w-1.5 h-1.5 rounded-full ${s.dot} mr-1.5`} />
      <Text className={`text-[11px] font-semibold ${s.text}`}>{s.label}</Text>
    </View>
  );
}

function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <View className="flex-row items-end justify-between mb-3 mt-6">
      <Text className="text-slate-900 text-[18px] font-semibold">{title}</Text>
      {action}
    </View>
  );
}

export function TransportScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const setNavParams = useNavParamStore((s) => s.setParams);

  const {
    data: liveStatus,
    isLoading: liveLoading,
    isError: liveError,
    refetch: refetchLive,
  } = useLiveTransportStatus();
  const { data: routes = [], isLoading: routesLoading } = useAssignedRoutes();
  const { data: vehicles = [], isLoading: vehiclesLoading } = useVehicles();

  const isLoading = liveLoading || routesLoading || vehiclesLoading;

  const onTimePercent = useMemo(() => {
    const allRoutes = liveStatus?.routes;
    if (!allRoutes?.length) return 0;
    const onTime = allRoutes.filter(
      (r) => r.status === "on_time" || r.status === "arriving"
    ).length;
    return Math.round((onTime / allRoutes.length) * 100);
  }, [liveStatus]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetchLive();
    } finally {
      setRefreshing(false);
    }
  }, [refetchLive]);

  const handleRoutePress = useCallback(
    (route: Route) => {
      setNavParams("route", route);
      router.push("/(tabs)/more/route-detail");
    },
    [setNavParams]
  );

  const handleVehiclePress = useCallback(
    (vehicle: Vehicle) => {
      setNavParams("vehicle", vehicle);
      router.push("/(tabs)/more/vehicle-tracking");
    },
    [setNavParams]
  );

  const summaryItems = [
    {
      icon: "map-outline" as const,
      value: liveStatus?.activeRoutes ?? 0,
      label: "Active Routes",
      color: "#2563EB",
      tint: "#EFF6FF",
    },
    {
      icon: "bus-outline" as const,
      value: liveStatus?.vehiclesInTransit ?? 0,
      label: "Active Vehicles",
      color: "#0891B2",
      tint: "#ECFEFF",
    },
    {
      icon: "checkmark-circle-outline" as const,
      value: `${onTimePercent}%`,
      label: "On-Time",
      color: "#16A34A",
      tint: "#F0FDF4",
    },
  ];

  if (isLoading) {
    return (
      <ScreenContainer
        scrollable={false}
        style={{ paddingHorizontal: 0, paddingBottom: 0 }}
        bottomInset={false}
      >
        <View className="flex-1 bg-surface-background">
          <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
            <View className="flex-row items-center justify-between">
              <Text className="text-slate-900 text-[18px] font-semibold">
                Transport
              </Text>
              <TouchableOpacity
                className="w-9 h-9 bg-slate-100 rounded-full items-center justify-center"
                activeOpacity={0.7}
                onPress={() => router.push("/(tabs)/notifications")}
              >
                <Ionicons name="notifications-outline" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text className="text-slate-400 text-sm mt-3">
              Loading transport data...
            </Text>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  if (liveError && !liveStatus) {
    return (
      <ScreenContainer
        scrollable={false}
        style={{ paddingHorizontal: 0, paddingBottom: 0 }}
        bottomInset={false}
      >
        <View className="flex-1 bg-surface-background">
          <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
            <View className="flex-row items-center justify-between">
              <Text className="text-slate-900 text-[18px] font-semibold">
                Transport
              </Text>
              <TouchableOpacity
                className="w-9 h-9 bg-slate-100 rounded-full items-center justify-center"
                activeOpacity={0.7}
                onPress={() => router.push("/(tabs)/notifications")}
              >
                <Ionicons name="notifications-outline" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex-1 items-center justify-center px-6">
            <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="cloud-offline-outline" size={32} color="#DC2626" />
            </View>
            <Text className="text-slate-800 text-lg font-bold text-center mb-2">
              Connection Error
            </Text>
            <Text className="text-slate-400 text-sm text-center leading-5 max-w-[280px] mb-6">
              Could not load transport data. Pull down to retry.
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

  return (
    <ScreenContainer
      scrollable={false}
      style={{ paddingHorizontal: 0, paddingBottom: 0 }}
      bottomInset={false}
    >
      <View className="flex-1 bg-surface-background">
        <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
          <View className="flex-row items-center justify-between">
            <Text className="text-slate-900 text-[18px] font-semibold">
              Transport
            </Text>
            <TouchableOpacity
              className="w-9 h-9 bg-slate-100 rounded-full items-center justify-center"
              activeOpacity={0.7}
              onPress={() => router.push("/(tabs)/notifications")}
            >
              <Ionicons name="notifications-outline" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}
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
          <View className="flex-row gap-3 mt-4">
            {summaryItems.map((item, idx) => (
              <View
                key={idx}
                className="flex-1 rounded-2xl bg-white border border-surface-border p-4 overflow-hidden"
                style={cardShadow}
              >
                <View
                  className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-sm"
                  style={{ backgroundColor: item.color }}
                />
                <View className="flex-row items-center justify-between mb-3">
                  <View
                    className="w-10 h-10 rounded-xl items-center justify-center"
                    style={{ backgroundColor: item.tint }}
                  >
                    <Ionicons name={item.icon} size={18} color={item.color} />
                  </View>
                </View>
                <Text
                  className="text-slate-900 text-[28px] font-bold"
                  numberOfLines={1}
                >
                  {item.value}
                </Text>
                <Text
                  className="text-slate-500 text-[13px] font-medium mt-1"
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </View>

          {routes.length > 0 && (
            <>
              <SectionHeader
                title="Routes"
                action={
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text className="text-primary-600 text-xs font-semibold">
                      See All
                    </Text>
                  </TouchableOpacity>
                }
              />
              <Card padding="none" className="overflow-hidden">
                {routes.map((route, index) => (
                  <TouchableOpacity
                    key={route?.id ?? `route-${index}`}
                    className={`p-4 ${index < routes.length - 1 ? "border-b border-surface-border" : ""}`}
                    activeOpacity={0.7}
                    onPress={() => handleRoutePress(route)}
                  >
                    <View className="flex-row items-center justify-between mb-1.5">
                      <Text
                        className="text-slate-900 text-[15px] font-semibold flex-1 mr-2"
                        numberOfLines={1}
                      >
                        {route?.name ?? "Unnamed Route"}
                      </Text>
                      <StatusBadge status={route?.status} />
                    </View>
                    <View className="flex-row items-center gap-4">
                      <View className="flex-row items-center">
                        <Ionicons name="location-outline" size={13} color="#94A3B8" />
                        <Text className="text-slate-500 text-[12px] ml-1">
                          {route?.stops?.length ?? 0} stops
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Ionicons name="bus-outline" size={13} color="#94A3B8" />
                        <Text
                          className="text-slate-500 text-[12px] ml-1"
                          numberOfLines={1}
                        >
                          {route?.vehicleNumber || route?.vehicleName || "—"}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center justify-between mt-2">
                      <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={13} color="#94A3B8" />
                        <Text className="text-slate-500 text-[12px] ml-1">
                          {route?.estimatedArrivalTimes ?? "--:--"}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Ionicons name="people-outline" size={13} color="#94A3B8" />
                        <Text className="text-slate-500 text-[12px] ml-1">
                          {route?.assignedStudents ?? 0} students
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </Card>
            </>
          )}

          {vehicles.length > 0 && (
            <>
              <SectionHeader
                title="Vehicles"
                action={
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text className="text-primary-600 text-xs font-semibold">
                      See All
                    </Text>
                  </TouchableOpacity>
                }
              />
              <Card padding="none" className="overflow-hidden mb-4">
                {vehicles.map((vehicle, index) => (
                  <TouchableOpacity
                    key={vehicle?.id ?? `vehicle-${index}`}
                    className={`p-4 ${index < vehicles.length - 1 ? "border-b border-surface-border" : ""}`}
                    activeOpacity={0.7}
                    onPress={() => handleVehiclePress(vehicle)}
                  >
                    <View className="flex-row items-center justify-between mb-1.5">
                      <View className="flex-row items-center gap-2 flex-1 min-w-0">
                        <View className="w-10 h-10 rounded-xl bg-indigo-50 items-center justify-center">
                          <Ionicons name="bus-outline" size={20} color="#4F46E5" />
                        </View>
                        <View className="flex-1 min-w-0">
                          <Text
                            className="text-slate-900 text-[15px] font-semibold"
                            numberOfLines={1}
                          >
                            {vehicle?.vehicleNumber ?? "—"}
                          </Text>
                          <Text
                            className="text-slate-500 text-[12px]"
                            numberOfLines={1}
                          >
                            {vehicle?.name ?? "Vehicle"}
                          </Text>
                        </View>
                      </View>
                      <StatusBadge status={vehicle?.status} />
                    </View>
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Ionicons name="person-outline" size={13} color="#94A3B8" />
                        <Text
                          className="text-slate-500 text-[12px] ml-1"
                          numberOfLines={1}
                        >
                          {vehicle?.driverName ?? "Not assigned"}
                        </Text>
                      </View>
                      {vehicle?.eta && (
                        <View className="flex-row items-center">
                          <Ionicons name="time-outline" size={13} color="#94A3B8" />
                          <Text className="text-slate-500 text-[12px] ml-1">
                            ETA: {vehicle?.eta}
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </Card>
            </>
          )}

          {routes.length === 0 && vehicles.length === 0 && (
            <View className="items-center justify-center pt-16 pb-8">
              <View className="w-16 h-16 bg-slate-50 rounded-full items-center justify-center mb-3">
                <Ionicons name="bus-outline" size={32} color="#CBD5E1" />
              </View>
              <Text className="text-slate-700 text-sm font-semibold">
                No transport data
              </Text>
              <Text className="text-slate-400 text-xs mt-1 text-center leading-5 max-w-[240px]">
                No routes or vehicles assigned yet.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
