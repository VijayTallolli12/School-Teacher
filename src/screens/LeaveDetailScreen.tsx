import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenContainer, AppHeader } from '../components';
import { LeaveStatusBadge } from '../components/LeaveStatusBadge';
import { LeaveTimeline } from '../components/LeaveTimeline';
import { useLeaveDetail, useCancelLeave } from '../hooks/useLeave';
import { theme } from '../theme';
import { AppStackParamList } from '../types';

type DetailRouteProp = RouteProp<AppStackParamList, 'LeaveDetail'>;

export const LeaveDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<DetailRouteProp>();
  const { leaveId } = route.params;

  const {
    data: leave,
    isLoading,
    isError,
    refetch,
  } = useLeaveDetail(leaveId);

  const cancelMutation = useCancelLeave();

  const handleCancel = useCallback(() => {
    Alert.alert(
      'Cancel Leave',
      'Are you sure you want to cancel this leave request?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelMutation.mutateAsync(leaveId);
              Alert.alert('Success', 'Leave request cancelled.', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error: any) {
              const message =
                error.response?.data?.message || 'Failed to cancel leave';
              Alert.alert('Error', message);
            }
          },
        },
      ]
    );
  }, [cancelMutation, leaveId, navigation]);

  if (isLoading) {
    return (
      <ScreenContainer>
        <AppHeader
          title="Leave Detail"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  if (isError || !leave) {
    return (
      <ScreenContainer>
        <AppHeader
          title="Leave Detail"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.centeredContainer}>
          <Text style={styles.errorText}>Could not load leave details</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable>
      <AppHeader
        title="Leave Detail"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.leaveType}>{leave.leaveType}</Text>
            <LeaveStatusBadge status={leave.status} />
          </View>
          <Text style={styles.daysLabel}>
            {leave.days} day{leave.days > 1 ? 's' : ''}
          </Text>
        </View>

        {/* Info card */}
        <View style={styles.infoCard}>
          <InfoRow label="From" value={leave.fromDate} />
          <InfoRow label="To" value={leave.toDate} />
          <InfoRow label="Days" value={String(leave.days)} />
          <InfoRow label="Applied On" value={leave.appliedDate} />
          {leave.approver && <InfoRow label="Approver" value={leave.approver} />}
          {leave.approvalDate && (
            <InfoRow label="Approval Date" value={leave.approvalDate} />
          )}
        </View>

        {/* Reason */}
        {leave.reason && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reason</Text>
            <View style={styles.reasonCard}>
              <Text style={styles.reasonText}>{leave.reason}</Text>
            </View>
          </View>
        )}

        {/* Remarks */}
        {leave.remarks && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Remarks</Text>
            <View style={styles.remarksCard}>
              <Text style={styles.remarksText}>{leave.remarks}</Text>
            </View>
          </View>
        )}

        {/* Timeline */}
        {leave.timeline && leave.timeline.length > 0 && (
          <View style={styles.section}>
            <LeaveTimeline entries={leave.timeline} />
          </View>
        )}

        {/* Cancel action */}
        {leave.status === 'pending' && (
          <TouchableOpacity
            style={[
              styles.cancelButton,
              cancelMutation.isPending && styles.cancelButtonDisabled,
            ]}
            onPress={handleCancel}
            disabled={cancelMutation.isPending}
            activeOpacity={0.7}
          >
            {cancelMutation.isPending ? (
              <ActivityIndicator color={theme.colors.error} size="small" />
            ) : (
              <Text style={styles.cancelButtonText}>Cancel Request</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </ScreenContainer>
  );
};

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  content: {
    padding: theme.spacing.md,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  retryButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primary,
  },
  retryText: {
    color: theme.colors.background,
    fontWeight: theme.typography.fontWeight.bold,
    fontSize: theme.typography.fontSize.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  headerLeft: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  leaveType: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  daysLabel: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginLeft: theme.spacing.md,
  },
  infoCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  infoLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    textAlign: 'right',
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
  reasonCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
  },
  reasonText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    lineHeight: 20,
  },
  remarksCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
    padding: theme.spacing.md,
  },
  remarksText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    lineHeight: 20,
  },
  cancelButton: {
    paddingVertical: theme.spacing.md - 2,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.error,
    backgroundColor: theme.colors.background,
    marginBottom: theme.spacing.xxl,
  },
  cancelButtonDisabled: {
    opacity: 0.6,
  },
  cancelButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.error,
  },
});
