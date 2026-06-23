import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer, AppHeader } from '../components';
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

        {/* Details card */}
        <View style={styles.detailsCard}>
          <DetailRow label="Class" value={`${period.className} - ${period.section}`} />
          <DetailRow label="Teacher" value={period.teacher} />
          <DetailRow label="Room" value={period.room} />
          <DetailRow label="Time" value={`${period.startTime} - ${period.endTime}`} />
          <DetailRow label="Students" value={`${period.studentCount} enrolled`} />
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.attendanceAction]}
              onPress={handleMarkAttendance}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>📋</Text>
              <Text style={styles.actionLabel}>Mark{'\n'}Attendance</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.homeworkAction]}
              onPress={handleAssignHomework}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>📝</Text>
              <Text style={styles.actionLabel}>Assign{'\n'}Homework</Text>
            </TouchableOpacity>
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
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  periodLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  detailsCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md - 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  detailLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  detailValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    textAlign: 'right',
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  actionsSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
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
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 90,
  },
  attendanceAction: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  homeworkAction: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: theme.spacing.sm,
  },
  actionLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 18,
  },
});
