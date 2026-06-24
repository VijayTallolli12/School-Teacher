import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenContainer, AppHeader } from '../components';
import { LeaveStatusBadge } from '../components/LeaveStatusBadge';
import { LeaveTimeline } from '../components/LeaveTimeline';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
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
          <Ionicons name="alert-circle-outline" size={48} color={theme.colors.textLight} />
          <Text style={styles.errorText}>Could not load leave details</Text>
          <AppButton title="Retry" variant="primary" onPress={() => refetch()} />
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
        <AppCard variant="default" contentStyle={styles.infoCardContent}>
          <InfoRow icon="calendar-outline" label="From" value={leave.fromDate} />
          <InfoRow icon="calendar-outline" label="To" value={leave.toDate} />
          <InfoRow icon="bar-chart-outline" label="Days" value={String(leave.days)} />
          <InfoRow icon="create-outline" label="Applied On" value={leave.appliedDate} />
          {leave.approver && <InfoRow icon="person-outline" label="Approver" value={leave.approver} />}
          {leave.approvalDate && (
            <InfoRow icon="calendar-outline" label="Approval Date" value={leave.approvalDate} />
          )}
        </AppCard>

        {/* Reason */}
        {leave.reason && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="create-outline" size={14} color={theme.colors.textLight} /> Reason
            </Text>
            <AppCard variant="default" contentStyle={styles.reasonCardContent}>
              <Text style={styles.reasonText}>{leave.reason}</Text>
            </AppCard>
          </View>
        )}

        {/* Remarks */}
        {leave.remarks && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="chatbubble-outline" size={14} color={theme.colors.textLight} /> Remarks
            </Text>
            <AppCard variant="default" contentStyle={styles.remarksCardContent}>
              <Text style={styles.remarksText}>{leave.remarks}</Text>
            </AppCard>
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
          <AppButton
            title="Cancel Request"
            variant="destructive-ghost"
            onPress={handleCancel}
            loading={cancelMutation.isPending}
            style={styles.cancelButton}
            accessibilityLabel="Cancel this leave request"
          />
        )}
      </View>
    </ScreenContainer>
  );
};

interface InfoRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
  <View style={styles.infoRow} accessibilityRole="text" accessibilityLabel={`${label}: ${value}`}>
    <View style={styles.infoLeft}>
      <Ionicons name={icon} size={14} color={theme.colors.textSecondary} />
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
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
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  errorText: {
    ...theme.typography.hierarchy.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
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
    ...theme.typography.hierarchy.heading,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text,
  },
  daysLabel: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.primary,
    marginLeft: theme.spacing.md,
  },
  infoCardContent: {
    padding: 0,
    marginBottom: theme.spacing.lg,
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
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoLabel: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    ...theme.typography.hierarchy.bodySmall,
    fontWeight: theme.typography.weight.medium,
    color: theme.colors.text,
    textAlign: 'right',
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.hierarchy.caption,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
  reasonCardContent: {
    padding: theme.spacing.md,
  },
  reasonText: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.text,
    lineHeight: 20,
  },
  remarksCardContent: {
    padding: theme.spacing.md,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  remarksText: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.text,
    lineHeight: 20,
  },
  cancelButton: {
    marginBottom: theme.spacing.xxl,
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
});
