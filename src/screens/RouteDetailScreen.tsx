import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer, AppHeader } from '../components';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { TransportStatusBadge } from '../components/TransportStatusBadge';
import { SkeletonCard } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import { useRouteDetail } from '../hooks/useTransport';
import { theme } from '../theme';

export const RouteDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const { routeId } = useLocalSearchParams<{ routeId: string }>();
  const { data: routeDetail, isLoading, error, refetch, isRefetching } = useRouteDetail(routeId);

  const handleTrackVehicle = useCallback(() => {
    if (routeDetail?.vehicleId) {
      router.push({ pathname: '/(tabs)/more/vehicle-tracking', params: { vehicleId: routeDetail.vehicleId } });
    }
  }, [routeDetail]);

  if (error) {
    return (
      <ScreenContainer>
        <AppHeader variant="secondary" title="Route Details" showBackButton onBackPress={() => navigation.goBack()} />
        <EmptyState
          icon="cloud-offline-outline"
          title="Unable to Load Route"
          message={error.message || 'Please check your connection and try again'}
          actionLabel="Retry"
          onAction={() => refetch()}
        />
      </ScreenContainer>
    );
  }

  if (isLoading || !routeDetail) {
    return (
      <ScreenContainer>
        <AppHeader variant="secondary" title="Route Details" showBackButton onBackPress={() => navigation.goBack()} />
        <View style={styles.container}>
          <SkeletonCard lines={5} style={styles.skeletonCard} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <AppHeader variant="secondary" title="Route Details" showBackButton onBackPress={() => navigation.goBack()} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        <AppCard variant="default" style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={styles.routeName}>{routeDetail.name}</Text>
              <TransportStatusBadge status={routeDetail.status} />
            </View>
          </View>
          <Text style={styles.description}>{routeDetail.description}</Text>
        </AppCard>

        <AppCard variant="default" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Vehicle & Driver</Text>
          <View style={styles.infoRow}>
            <Ionicons name="bus-outline" size={16} color={theme.colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Vehicle</Text>
              <Text style={styles.infoValue}>{routeDetail.vehicleName} ({routeDetail.vehicleNumber})</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={16} color={theme.colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Driver</Text>
              <Text style={styles.infoValue}>{routeDetail.driverName}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={16} color={theme.colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Driver Phone</Text>
              <Text style={styles.infoValue}>{routeDetail.driverPhone}</Text>
            </View>
          </View>
          <AppButton
            title="Track Vehicle"
            variant="primary"
            leftIcon={<Ionicons name="navigate-outline" size={18} color={theme.colors.primaryContrast} />}
            onPress={handleTrackVehicle}
            style={styles.trackButton}
          />
        </AppCard>

        <AppCard variant="default" style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Route Stops ({routeDetail.stops.length})</Text>
            <Ionicons name="people-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.studentCount}>{routeDetail.assignedStudents} students</Text>
          </View>

          {routeDetail.stops.map((stop, index) => (
            <View key={stop.id} style={styles.stopItem}>
              <View style={styles.stopConnector}>
                <View style={styles.stopDot} />
                {index < routeDetail.stops.length - 1 && <View style={styles.stopLine} />}
              </View>
              <View style={styles.stopContent}>
                <View style={styles.stopHeader}>
                  <Text style={styles.stopName}>{stop.name}</Text>
                  <Text style={styles.stopStudentCount}>{stop.studentCount} students</Text>
                </View>
                <Text style={styles.stopAddress}>{stop.address}</Text>
                <View style={styles.stopTimes}>
                  <View style={styles.stopTimeItem}>
                    <Ionicons name="log-in-outline" size={12} color={theme.colors.textTertiary} />
                    <Text style={styles.stopTimeText}>Arrive: {stop.arrivalTime}</Text>
                  </View>
                  <View style={styles.stopTimeItem}>
                    <Ionicons name="log-out-outline" size={12} color={theme.colors.textTertiary} />
                    <Text style={styles.stopTimeText}>Depart: {stop.departureTime}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </AppCard>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  contentContainer: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  skeletonCard: {
    margin: theme.spacing.md,
  },
  headerCard: {
    marginBottom: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  headerLeft: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  routeName: {
    ...theme.typography.hierarchy.title,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text,
  },
  description: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.textSecondary,
  },
  sectionCard: {
    marginBottom: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.hierarchy.body,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  studentCount: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textSecondary,
    marginLeft: 'auto',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoContent: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textTertiary,
  },
  infoValue: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.text,
    fontWeight: theme.typography.weight.medium,
  },
  trackButton: {
    marginTop: theme.spacing.md,
  },
  stopItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  stopConnector: {
    alignItems: 'center',
    width: 20,
    marginRight: theme.spacing.sm,
  },
  stopDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
    marginTop: 4,
  },
  stopLine: {
    width: 2,
    flex: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 2,
  },
  stopContent: {
    flex: 1,
    paddingBottom: theme.spacing.sm,
  },
  stopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  stopName: {
    ...theme.typography.hierarchy.bodySmall,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text,
    flex: 1,
  },
  stopStudentCount: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.primary,
    fontWeight: theme.typography.weight.medium,
  },
  stopAddress: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  stopTimes: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  stopTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stopTimeText: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textTertiary,
    fontSize: 11,
  },
});
