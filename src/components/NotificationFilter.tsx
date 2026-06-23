import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NotificationFilterValue } from '../types';
import { theme } from '../theme';

interface NotificationFilterProps {
  value: NotificationFilterValue;
  onChange: (value: NotificationFilterValue) => void;
}

const filters: Array<{ label: string; value: NotificationFilterValue }> = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'Read', value: 'read' },
];

export const NotificationFilter: React.FC<NotificationFilterProps> = ({
  value,
  onChange,
}) => (
  <View style={styles.container}>
    {filters.map((filter) => {
      const selected = filter.value === value;
      return (
        <TouchableOpacity
          key={filter.value}
          style={[styles.option, selected && styles.optionSelected]}
          onPress={() => onChange(filter.value)}
          accessibilityRole="button"
          accessibilityState={{ selected }}
        >
          <Text style={[styles.label, selected && styles.labelSelected]}>{filter.label}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: theme.spacing.xs,
    margin: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.border,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
  },
  optionSelected: {
    backgroundColor: theme.colors.background,
    ...theme.shadows.sm,
  },
  label: {
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  labelSelected: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
