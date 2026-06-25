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
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  marks: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 12,
    marginTop: 2,
  },
  details: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#64748B',
  },
  publishedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  publishedText: {
    fontSize: 12,
    color: theme.colors.success,
    fontWeight: '500',
  },
});
