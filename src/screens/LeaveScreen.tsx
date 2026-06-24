import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppHeader, ScreenContainer } from '../components';
import { LeaveBalanceCard } from '../components/LeaveBalanceCard';
import { LeaveCard } from '../components/LeaveCard';
import { LeaveEmptyState } from '../components/LeaveEmptyState';
import { SkeletonList } from '../components/SkeletonLoader';
import { useLeaves, useLeaveBalance } from '../hooks/useLeave';
import { theme } from '../theme';
import { AppStackParamList, LeaveItem, LeaveStatus } from '../types';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

const statusSummary = (
  leaves: LeaveItem[]
): { label: string; count: number; status: LeaveStatus | 'all' }[] => {
  const total = leaves.length;
  const pending = leaves.filter((l) => l.status === 'pending').length;
  const approved = leaves.filter((l) => l.status === 'approved').length;
  const rejected = leaves.filter((l) => l.status === 'rejected').length;

  return [
    { label: 'Total', count: total, status: 'all' },
    { label: 'Pending', count: pending, status: 'pending' },
    { label: 'Approved', count: approved, status: 'approved' },
    { label: 'Rejected', count: rejected, status: 'rejected' },
  ];
};

export const LeaveScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const {
    data: leaves,
    isLoading: leavesLoading,
    isError: leavesError,
    refetch: refetchLeaves,
    isRefetching: leavesRefetching,
  } = useLeaves();

  const {
    data: balances,
    isLoading: balanceLoading,
    isError: balanceError,
    refetch: refetchBalance,
    isRefetching: balanceRefetching,
  } = useLeaveBalance();

  const [filter, setFilter] = React.useState<LeaveStatus | 'all'>('all');

  const filteredLeaves = useMemo(() => {
    if (!leaves) return [];
    if (filter === 'all') return leaves;
    return leaves.filter((l) => l.status === filter);
  }, [leaves, filter]);

  const summary = useMemo(
    () => (leaves ? statusSummary(leaves) : []),
    [leaves]
  );

  const handleApplyLeave = useCallback(() => {
    navigation.navigate('LeaveApply', {});
  }, [navigation]);

  const handleLeavePress = useCallback(
    (leave: LeaveItem) => {
      navigation.navigate('LeaveDetail', { leaveId: leave.id });
    },
    [navigation]
  );

  const isRefreshing = leavesRefetching || balanceRefetching;
  const onRefresh = useCallback(() => {
    refetchLeaves();
    refetchBalance();
  }, [refetchLeaves, refetchBalance]);

  const isLoading = leavesLoading || balanceLoading;

  if (isLoading) {
    return (
      <ScreenContainer>
        <AppHeader title="Leave Management" />
        <SkeletonList count={4} style={styles.skeletonList} />
      </ScreenContainer>
    );
  }

  return (
    <View style={styles.screen}>
      <AppHeader title="Leave Management" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Balance */}
        {balances && balances.length > 0 && !balanceError && (
          <View style={styles.section}>
            <LeaveBalanceCard balances={balances} />
          </View>
        )}

        {/* Summary chips */}
        {summary.length > 0 && (
          <View style={styles.summaryRow} accessibilityRole="tablist" accessibilityLabel="Filter by status">
            {summary.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.summaryChip,
                  filter === item.status && styles.summaryChipActive,
                ]}
                onPress={() => setFilter(item.status)}
                activeOpacity={0.7}
                accessibilityRole="tab"
                accessibilityState={{ selected: filter === item.status }}
                accessibilityLabel={`${item.label}: ${item.count}`}
              >
                <Text
                  style={[
                    styles.summaryCount,
                    filter === item.status && styles.summaryCountActive,
                  ]}
                >
                  {item.count}
                </Text>
                <Text
                  style={[
                    styles.summaryLabel,
                    filter === item.status && styles.summaryLabelActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Leave list */}
        <View style={styles.section}>
          {leavesError ? (
            <LeaveEmptyState message="Could not load leave records. Pull down to retry." />
          ) : filteredLeaves.length === 0 ? (
            <LeaveEmptyState
              message={
                filter === 'all'
                  ? 'No leave records found. Apply for leave to get started.'
                  : `No ${filter} leave records`
              }
              actionLabel="Apply for Leave"
              onAction={handleApplyLeave}
            />
          ) : (
            filteredLeaves.map((leave) => (
              <LeaveCard
                key={leave.id}
                leave={leave}
                onPress={() => handleLeavePress(leave)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleApplyLeave}
        activeOpacity={0.8}
        accessibilityLabel="Apply for leave"
        accessibilityRole="button"
      >
        <Ionicons name="add" size={28} color={theme.colors.background} />
      </TouchableOpacity>
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
  section: {
    marginBottom: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  summaryChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  summaryChipActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  summaryCount: {
    ...theme.typography.hierarchy.heading,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text,
  },
  summaryCountActive: {
    color: theme.colors.primary,
  },
  summaryLabel: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
  summaryLabelActive: {
    color: theme.colors.primary,
    fontWeight: theme.typography.weight.medium,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },
});
