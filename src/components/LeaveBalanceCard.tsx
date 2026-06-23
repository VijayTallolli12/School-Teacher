import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { LeaveBalance } from '../types';

interface LeaveBalanceCardProps {
  balances: LeaveBalance[];
}

export const LeaveBalanceCard: React.FC<LeaveBalanceCardProps> = ({ balances }) => {
  if (balances.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leave Balance</Text>
      <View style={styles.grid}>
        {balances.map((balance) => {
          const percentage =
            balance.total > 0
              ? Math.round((balance.used / balance.total) * 100)
              : 0;

          return (
            <View key={balance.leaveTypeId} style={styles.card}>
              <Text style={styles.leaveTypeName} numberOfLines={1}>
                {balance.leaveTypeName}
              </Text>
              <View style={styles.balanceRow}>
                <Text style={styles.remainingValue}>{balance.remaining}</Text>
                <Text style={styles.totalValue}>/ {balance.total}</Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor:
                        percentage >= 80
                          ? theme.colors.error
                          : percentage >= 50
                          ? theme.colors.warning
                          : theme.colors.secondary,
                    },
                  ]}
                />
              </View>
              <Text style={styles.usedText}>{balance.used} used</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
  },
  leaveTypeName: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: theme.spacing.sm,
  },
  remainingValue: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  totalValue: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    marginLeft: 2,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 2,
    marginBottom: theme.spacing.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  usedText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
  },
});
