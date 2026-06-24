import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppHeader, ScreenContainer } from '../components';
import { AppCard } from '../components/AppCard';
import { RouteCard } from '../components/RouteCard';
import { VehicleCard } from '../components/VehicleCard';
import { TransportEmptyState } from '../components/TransportEmptyState';
import { SkeletonList } from '../components/SkeletonLoader';
import { useLiveTransportStatus, useAssignedRoutes, useVehicles } from '../hooks/useTransport';
import { theme } from '../theme';
import { AppStackParamList, Route, Vehicle } from '../types';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export const TransportScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { data: liveStatus, isLoading: liveLoading, isError: liveError, refetch: refetchLive, isRefetching: liveRefetching } = useLiveTransportStatus();
  const { data: routes, isLoading: routesLoading } = useAssignedRoutes();
  const { data: vehicles, isLoading: vehiclesLoading } = useVehicles();

  const isLoading = liveLoading || routesLoading || vehiclesLoading;

  const handleRoutePress = useCallback(
    (route: Route) => {
      navigation.navigate('RouteDetail', { routeId: route.id });
    },
    [navigation]
  );

  const handleVehiclePress = useCallback(
    (vehicle: Vehicle) => {
      navigation.navigate('VehicleTracking', { vehicleId: vehicle.id });
    },
    [navigation]
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
        <AppHeader title="Transport" />
        <SkeletonList count={4} style={styles.skeletonList} />
      </ScreenContainer>
    );
  }

  return (
    <View style={styles.screen}>
      <AppHeader title="Transport" />
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
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
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
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
    ...theme.typography.hierarchy.body,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
});
