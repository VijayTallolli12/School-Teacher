import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

export const BaseCard: React.FC<CardProps> = ({ children, style, contentStyle }) => (
  <View style={[styles.baseCard, style]}>
    <View style={[styles.baseContent, contentStyle]}>{children}</View>
  </View>
);

export const MetricCard: React.FC<CardProps> = ({ children, style, contentStyle }) => (
  <BaseCard style={[styles.metricCard, style]} contentStyle={[styles.metricContent, contentStyle]}>
    {children}
  </BaseCard>
);

export const ActionCard: React.FC<CardProps> = ({ children, style, contentStyle }) => (
  <BaseCard style={[styles.actionCard, style]} contentStyle={[styles.actionContent, contentStyle]}>
    {children}
  </BaseCard>
);

export const SummaryCard: React.FC<CardProps> = ({ children, style, contentStyle }) => (
  <BaseCard style={[styles.summaryCard, style]} contentStyle={[styles.summaryContent, contentStyle]}>
    {children}
  </BaseCard>
);

const styles = StyleSheet.create({
  baseCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.xs,
  },
  baseContent: {
    padding: theme.spacing.cardPadding,
  },
  metricCard: {
    minHeight: 120,
  },
  metricContent: {
    padding: theme.spacing.cardPadding,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCard: {
    minHeight: 96,
  },
  actionContent: {
    padding: theme.spacing.cardPadding,
  },
  summaryCard: {
    minHeight: 112,
  },
  summaryContent: {
    padding: theme.spacing.cardPadding,
  },
});
