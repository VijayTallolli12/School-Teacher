import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AppHeader, ScreenContainer } from '../components';
import { Card } from '../components/ui/Card';
import { useSettingsStore } from '../store/settingsStore';
import { theme } from '../theme';

export const SettingsScreen: React.FC = () => {
  const {
    theme: currentTheme,
    pushNotifications,
    emailNotifications,
    smsNotifications,
    loadPreferences,
    setTheme,
    setPushNotifications,
    setEmailNotifications,
    setSmsNotifications,
  } = useSettingsStore();

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  return (
    <ScreenContainer scrollable={false} backgroundColor={theme.colors.backgroundSecondary}>
      <AppHeader title="Settings" showBackButton onBackPress={() => router.back()} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <Card padding="none" className="overflow-hidden mb-5">
          <SettingsSwitch
            label="Dark Theme"
            icon="moon-outline"
            value={currentTheme === 'dark'}
            onToggle={(value) => setTheme(value ? 'dark' : 'light')}
          />
          <SettingsSwitch
            label="Push Notifications"
            icon="notifications-outline"
            value={pushNotifications}
            onToggle={setPushNotifications}
          />
          <SettingsSwitch
            label="Email Notifications"
            icon="mail-outline"
            value={emailNotifications}
            onToggle={setEmailNotifications}
          />
          <SettingsSwitch
            label="SMS Notifications"
            icon="chatbubble-ellipses-outline"
            value={smsNotifications}
            onToggle={setSmsNotifications}
          />
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
};

function SettingsSwitch({ label, icon, value, onToggle }: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: boolean;
  onToggle: (value: boolean) => void;
}) {
  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={18} color={theme.colors.primary} />
        </View>
        <Text style={styles.itemLabel}>{label}</Text>
      </View>
      <TouchableOpacity
        style={[styles.switchTrack, value && styles.switchTrackActive]}
        onPress={() => onToggle(!value)}
        activeOpacity={0.8}
        accessibilityRole="switch"
        accessibilityState={{ checked: value }}
        accessibilityLabel={label}
      >
        <View style={[styles.switchThumb, value && styles.switchThumbActive]} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: theme.spacing.xxl },
  sectionTitle: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textTertiary,
    fontWeight: theme.typography.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: theme.spacing.sm,
  },
  item: {
    minHeight: 56,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.icon,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primaryLight,
    marginRight: theme.spacing.md,
  },
  itemLabel: { ...theme.typography.hierarchy.bodySmall, color: theme.colors.text, fontWeight: theme.typography.weight.medium },
  switchTrack: {
    width: 44,
    height: 24,
    borderRadius: theme.radius.full,
    backgroundColor: '#CBD5E1',
    padding: 2,
    justifyContent: 'center',
  },
  switchTrackActive: { backgroundColor: theme.colors.primary },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: theme.radius.full,
    backgroundColor: '#FFFFFF',
  },
  switchThumbActive: { alignSelf: 'flex-end' },
});
