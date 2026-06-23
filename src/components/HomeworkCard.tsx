import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { HomeworkItem } from '../types';

interface HomeworkCardProps {
  homework: HomeworkItem;
  onPress: () => void;
}

export const HomeworkCard: React.FC<HomeworkCardProps> = ({ homework, onPress }) => {
  const getStatusColor = () => {
    switch (homework.status) {
      case 'pending':
        return theme.colors.warning;
      case 'submitted':
        return theme.colors.success;
      case 'overdue':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const statusColor = getStatusColor();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {homework.title}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {homework.status.charAt(0).toUpperCase() + homework.status.slice(1)}
          </Text>
        </View>
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
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
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
    width: 60,
  },
  detailValue: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium,
  },
});
