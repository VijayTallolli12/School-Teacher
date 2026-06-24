import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppButton, AppCard, ScreenContainer, AppHeader, EmptyState } from '../components';
import { theme } from '../theme';
import { AppStackParamList } from '../types';

type DetailRouteProp = RouteProp<AppStackParamList, 'PeriodDetail'>;
type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export const PeriodDetailScreen: React.FC = () => {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const period = route.params?.period;

  const handleMarkAttendance = useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'Attendance' });
  }, [navigation]);

  const handleAssignHomework = useCallback(() => {
    if (!period) return;
    navigation.navigate('HomeworkCreate', {
      initialData: {
        title: '',
        description: '',
        subject: period?.subject ?? '',
        class: period?.className ?? '',
        section: period?.section ?? '',
        dueDate: '',
      },
    });
  }, [navigation, period]);

  if (!period) {
    return (
      <ScreenContainer>
        <AppHeader title="Period Detail" showBackButton onBackPress={() => navigation.goBack()} />
        <EmptyState
          icon="alert-circle-outline"
          title="Period not found"
          message="The period details could not be loaded."
        />
      </ScreenContainer>
    );
  }

  const subject = period?.subject ?? 'Unnamed Period';
  const periodNumber = period?.periodNumber ?? '?';
  const className = period?.className ?? '';
  const section = period?.section ?? '';
  const teacher = period?.teacher ?? 'Not assigned';
  const room = period?.room ?? 'Room Not Assigned';
  const startTime = period?.startTime ?? '--:--';
  const endTime = period?.endTime ?? '--:--';
  const studentCount = period?.studentCount ?? 0;

  return (
    <ScreenContainer scrollable>
      <AppHeader title="Period Detail" showBackButton onBackPress={() => navigation.goBack()} />

      <View style={styles.content}>
        <AppCard variant="elevated">
          <View style={styles.subjectHeader}>
            <View style={styles.subjectIcon}>
              <Text style={styles.subjectIconText}>
                {subject.charAt(0) ?? '?'}
              </Text>
            </View>
            <View style={styles.subjectInfo}>
              <Text style={styles.subjectName}>{subject}</Text>
              <Text style={styles.periodLabel}>
                Period {periodNumber}
              </Text>
            </View>
          </View>
        </AppCard>

        <AppCard variant="default" style={styles.detailsCard}>
          <DetailRow label="Class" value={className + (section ? ` - ${section}` : '')} />
          <DetailRow label="Teacher" value={teacher} />
          <DetailRow label="Room" value={room} />
          <DetailRow label="Time" value={`${startTime} - ${endTime}`} />
          <DetailRow label="Students" value={`${studentCount} enrolled`} />
        </AppCard>

        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <AppButton
              title="Mark Attendance"
              variant="secondary"
              leftIcon={<Ionicons name="clipboard-outline" size={20} color={theme.colors.primary} />}
              onPress={handleMarkAttendance}
              style={styles.actionButton}
            />
            <AppButton
              title="Assign Homework"
              variant="secondary"
              leftIcon={<Ionicons name="create-outline" size={20} color={theme.colors.secondary} />}
              onPress={handleAssignHomework}
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};

interface DetailRowProps {
  label: string;
  value: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  content: {
    padding: theme.spacing.md,
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  subjectIconText: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.background,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    ...theme.typography.hierarchy.heading,
    color: theme.colors.text,
    marginBottom: 2,
  },
  periodLabel: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textSecondary,
  },
  detailsCard: {
    marginBottom: theme.spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md - 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  detailLabel: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textSecondary,
  },
  detailValue: {
    ...theme.typography.hierarchy.bodySmall,
    fontWeight: theme.typography.weight.medium,
    color: theme.colors.text,
    textAlign: 'right',
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  actionsSection: {
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
  actionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});
