import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AppHeader, ScreenContainer } from '../components';
import { AppCard } from '../components/AppCard';
import { RouteCard } from '../components/RouteCard';
import { VehicleCard } from '../components/VehicleCard';
import { TransportEmptyState } from '../components/TransportEmptyState';
import { SkeletonList } from '../components/SkeletonLoader';
import { useLiveTransportStatus, useAssignedRoutes, useVehicles } from '../hooks/useTransport';
import { theme } from '../theme';
import { Route, Vehicle } from '../types';

export const TransportScreen: React.FC = () => {
  const { data: liveStatus, isLoading: liveLoading, isError: liveError, refetch: refetchLive, isRefetching: liveRefetching } = useLiveTransportStatus();
  const { data: routes, isLoading: routesLoading } = useAssignedRoutes();
  const { data: vehicles, isLoading: vehiclesLoading } = useVehicles();

  const isLoading = liveLoading || routesLoading || vehiclesLoading;

  const handleRoutePress = useCallback(
    (route: Route) => {
      router.push({ pathname: '/(tabs)/more/route-detail', params: { routeId: route.id } });
    },
    []
  );

  const handleVehiclePress = useCallback(
    (vehicle: Vehicle) => {
      router.push({ pathname: '/(tabs)/more/vehicle-tracking', params: { vehicleId: vehicle.id } });
    },
    []
  );

  const summaryCards = useMemo(() => {
    const s = liveStatus;
    return [
      { icon: 'map-outline' as const, value: s?.activeRoutes ?? 0, label: 'Active Routes', color: theme.colors.info },
      { icon: 'bus-outline' as const, value: s?.vehiclesInTransit ?? 0, label: 'In Transit', color: theme.colors.primary },
      { icon: 'time-outline' as const, value: s?.upcomingArrivals ?? 0, label: 'Upcoming Arrivals', color: theme.colors.success },
      { icon: 'alert-circle-outline' as const, value: s?.delayedRoutes ?? 0, label: 'Delayed', color: theme.colors.error },
    ];
  }, [liveStatus]);

  if (isLoading) {
    return (
      <ScreenContainer>
        <AppHeader title="Transport" showBackButton onBackPress={() => router.back()} />
        <SkeletonList count={4} style={styles.skeletonList} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={false} backgroundColor={theme.colors.backgroundSecondary} style={{ paddingBottom: 0 }} bottomInset={false}>
      <AppHeader title="Transport" showBackButton onBackPress={() => router.back()} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={liveRefetching}
            onRefresh={refetchLive}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        <View style={styles.summaryRow}>
          {summaryCards.map((item, index) => (
            <View key={index} style={styles.summaryCard}>
              <Ionicons name={item.icon} size={20} color={item.color} />
              <Text style={[styles.summaryValue, { color: item.color }]}>{item.value}</Text>
              <Text style={styles.summaryLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {liveError && !liveStatus ? (
          <TransportEmptyState message="Could not load transport data. Pull down to retry." />
        ) : !routes || routes.length === 0 ? (
          <TransportEmptyState />
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Active Routes</Text>
              {routes.map((route) => (
                <RouteCard key={route.id} route={route} onPress={() => handleRoutePress(route)} />
              ))}
            </View>

            {vehicles && vehicles.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Vehicles In Transit</Text>
                {vehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} onPress={() => handleVehiclePress(vehicle)} />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxl,
  },
  skeletonList: {
    padding: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  summaryValue: {
    ...theme.typography.hierarchy.title,
    fontWeight: theme.typography.weight.bold,
  },
  summaryLabel: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
});
