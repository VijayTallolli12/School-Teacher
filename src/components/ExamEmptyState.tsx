import React from 'react';
import { EmptyState } from './EmptyState';

interface ExamEmptyStateProps {
  message?: string;
}

export const ExamEmptyState: React.FC<ExamEmptyStateProps> = ({
  message = 'No exams or assessments scheduled.',
}) => {
  return (
    <EmptyState
      icon="school-outline"
      title="No Exams"
      message={message}
    />
  );
};
