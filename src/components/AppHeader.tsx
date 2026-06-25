import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { theme } from '../theme';
import { NotificationBadge } from './NotificationBadge';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  showNotification?: boolean;
  unreadCount?: number;
  variant?: 'primary' | 'secondary';
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  rightComponent,
  showNotification = false,
  unreadCount = 0,
  variant = 'primary',
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + (variant === 'primary' ? 10 : 8) }]}>
      {showBackButton && (
        <TouchableOpacity
          onPress={onBackPress}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={22} color="#4F46E5" />
        </TouchableOpacity>
      )}
      <View style={styles.titleContainer}>
        <Text style={[styles.title, variant === 'secondary' && styles.titleSecondary]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {(showNotification || rightComponent) && (
        <View style={styles.rightContainer}>
          {showNotification ? (
            <TouchableOpacity
              style={styles.notificationButton}
              activeOpacity={0.7}
              onPress={() => router.push("/(tabs)/notifications" as any)}
              accessibilityLabel="Notifications"
            >
              <Ionicons name="notifications-outline" size={20} color="#64748B" />
              {unreadCount > 0 && (
                <View style={styles.badgeContainer}>
                  <NotificationBadge count={unreadCount} />
                </View>
              )}
            </TouchableOpacity>
          ) : null}
          {rightComponent}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    backgroundColor: '#ffffff00',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    minHeight: 56,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '700',
    color: '#0F172A',
  },
  titleSecondary: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  rightContainer: {
    minWidth: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexShrink: 1,
  },
  backButton: {
    width: 44,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 9999,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: -2,
    right: -2,
  },
});
