import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { AttendanceStudent } from '../types';
import { AttendanceStatusChip } from './AttendanceStatusChip';

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
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  studentInfo: {
    marginBottom: theme.spacing.sm,
  },
  studentName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  rollNumber: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  statusChips: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
