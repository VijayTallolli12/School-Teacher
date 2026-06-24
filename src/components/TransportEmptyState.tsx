import React from 'react';
import { EmptyState } from './EmptyState';

interface TransportEmptyStateProps {
  title?: string;
  message?: string;
}

export const TransportEmptyState: React.FC<TransportEmptyStateProps> = ({
  title = 'No Transport Data',
  message = 'No active routes or vehicles found.',
}) => {
  return (
    <EmptyState
      icon="bus-outline"
      title={title}
      message={message}
    />
  );
};
