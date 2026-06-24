import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppCard } from './AppCard';
import { ExamStatusBadge } from './ExamStatusBadge';
import { theme } from '../theme';
import { ExamDetail } from '../types';

interface ExamHeaderProps {
  exam: ExamDetail;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({ exam }) => {
  return (
    <AppCard variant="elevated">
      <View style={styles.topRow}>
        <Text style={styles.name}>{exam.name}</Text>
        <ExamStatusBadge status={exam.status} />
      </View>
      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Ionicons name="book-outline" size={16} color={theme.colors.textSecondary} />
          <View>
            <Text style={styles.detailLabel}>Subject</Text>
            <Text style={styles.detailValue}>{exam.subject}</Text>
          </View>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="school-outline" size={16} color={theme.colors.textSecondary} />
          <View>
            <Text style={styles.detailLabel}>Class</Text>
            <Text style={styles.detailValue}>{exam.className} - {exam.section}</Text>
          </View>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
          <View>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{exam.date}</Text>
          </View>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="stats-chart-outline" size={16} color={theme.colors.textSecondary} />
          <View>
            <Text style={styles.detailLabel}>Marks</Text>
            <Text style={styles.detailValue}>{exam.totalMarks}</Text>
          </View>
        </View>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  name: {
    ...theme.typography.hierarchy.heading,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  detailsGrid: {
    gap: theme.spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  detailLabel: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textTertiary,
  },
  detailValue: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.text,
    fontWeight: theme.typography.weight.medium,
  },
});
