import React from 'react';
import { EmptyState } from './EmptyState';

interface EmptyTimetableStateProps {
  message?: string;
  isWeekView?: boolean;
}

export const EmptyTimetableState: React.FC<EmptyTimetableStateProps> = ({
  message,
  isWeekView = false,
}) => (
  <EmptyState
    icon="calendar-outline"
    title={isWeekView ? 'No classes this week' : 'No classes today'}
    message={message}
  />
);
