import React, { useMemo } from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer, AppHeader } from '../components';
import { AppCard } from '../components/AppCard';
import { TransportStatusBadge } from '../components/TransportStatusBadge';
import { LiveTrackingHeader } from '../components/LiveTrackingHeader';
import { SkeletonCard } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import { useVehicleLocation } from '../hooks/useTransport';
import { theme } from '../theme';
import { AppStackParamList } from '../types';

type TrackingRouteProp = RouteProp<AppStackParamList, 'VehicleTracking'>;
type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAP_HEIGHT = 280;

export const VehicleTrackingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<TrackingRouteProp>();
  const { vehicleId } = route.params;
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
        <AppHeader title="Live Tracking" showBackButton onBackPress={() => navigation.goBack()} />
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
        <AppHeader title="Live Tracking" showBackButton onBackPress={() => navigation.goBack()} />
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
    <View style={styles.screen}>
      <AppHeader title="Live Tracking" showBackButton onBackPress={() => navigation.goBack()} />
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

        <LiveTrackingHeader vehicle={vehicle} />

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
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
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
