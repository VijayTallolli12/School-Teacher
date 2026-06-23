import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { theme } from '../theme';

interface SettingsItemProps {
  label: string;
  value?: string;
  onPress?: () => void;
  showArrow?: boolean;
  toggle?: boolean;
  onToggle?: (value: boolean) => void;
  destructive?: boolean;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
  label,
  value,
  onPress,
  showArrow = true,
  toggle,
  onToggle,
  destructive = false,
}) => {
  const content = (
    <View style={styles.container}>
      <Text style={[styles.label, destructive && styles.destructiveLabel]}>
        {label}
      </Text>
      <View style={styles.rightContainer}>
        {value && <Text style={styles.value}>{value}</Text>}
        {toggle !== undefined && (
          <Switch
            value={toggle}
            onValueChange={onToggle}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primaryLight,
            }}
            thumbColor={toggle ? theme.colors.primary : '#f4f3f4'}
          />
        )}
        {showArrow && toggle === undefined && (
          <Text style={styles.arrow}>›</Text>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md - 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  label: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    flex: 1,
  },
  destructiveLabel: {
    color: theme.colors.error,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  value: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  arrow: {
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.textLight,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
