import React, { useMemo } from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer, AppHeader } from '../components';
import { AppCard } from '../components/AppCard';
import { TransportStatusBadge } from '../components/TransportStatusBadge';

import { SkeletonCard } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import { useVehicleLocation } from '../hooks/useTransport';
import { theme } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAP_HEIGHT = 280;

export const VehicleTrackingScreen: React.FC = () => {
  const navigation = useNavigation();
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const { data: vehicle, isLoading, error, refetch, isRefetching } = useVehicleLocation(vehicleId);

  const initialRegion = useMemo(() => {
    if (!vehicle) return undefined;
    return {
      latitude: vehicle.latitude,
      longitude: vehicle.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };
  }, [vehicle]);

  const { MapView: MapComp, Marker: MarkerComp } = useMemo(() => {
    try {
      const Maps = require('react-native-maps');
      return {
        MapView: Maps.default || Maps.MapView,
        Marker: Maps.Marker,
      };
    } catch {
      return { MapView: null as any, Marker: null as any };
    }
  }, []);

  if (error) {
    return (
      <ScreenContainer>
        <AppHeader variant="secondary" title="Live Tracking" showBackButton onBackPress={() => navigation.goBack()} />
        <EmptyState
          icon="cloud-offline-outline"
          title="Unable to Load"
          message={error.message || 'Failed to load vehicle location'}
          actionLabel="Retry"
          onAction={() => refetch()}
        />
      </ScreenContainer>
    );
  }

  if (isLoading || !vehicle) {
    return (
      <ScreenContainer>
        <AppHeader variant="secondary" title="Live Tracking" showBackButton onBackPress={() => navigation.goBack()} />
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map-outline" size={48} color={theme.colors.textTertiary} />
          <Text style={styles.placeholderText}>Loading map...</Text>
        </View>
        <View style={styles.skeletonContainer}>
          <SkeletonCard lines={4} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={false} backgroundColor={theme.colors.background} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
      <AppHeader variant="secondary" title="Live Tracking" showBackButton onBackPress={() => navigation.goBack()} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        {MapComp && MarkerComp ? (
          <View style={styles.mapContainer}>
            <MapComp
              style={styles.map}
              initialRegion={initialRegion}
              showsUserLocation={false}
              showsMyLocationButton={false}
              showsCompass={true}
              rotateEnabled={false}
              toolbarEnabled={false}
            >
              <MarkerComp
                coordinate={{
                  latitude: vehicle.latitude,
                  longitude: vehicle.longitude,
                }}
                title={vehicle.vehicleName}
                description={`${vehicle.speed} km/h — ${vehicle.status}`}
              >
                <View style={styles.markerContainer}>
                  <Ionicons name="bus" size={24} color={theme.colors.primary} />
                </View>
              </MarkerComp>
            </MapComp>
          </View>
        ) : (
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map-outline" size={48} color={theme.colors.textTertiary} />
            <Text style={styles.placeholderText}>Map Unavailable</Text>
            <Text style={styles.placeholderSubtext}>
              {Platform.OS === 'web' ? 'Map libraries are not supported on web.' : 'Install react-native-maps to enable.'}
            </Text>
          </View>
        )}

        <View style={trackingHeaderStyles.container}>
          <View style={trackingHeaderStyles.row}>
            <View style={trackingHeaderStyles.vehicleInfo}>
              <Ionicons name="bus-outline" size={24} color={theme.colors.primary} />
              <View style={trackingHeaderStyles.vehicleText}>
                <Text style={trackingHeaderStyles.vehicleName}>{vehicle.vehicleName}</Text>
                <Text style={trackingHeaderStyles.vehicleNumber}>{vehicle.vehicleNumber}</Text>
              </View>
            </View>
            <View style={trackingHeaderStyles.speedContainer}>
              <Text style={trackingHeaderStyles.speedValue}>{vehicle.speed}</Text>
              <Text style={trackingHeaderStyles.speedUnit}>km/h</Text>
            </View>
          </View>

          <View style={trackingHeaderStyles.infoGrid}>
            <View style={trackingHeaderStyles.infoItem}>
              <Ionicons name="person-outline" size={14} color={theme.colors.textSecondary} />
              <Text style={trackingHeaderStyles.infoText}>{vehicle.driverName}</Text>
            </View>
            <View style={trackingHeaderStyles.infoItem}>
              <Ionicons name="navigate-outline" size={14} color={theme.colors.textSecondary} />
              <Text style={trackingHeaderStyles.infoText}>{vehicle.routeName}</Text>
            </View>
            <View style={trackingHeaderStyles.infoItem}>
              <Ionicons name="time-outline" size={14} color={theme.colors.textSecondary} />
              <Text style={trackingHeaderStyles.infoText}>ETA: {vehicle.eta}</Text>
            </View>
          </View>

          <Text style={trackingHeaderStyles.lastUpdate}>Last updated: {vehicle.lastUpdate}</Text>
        </View>

        <AppCard variant="default" style={styles.infoCard}>
          <Text style={styles.infoTitle}>Vehicle Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status</Text>
            <TransportStatusBadge status={vehicle.status} />
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Route</Text>
            <Text style={styles.infoValue}>{vehicle.routeName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Speed</Text>
            <Text style={styles.infoValue}>{vehicle.speed} km/h</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ETA</Text>
            <Text style={styles.infoValue}>{vehicle.eta}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Coordinates</Text>
            <Text style={styles.infoValue}>
              {vehicle.latitude.toFixed(4)}, {vehicle.longitude.toFixed(4)}
            </Text>
          </View>
        </AppCard>
      </ScrollView>
    </ScreenContainer>
  );
};

const trackingHeaderStyles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  vehicleText: {
    gap: 2,
  },
  vehicleName: {
    ...theme.typography.hierarchy.body,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text,
  },
  vehicleNumber: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textSecondary,
  },
  speedContainer: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '10',
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  speedValue: {
    ...theme.typography.hierarchy.title,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.primary,
  },
  speedUnit: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.primary,
  },
  infoGrid: {
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.textSecondary,
  },
  lastUpdate: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textTertiary,
    textAlign: 'right',
  },
});

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxl,
  },
  mapContainer: {
    height: MAP_HEIGHT,
    width: SCREEN_WIDTH,
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    height: MAP_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    gap: theme.spacing.sm,
  },
  placeholderText: {
    ...theme.typography.hierarchy.body,
    color: theme.colors.textTertiary,
  },
  placeholderSubtext: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  skeletonContainer: {
    padding: theme.spacing.md,
  },
  markerContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.full,
    padding: 4,
    ...theme.shadows.sm,
  },
  infoCard: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  infoTitle: {
    ...theme.typography.hierarchy.body,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoLabel: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.text,
    fontWeight: theme.typography.weight.medium,
  },
});
