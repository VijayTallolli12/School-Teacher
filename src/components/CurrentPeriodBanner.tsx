import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { PeriodItem } from '../types';

interface CurrentPeriodBannerProps {
  currentPeriod: PeriodItem | null;
  nextPeriod: PeriodItem | null;
  onCurrentPress?: () => void;
}

export const CurrentPeriodBanner: React.FC<CurrentPeriodBannerProps> = ({
  currentPeriod,
  nextPeriod,
  onCurrentPress,
}) => {
  if (!currentPeriod && !nextPeriod) {
    return (
      <View style={styles.container}>
        <Text style={styles.noClassText}>No more classes today</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {currentPeriod ? (
        <TouchableOpacity
          style={styles.currentSection}
          onPress={onCurrentPress}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Current period: ${currentPeriod?.subject ?? 'Unnamed'}`}
        >
          <View style={styles.indicator}>
            <Ionicons name="ellipse" size={12} color={theme.colors.primary} />
            <Text style={styles.indicatorLabel}>NOW</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.subject}>
              {currentPeriod?.subject ?? 'Current Period'}
            </Text>
            <Text style={styles.detail}>
              P{currentPeriod?.periodNumber ?? '?'} · {currentPeriod?.className ?? ''}{currentPeriod?.section ? ` · ${currentPeriod.section}` : ''} · {currentPeriod?.room ?? 'Room Not Assigned'}
            </Text>
            <Text style={styles.time}>
              {currentPeriod?.startTime ?? '--:--'} - {currentPeriod?.endTime ?? '--:--'}
            </Text>
          </View>
        </TouchableOpacity>
      ) : nextPeriod ? (
        <View style={styles.nextSection}>
          <View style={styles.indicator}>
            <Ionicons name="ellipse-outline" size={12} color={theme.colors.secondary} />
            <Text style={styles.indicatorLabel}>NEXT</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.nextSubject}>
              {nextPeriod?.subject ?? 'Next Period'}
            </Text>
            <Text style={styles.detail}>
              P{nextPeriod?.periodNumber ?? '?'} · {nextPeriod?.className ?? ''}{nextPeriod?.section ? ` · ${nextPeriod.section}` : ''} · {nextPeriod?.room ?? 'Room Not Assigned'}
            </Text>
            <Text style={styles.time}>
              Starts at {nextPeriod?.startTime ?? '--:--'}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  currentSection: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: '#EEF2FF',
  },
  nextSection: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: '#F0FDF4',
  },
  indicator: {
    alignItems: 'center',
    marginRight: theme.spacing.md,
    minWidth: 36,
    gap: 2,
  },
  indicatorLabel: {
    fontSize: 9,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textLight,
    letterSpacing: 1,
  },
  info: {
    flex: 1,
  },
  subject: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  nextSubject: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  detail: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: 1,
  },
  time: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
  },
  noClassText: {
    padding: theme.spacing.md,
    textAlign: 'center',
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
});
