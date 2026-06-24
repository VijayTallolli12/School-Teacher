import React from 'react';
import { StyleSheet } from 'react-native';
import { EmptyState } from './EmptyState';

interface LeaveEmptyStateProps {
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const LeaveEmptyState: React.FC<LeaveEmptyStateProps> = ({
  message,
  actionLabel,
  onAction,
}) => {
  return (
    <EmptyState
      icon="clipboard-outline"
      title="No leave records"
      message={message}
      actionLabel={actionLabel}
      onAction={onAction}
      style={styles.empty}
    />
  );
};

const styles = StyleSheet.create({
  empty: {
    paddingVertical: 48,
  },
});
