import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme';

type TimetableMode = 'today' | 'week';

interface TimetableHeaderProps {
  mode: TimetableMode;
  onModeChange: (mode: TimetableMode) => void;
  dayInfo?: string;
}

export const TimetableHeader: React.FC<TimetableHeaderProps> = ({
  mode,
  onModeChange,
  dayInfo,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, mode === 'today' && styles.activeToggle]}
          onPress={() => onModeChange('today')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.toggleText,
              mode === 'today' && styles.activeToggleText,
            ]}
          >
            Today
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, mode === 'week' && styles.activeToggle]}
          onPress={() => onModeChange('week')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.toggleText,
              mode === 'week' && styles.activeToggleText,
            ]}
          >
            Week
          </Text>
        </TouchableOpacity>
      </View>
      {dayInfo && <Text style={styles.dayInfo}>{dayInfo}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.radius.sm,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs + 2,
    borderRadius: theme.radius.xs + 2,
  },
  activeToggle: {
    backgroundColor: theme.colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textSecondary,
  },
  activeToggleText: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  dayInfo: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
});
