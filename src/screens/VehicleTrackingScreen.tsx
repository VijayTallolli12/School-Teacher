import { useCallback, useState } from "react";
import { cardShadow } from "../theme/shadows";
import {
  ActivityIndicator,
  Alert,
  Linking,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components";
import { Card } from "@/components/ui/Card";
import { useNavParamStore } from "@/store/navParams.store";
import { useVehicleLocation } from "@/hooks/useTransport";
import type { TransportStatusType } from "@/types";


const STATUS_TAG_STYLES: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  on_time: { label: "Active", bg: "bg-emerald-50", text: "text-emerald-700" },
  arriving: {
    label: "Active",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  delayed: {
    label: "Delayed",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  completed: {
    label: "Inactive",
    bg: "bg-slate-50",
    text: "text-slate-600",
  },
  maintenance: {
    label: "Maintenance",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
};

function StatusTag({ status }: { status: string }) {
  const s = STATUS_TAG_STYLES[status] ?? {
    label: status,
    bg: "bg-slate-50",
    text: "text-slate-600",
  };
  return (
    <View className={`px-2.5 py-1 rounded-full ${s.bg}`}>
      <Text className={`text-[12px] font-semibold ${s.text}`}>{s.label}</Text>
    </View>
  );
}

interface InfoRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  iconColor?: string;
}

function InfoRow({ icon, label, value, iconColor = "#94A3B8" }: InfoRowProps) {
  return (
    <View className="flex-row items-center py-2.5">
      <View className="w-8 items-center">
        <Ionicons name={icon} size={16} color={iconColor} />
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

export function VehicleTrackingScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const vehicleParam = useNavParamStore((s) => s.params.vehicle);
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const {
    data: vehicleLocation,
    isLoading: locationLoading,
    isError: locationError,
    refetch: refetchLocation,
  } = useVehicleLocation(vehicleId ?? "");

  const vehicle = vehicleParam ?? vehicleLocation;
  const isLoading = !vehicle && (locationLoading || !!vehicleId);
  const isError = locationError && !vehicleParam && !vehicle;

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (vehicleId) await refetchLocation();
    } finally {
      setRefreshing(false);
    }
  }, [vehicleId, refetchLocation]);

  const handleContactDriver = useCallback(() => {
    const phone = vehicle?.driverPhone;
    if (!phone) {
      Alert.alert("Contact Driver", "Driver phone number not available.");
      return;
    }
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert("Error", "Could not initiate the call.");
    });
  }, [vehicle]);

  // Coordinates may come from the navParams Vehicle (currentLocation) or the
  // live VehicleLocation payload (latitude/longitude at the top level).
  const latitude = (vehicle as any)?.currentLocation?.latitude ?? (vehicle as any)?.latitude;
  const longitude = (vehicle as any)?.currentLocation?.longitude ?? (vehicle as any)?.longitude;
  const hasLocation = typeof latitude === "number" && typeof longitude === "number";

  if (isError) {
    return (
      <ScreenContainer
        scrollable={false}
        style={{ paddingHorizontal: 0, paddingBottom: 0 }}
        bottomInset={false}
      >
        <View className="flex-1 bg-surface-background">
          <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <TouchableOpacity
                  className="w-8 h-8 rounded-full items-center justify-center mr-3"
                  activeOpacity={0.7}
                  onPress={() => router.back()}
                >
                  <Ionicons name="close" size={22} color="#334155" />
                </TouchableOpacity>
                <Text className="text-slate-900 text-[18px] font-semibold">
                  Vehicle Tracking
                </Text>
              </View>
            </View>
          </View>
          <View className="flex-1 items-center justify-center px-6">
            <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="cloud-offline-outline" size={32} color="#DC2626" />
            </View>
            <Text className="text-slate-800 text-lg font-bold text-center mb-2">
              Unable to Load
            </Text>
            <Text className="text-slate-400 text-sm text-center leading-5 max-w-[280px] mb-6">
              Failed to load vehicle tracking data.
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
                Vehicle Tracking
              </Text>
            </View>
          </View>
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text className="text-slate-400 text-sm mt-3">
              Loading vehicle data...
            </Text>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  const statusKey = vehicle?.status ?? "completed";
  const statusStyle = STATUS_TAG_STYLES[statusKey] ?? STATUS_TAG_STYLES.completed;

  return (
    <ScreenContainer
      scrollable={false}
      style={{ paddingHorizontal: 0, paddingBottom: 0 }}
      bottomInset={false}
    >
      <View className="flex-1 bg-surface-background">
        <View className="bg-white px-4 pt-3 pb-3 border-b border-surface-border">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 min-w-0">
              <TouchableOpacity
                className="w-8 h-8 rounded-full items-center justify-center mr-3"
                activeOpacity={0.7}
                onPress={() => router.back()}
              >
                <Ionicons name="close" size={22} color="#334155" />
              </TouchableOpacity>
              <Text
                className="text-slate-900 text-[18px] font-semibold"
                numberOfLines={1}
              >
                Vehicle Tracking
              </Text>
            </View>
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
              <View className="flex-row items-center gap-3">
                <View className="w-12 h-12 rounded-2xl bg-indigo-50 items-center justify-center">
                  <Ionicons name="bus-outline" size={26} color="#4F46E5" />
                </View>
                <View className="min-w-0">
                  <Text
                    className="text-slate-900 text-[17px] font-bold"
                    numberOfLines={1}
                  >
                    {vehicle?.vehicleNumber ?? "—"}
                  </Text>
                  <Text
                    className="text-slate-500 text-[13px] font-medium mt-0.5"
                    numberOfLines={1}
                  >
                    {vehicle?.vehicleName ?? vehicle?.name ?? "Vehicle"}
                  </Text>
                </View>
              </View>
              <StatusTag status={statusKey} />
            </View>

            <View className="border-t border-surface-border pt-1">
              <InfoRow
                icon="person-outline"
                label="Driver"
                value={vehicle?.driverName ?? "Not assigned"}
              />
              {vehicle?.routeName && (
                <InfoRow
                  icon="navigate-outline"
                  label="Route"
                  value={vehicle?.routeName}
                />
              )}
            </View>
          </Card>

          <Card className="mt-4">
            <Text className="text-slate-900 text-[15px] font-semibold mb-2">
              Route Progress
            </Text>
            <View className="border-t border-surface-border">
              <InfoRow
                icon="map-outline"
                label="Route Name"
                value={vehicle?.routeName ?? "—"}
              />
              <InfoRow
                icon="time-outline"
                label="Departure Time"
                value={vehicle?.lastUpdate ?? "--:--"}
              />
            </View>
          </Card>

          {/* Live map */}
          <Card className="mt-4 overflow-hidden">
            <Text className="text-slate-900 text-[15px] font-semibold mb-2">Live Location</Text>
            {hasLocation ? (
              <View className="h-52 rounded-2xl overflow-hidden border border-surface-border">
                <MapView
                  style={{ flex: 1 }}
                  initialRegion={{
                    latitude,
                    longitude,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  pointerEvents="none"
                >
                  <Marker
                    coordinate={{ latitude, longitude }}
                    title={vehicle?.vehicleNumber ?? "Vehicle"}
                    description={vehicle?.routeName ?? undefined}
                  />
                </MapView>
              </View>
            ) : (
              <View className="items-center py-6">
                <View className="w-12 h-12 bg-slate-50 rounded-full items-center justify-center mb-2">
                  <Ionicons name="locate-outline" size={22} color="#CBD5E1" />
                </View>
                <Text className="text-slate-400 text-xs">Location unavailable for this vehicle</Text>
              </View>
            )}
          </Card>

          {vehicle?.eta && (
            <Card className="mt-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2.5">
                  <View className="w-11 h-11 rounded-xl bg-blue-50 items-center justify-center">
                    <Ionicons name="time-outline" size={22} color="#2563EB" />
                  </View>
                  <View>
                    <Text className="text-slate-400 text-[11px] font-medium">
                      Estimated Arrival
                    </Text>
                    <Text className="text-slate-900 text-[18px] font-bold mt-0.5">
                      {vehicle?.eta}
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          )}

          <TouchableOpacity
            className="flex-row items-center justify-center bg-white border border-slate-200 rounded-2xl px-4 py-4 mt-4"
            activeOpacity={0.7}
            onPress={handleContactDriver}
            style={cardShadow}
          >
            <View className="w-10 h-10 rounded-xl bg-blue-50 items-center justify-center mr-3">
              <Ionicons name="call-outline" size={20} color="#2563EB" />
            </View>
            <View className="flex-1">
              <Text className="text-slate-900 text-[15px] font-semibold">
                Contact Driver
              </Text>
              <Text className="text-slate-400 text-[12px] mt-0.5">
                {vehicle?.driverPhone && vehicle?.driverName
                  ? `${vehicle?.driverName} — ${vehicle?.driverPhone}`
                  : "Phone number not available"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
