import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '../theme';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface DaySelectorProps {
  selectedDay: string;
  onSelectDay: (day: string) => void;
  availableDays?: string[];
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  selectedDay,
  onSelectDay,
  availableDays,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {DAYS.map((day) => {
          const isSelected = selectedDay === day;
          const hasData = !availableDays || availableDays.includes(day);

          return (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayTab,
                isSelected && styles.selectedTab,
                !hasData && styles.disabledTab,
              ]}
              onPress={() => hasData && onSelectDay(day)}
              activeOpacity={hasData ? 0.7 : 1}
            >
              <Text
                style={[
                  styles.dayLabel,
                  isSelected && styles.selectedLabel,
                  !hasData && styles.disabledLabel,
                ]}
              >
                {day.slice(0, 3)}
              </Text>
              {hasData && (
                <View
                  style={[
                    styles.dot,
                    isSelected && styles.selectedDot,
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  dayTab: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minWidth: 56,
  },
  selectedTab: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  disabledTab: {
    opacity: 0.4,
  },
  dayLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  selectedLabel: {
    color: theme.colors.background,
  },
  disabledLabel: {
    color: theme.colors.textLight,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
  },
  selectedDot: {
    backgroundColor: theme.colors.background,
  },
});
