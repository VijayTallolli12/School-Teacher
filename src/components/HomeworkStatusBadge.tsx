import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface HomeworkStatusBadgeProps {
  label: string;
  color: string;
}

export const HomeworkStatusBadge: React.FC<HomeworkStatusBadgeProps> = ({ label, color }) => {
  return (
    <View style={[styles.badge, { backgroundColor: `${color}20`, borderColor: color }]}> 
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
