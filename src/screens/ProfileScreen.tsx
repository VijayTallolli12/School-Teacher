import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { ScreenContainer, AppHeader } from '../components';
import { ProfileCard } from '../components/ProfileCard';
import { InfoRow } from '../components/InfoRow';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsItem } from '../components/SettingsItem';
import { ChangePasswordModal } from '../components/ChangePasswordModal';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';
import { theme } from '../theme';
import { APP_CONSTANTS } from '../config/constants';

export const ProfileScreen: React.FC = () => {
  const { user, logout, isLoading } = useAuthStore();
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
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  }, [logout]);

  const handlePrivacyPolicy = useCallback(() => {
    Linking.openURL(APP_CONSTANTS.PRIVACY_POLICY_URL).catch(() => {
      Alert.alert('Error', 'Could not open link');
    });
  }, []);

  const handleTerms = useCallback(() => {
    Linking.openURL(APP_CONSTANTS.TERMS_OF_SERVICE_URL).catch(() => {
      Alert.alert('Error', 'Could not open link');
    });
  }, []);

  const assignments = user?.classTeacherAssignments ?? [];

  return (
    <ScreenContainer scrollable backgroundColor={theme.colors.backgroundSecondary}>
      <AppHeader title="Profile" />

      <View style={styles.content}>
        {/* Profile Section */}
        <SettingsSection title="Profile Information">
          <ProfileCard
            name={user?.name ?? 'N/A'}
            email={user?.email ?? 'N/A'}
            employeeId={user?.employeeId}
          />
          <View style={styles.infoRowsContainer}>
            <InfoRow label="Phone" value={user?.phone ?? '—'} />
            <InfoRow label="Department" value={user?.department ?? '—'} />
            <InfoRow label="Designation" value={user?.designation ?? '—'} />
            <InfoRow label="Employee ID" value={user?.employeeId ?? '—'} />
            <InfoRow label="School ID" value={user?.schoolId ?? '—'} />
          </View>
        </SettingsSection>

        {/* Class Teacher Assignments */}
        {assignments.length > 0 && (
          <SettingsSection title="Class Teacher Assignments">
            {assignments.map((assignment, index) => (
              <InfoRow
                key={index}
                label={assignment.className}
                value={`${assignment.section} - ${assignment.subject}`}
              />
            ))}
          </SettingsSection>
        )}

        {/* Settings Section */}
        <SettingsSection title="Preferences">
          <SettingsItem
            label="Dark Theme"
            toggle={currentTheme === 'dark'}
            onToggle={(enabled) => setTheme(enabled ? 'dark' : 'light')}
            showArrow={false}
          />
          <SettingsItem
            label="Push Notifications"
            toggle={pushNotifications}
            onToggle={setPushNotifications}
            showArrow={false}
          />
          <SettingsItem
            label="Email Notifications"
            toggle={emailNotifications}
            onToggle={setEmailNotifications}
            showArrow={false}
          />
          <SettingsItem
            label="SMS Notifications"
            toggle={smsNotifications}
            onToggle={setSmsNotifications}
            showArrow={false}
          />
        </SettingsSection>

        {/* About Section */}
        <SettingsSection title="About">
          <SettingsItem label="App Version" value={APP_CONSTANTS.APP_VERSION} onPress={() => {}} />
          <SettingsItem label="Privacy Policy" onPress={handlePrivacyPolicy} />
          <SettingsItem label="Terms of Service" onPress={handleTerms} />
        </SettingsSection>

        {/* Security Section */}
        <SettingsSection title="Security">
          <SettingsItem
            label="Change Password"
            onPress={() => setShowChangePassword(true)}
          />
          <SettingsItem
            label="Logout"
            onPress={handleLogout}
            destructive
            showArrow={false}
          />
        </SettingsSection>

        {isLoading && (
          <Text style={styles.loggingOut}>Logging out...</Text>
        )}
      </View>

      <ChangePasswordModal
        visible={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  infoRowsContainer: {
    paddingHorizontal: theme.spacing.md,
  },
  loggingOut: {
    textAlign: 'center',
    color: theme.colors.textLight,
    ...theme.typography.hierarchy.caption,
    marginTop: theme.spacing.sm,
  },
});
