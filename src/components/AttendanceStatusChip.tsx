import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme';

type AttendanceStatus = 'present' | 'absent' | 'late';

interface AttendanceStatusChipProps {
  status: AttendanceStatus;
  selected: boolean;
  onPress: () => void;
}

export const AttendanceStatusChip: React.FC<AttendanceStatusChipProps> = ({
  status,
  selected,
  onPress,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'present':
        return {
          label: 'Present',
          color: theme.colors.success,
          backgroundColor: selected ? theme.colors.success : theme.colors.background,
          textColor: selected ? theme.colors.background : theme.colors.success,
        };
      case 'absent':
        return {
          label: 'Absent',
          color: theme.colors.error,
          backgroundColor: selected ? theme.colors.error : theme.colors.background,
          textColor: selected ? theme.colors.background : theme.colors.error,
        };
      case 'late':
        return {
          label: 'Late',
          color: theme.colors.warning,
          backgroundColor: selected ? theme.colors.warning : theme.colors.background,
          textColor: selected ? theme.colors.background : theme.colors.warning,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.color,
        },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, { color: config.textColor }]}>
        {config.label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    minWidth: 80,
    alignItems: 'center',
  },
  chipText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
