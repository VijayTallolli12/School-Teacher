import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
          accessibilityRole="button"
          accessibilityState={{ selected: mode === 'today' }}
        >
          <Ionicons
            name="time-outline"
            size={16}
            color={mode === 'today' ? theme.colors.primary : theme.colors.textSecondary}
          />
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
          accessibilityRole="button"
          accessibilityState={{ selected: mode === 'week' }}
        >
          <Ionicons
            name="calendar-outline"
            size={16}
            color={mode === 'week' ? theme.colors.primary : theme.colors.textSecondary}
          />
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
      {dayInfo && (
        <View style={styles.dayInfoRow}>
          <Ionicons name="calendar-outline" size={14} color={theme.colors.textLight} />
          <Text style={styles.dayInfo}>{dayInfo}</Text>
        </View>
      )}
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
    gap: 2,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs + 2,
    borderRadius: theme.radius.xs + 2,
  },
  activeToggle: {
    backgroundColor: theme.colors.background,
    ...theme.shadows.sm,
  },
  toggleText: {
    ...theme.typography.hierarchy.caption,
    fontWeight: theme.typography.weight.medium,
    color: theme.colors.textSecondary,
  },
  activeToggleText: {
    color: theme.colors.primary,
    fontWeight: theme.typography.weight.bold,
  },
  dayInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  dayInfo: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textLight,
  },
});
