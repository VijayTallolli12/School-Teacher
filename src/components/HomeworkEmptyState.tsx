import React from 'react';
import { StyleSheet } from 'react-native';
import { EmptyState } from './EmptyState';
import { theme } from '../theme';

interface HomeworkEmptyStateProps {
  message?: string;
}

export const HomeworkEmptyState: React.FC<HomeworkEmptyStateProps> = ({
  message = 'No homework assigned yet',
}) => {
  return (
    <EmptyState
      icon="create-outline"
      title={message}
      message="Create your first homework assignment"
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
