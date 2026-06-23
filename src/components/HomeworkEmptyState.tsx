import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface HomeworkEmptyStateProps {
  message?: string;
}

export const HomeworkEmptyState: React.FC<HomeworkEmptyStateProps> = ({
  message = 'No homework assigned yet',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📝</Text>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.submessage}>Create your first homework assignment</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  icon: {
    fontSize: 80,
    marginBottom: theme.spacing.lg,
  },
  message: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  submessage: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
