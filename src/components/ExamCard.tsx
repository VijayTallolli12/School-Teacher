import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppCard } from './AppCard';
import { ExamStatusBadge } from './ExamStatusBadge';
import { theme } from '../theme';
import { ExamItem } from '../types';

interface ExamCardProps {
  exam: ExamItem;
  onPress?: () => void;
}

export const ExamCard: React.FC<ExamCardProps> = ({ exam, onPress }) => {
  return (
    <AppCard variant="interactive" onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.name}>{exam.name}</Text>
          <ExamStatusBadge status={exam.status} />
        </View>
        <Text style={styles.marks}>{exam.totalMarks} marks</Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="book-outline" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.detailText}>{exam.subject}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="school-outline" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.detailText}>{exam.className} - {exam.section}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.detailText}>{exam.date}</Text>
        </View>
      </View>

      {exam.resultPublished && (
        <View style={styles.publishedBanner}>
          <Ionicons name="checkmark-circle" size={14} color={theme.colors.success} />
          <Text style={styles.publishedText}>Results Published</Text>
        </View>
      )}
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  headerLeft: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  name: {
    ...theme.typography.hierarchy.body,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text,
  },
  marks: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
    marginTop: 2,
  },
  details: {
    gap: theme.spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.textSecondary,
  },
  publishedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  publishedText: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.success,
    fontWeight: theme.typography.weight.medium,
  },
});
