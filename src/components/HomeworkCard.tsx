import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppCard } from './AppCard';
import { theme } from '../theme';
import { HomeworkItem } from '../types';
import { getHomeworkStatusLabel, getHomeworkStatusColor } from '../utils/homework';
import { HomeworkStatusBadge } from './HomeworkStatusBadge';

interface HomeworkCardProps {
  homework: HomeworkItem;
  onPress: () => void;
}

export const HomeworkCard: React.FC<HomeworkCardProps> = ({ homework, onPress }) => {
  const statusLabel = getHomeworkStatusLabel(homework);
  const statusColor = getHomeworkStatusColor(statusLabel);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <AppCard variant="interactive" onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {homework.title}
        </Text>
        <HomeworkStatusBadge label={statusLabel} color={statusColor} />
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons name="school-outline" size={14} color={theme.colors.textSecondary} style={styles.detailIcon} />
          <Text style={styles.detailLabel}>Class:</Text>
          <Text style={styles.detailValue}>{homework.class} - {homework.section}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="book-outline" size={14} color={theme.colors.textSecondary} style={styles.detailIcon} />
          <Text style={styles.detailLabel}>Subject:</Text>
          <Text style={styles.detailValue}>{homework.subject}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="alarm-outline" size={14} color={statusColor} style={styles.detailIcon} />
          <Text style={styles.detailLabel}>Due:</Text>
          <Text style={[styles.detailValue, { color: statusColor }]}> 
            {formatDate(homework.dueDate)}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={14} color={theme.colors.textSecondary} style={styles.detailIcon} />
          <Text style={styles.detailLabel}>Created:</Text>
          <Text style={styles.detailValue}>{formatDate(homework.createdAt)}</Text>
        </View>
      </View>
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
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  title: {
    flex: 1,
    ...theme.typography.hierarchy.body,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  details: {
    gap: theme.spacing.xs,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: theme.spacing.xs,
    width: 16,
  },
  detailLabel: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textSecondary,
    width: 65,
    fontWeight: theme.typography.weight.medium,
  },
  detailValue: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.text,
    fontWeight: theme.typography.weight.medium,
    flex: 1,
  },
});
