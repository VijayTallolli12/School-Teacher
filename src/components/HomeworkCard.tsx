import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {homework.title}
        </Text>
        <HomeworkStatusBadge label={statusLabel} color={statusColor} />
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Class:</Text>
          <Text style={styles.detailValue}>{homework.class} - {homework.section}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Subject:</Text>
          <Text style={styles.detailValue}>{homework.subject}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Due:</Text>
          <Text style={[styles.detailValue, { color: statusColor }]}> 
            {formatDate(homework.dueDate)}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Created:</Text>
          <Text style={styles.detailValue}>{formatDate(homework.createdAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
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
  detailLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    width: 70,
    fontWeight: theme.typography.fontWeight.medium,
  },
  detailValue: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium,
  },
});
