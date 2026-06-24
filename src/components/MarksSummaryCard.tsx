import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppCard } from './AppCard';
import { theme } from '../theme';
import { ExamResultSummary } from '../types';

interface MarksSummaryCardProps {
  summary: ExamResultSummary;
}

export const MarksSummaryCard: React.FC<MarksSummaryCardProps> = ({ summary }) => {
  const items = [
    {
      icon: 'people-outline' as const,
      label: 'Appeared',
      value: summary.appeared,
      color: theme.colors.info,
    },
    {
      icon: 'checkmark-circle' as const,
      label: 'Passed',
      value: summary.passed,
      color: theme.colors.success,
    },
    {
      icon: 'close-circle' as const,
      label: 'Failed',
      value: summary.failed,
      color: theme.colors.error,
    },
    {
      icon: 'trophy-outline' as const,
      label: 'Pass %',
      value: `${summary.passPercentage.toFixed(1)}%`,
      color: theme.colors.primary,
    },
  ];

  return (
    <AppCard variant="elevated">
      <Text style={styles.title}>Result Summary</Text>
      <View style={styles.grid}>
        {items.map((item, index) => (
          <View key={index} style={styles.item}>
            <Ionicons name={item.icon} size={20} color={item.color} />
            <Text style={[styles.value, { color: item.color }]}>{item.value}</Text>
            <Text style={styles.label}>{item.label}</Text>
          </View>
        ))}
      </View>
      <View style={styles.extraRow}>
        <View style={styles.extraItem}>
          <Text style={styles.extraLabel}>Total Students</Text>
          <Text style={styles.extraValue}>{summary.totalStudents}</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.extraItem}>
          <Text style={styles.extraLabel}>Highest</Text>
          <Text style={styles.extraValue}>{summary.highestScore}</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.extraItem}>
          <Text style={styles.extraLabel}>Average</Text>
          <Text style={styles.extraValue}>{summary.averageScore.toFixed(1)}</Text>
        </View>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  title: {
    ...theme.typography.hierarchy.body,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  grid: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  value: {
    ...theme.typography.hierarchy.title,
    fontWeight: theme.typography.weight.bold,
  },
  label: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textSecondary,
  },
  extraRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  extraItem: {
    alignItems: 'center',
    gap: 2,
  },
  extraLabel: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textTertiary,
  },
  extraValue: {
    ...theme.typography.hierarchy.body,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text,
  },
  separator: {
    width: 1,
    backgroundColor: theme.colors.border,
  },
});
