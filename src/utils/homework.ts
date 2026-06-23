import { HomeworkItem } from '../types';
import { theme } from '../theme';

export type HomeworkStatusLabel = 'Upcoming' | 'Due Today' | 'Overdue' | 'Completed';

export const getHomeworkStatusLabel = (homework: HomeworkItem): HomeworkStatusLabel => {
  if (homework.status === 'submitted') {
    return 'Completed';
  }

  if (homework.status === 'overdue') {
    return 'Overdue';
  }

  const dueDate = new Date(homework.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  if (dueDate.getTime() === today.getTime()) {
    return 'Due Today';
  }

  return 'Upcoming';
};

export const getHomeworkStatusColor = (statusLabel: HomeworkStatusLabel): string => {
  switch (statusLabel) {
    case 'Upcoming':
      return theme.colors.warning;
    case 'Due Today':
      return theme.colors.warning;
    case 'Overdue':
      return theme.colors.error;
    case 'Completed':
      return theme.colors.success;
    default:
      return theme.colors.textSecondary;
  }
};
