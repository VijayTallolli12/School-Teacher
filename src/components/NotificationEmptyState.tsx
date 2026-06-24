import React from 'react';
import { NotificationFilterValue } from '../types';
import { EmptyState } from './EmptyState';

interface NotificationEmptyStateProps {
  filter: NotificationFilterValue;
}

export const NotificationEmptyState: React.FC<NotificationEmptyStateProps> = ({ filter }) => (
  <EmptyState
    icon="notifications-outline"
    title="No notifications"
    message={
      filter === 'all'
        ? 'New school updates will appear here.'
        : `There are no ${filter} notifications.`
    }
  />
);
