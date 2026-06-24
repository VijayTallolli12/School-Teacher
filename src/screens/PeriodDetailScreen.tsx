import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppButton, AppCard, ScreenContainer, AppHeader } from '../components';
import { theme } from '../theme';
import { AppStackParamList } from '../types';

type DetailRouteProp = RouteProp<AppStackParamList, 'PeriodDetail'>;
type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export const PeriodDetailScreen: React.FC = () => {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { period } = route.params;

  const handleMarkAttendance = useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'Attendance' });
  }, [navigation]);

  const handleAssignHomework = useCallback(() => {
    navigation.navigate('HomeworkCreate', {
      initialData: {
        title: '',
        description: '',
        subject: period.subject,
        class: period.className,
        section: period.section,
        dueDate: '',
      },
    });
  }, [navigation, period]);

  return (
    <ScreenContainer scrollable>
      <AppHeader title="Period Detail" showBackButton onBackPress={() => navigation.goBack()} />

      <View style={styles.content}>
        {/* Subject header */}
        <AppCard variant="elevated">
          <View style={styles.subjectHeader}>
            <View style={styles.subjectIcon}>
              <Text style={styles.subjectIconText}>
                {period.subject.charAt(0)}
              </Text>
            </View>
            <View style={styles.subjectInfo}>
              <Text style={styles.subjectName}>{period.subject}</Text>
              <Text style={styles.periodLabel}>
                Period {period.periodNumber}
              </Text>
            </View>
          </View>
        </AppCard>

        {/* Details card */}
        <AppCard variant="default" style={styles.detailsCard}>
          <DetailRow label="Class" value={`${period.className} - ${period.section}`} />
          <DetailRow label="Teacher" value={period.teacher} />
          <DetailRow label="Room" value={period.room} />
          <DetailRow label="Time" value={`${period.startTime} - ${period.endTime}`} />
          <DetailRow label="Students" value={`${period.studentCount} enrolled`} />
        </AppCard>

        {/* Quick Actions */}
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
