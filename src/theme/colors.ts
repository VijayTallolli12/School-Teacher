export const colors = {
  primary: '#4F46E5',
  primaryDark: '#4338CA',
  primaryLight: '#818CF8',
  secondary: '#10B981',
  secondaryDark: '#059669',
  secondaryLight: '#34D399',
  background: '#FFFFFF',
  backgroundSecondary: '#F3F4F6',
  text: '#111827',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  border: '#E5E7EB',
  error: '#EF4444',
  errorDark: '#DC2626',
  warning: '#F59E0B',
  warningDark: '#D97706',
  success: '#10B981',
  successDark: '#059669',
  info: '#3B82F6',
  infoDark: '#2563EB',
} as const;

export type Colors = typeof colors;
