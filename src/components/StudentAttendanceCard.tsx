import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { AttendanceStudent } from '../types';
import { AttendanceStatusChip } from './AttendanceStatusChip';
import { AppCard } from './AppCard';

type AttendanceStatus = 'present' | 'absent' | 'late';

interface StudentAttendanceCardProps {
  student: AttendanceStudent;
  status: AttendanceStatus | null;
  onStatusChange: (status: AttendanceStatus) => void;
}

export const StudentAttendanceCard: React.FC<StudentAttendanceCardProps> = ({
  student,
  status,
  onStatusChange,
}) => {
  return (
    <AppCard variant="default" style={styles.card} contentStyle={styles.cardContent}>
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{student.name}</Text>
        <Text style={styles.rollNumber}>Roll: {student.rollNumber}</Text>
      </View>
      <View style={styles.statusChips}>
        <AttendanceStatusChip
          status="present"
          selected={status === 'present'}
          onPress={() => onStatusChange('present')}
        />
        <AttendanceStatusChip
          status="absent"
          selected={status === 'absent'}
          onPress={() => onStatusChange('absent')}
        />
        <AttendanceStatusChip
          status="late"
          selected={status === 'late'}
          onPress={() => onStatusChange('late')}
        />
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.sm,
  },
  cardContent: {
    padding: theme.spacing.md,
  },
  studentInfo: {
    marginBottom: theme.spacing.sm,
  },
  studentName: {
    ...theme.typography.hierarchy.body,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  rollNumber: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.textSecondary,
  },
  statusChips: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
