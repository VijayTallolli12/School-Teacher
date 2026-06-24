import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { StudentItem, StudentStatus } from '../types';
import { AppCard } from './AppCard';

interface StudentCardProps {
  student: StudentItem;
  onPress?: () => void;
}

const statusColors: Record<StudentStatus, { bg: string; text: string; label: string }> = {
  active: { bg: '#D1FAE5', text: '#059669', label: 'Active' },
  inactive: { bg: '#FEE2E2', text: '#DC2626', label: 'Inactive' },
  transferred: { bg: '#F3F4F6', text: '#6B7280', label: 'Transferred' },
};

export const StudentCard: React.FC<StudentCardProps> = ({ student, onPress }) => {
  const initials = student.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const status = statusColors[student.status];

  return (
    <AppCard variant="interactive" onPress={onPress} style={styles.card} contentStyle={styles.cardContent}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {student.name}
        </Text>
        <Text style={styles.admissionNo}>ADM: {student.admissionNo}</Text>
        <Text style={styles.classSection}>
          {student.className} - {student.section}
        </Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
        <Text style={[styles.statusText, { color: status.text }]}>
          {status.label}
        </Text>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.sm,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: {
    ...theme.typography.hierarchy.body,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.background,
  },
  info: {
    flex: 1,
  },
  name: {
    ...theme.typography.hierarchy.body,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text,
    marginBottom: 1,
  },
  admissionNo: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textLight,
    marginBottom: 1,
  },
  classSection: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.full,
    marginLeft: theme.spacing.sm,
  },
  statusText: {
    ...theme.typography.hierarchy.caption,
    fontWeight: theme.typography.weight.bold,
  },
});
