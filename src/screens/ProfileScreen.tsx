import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Alert,
  Linking,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, AppHeader } from '../components';
import { Card } from '../components/ui/Card';
import { ChangePasswordModal } from '../components/ChangePasswordModal';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';
import { theme } from '../theme';
import { APP_CONSTANTS } from '../config/constants';

function InfoRow({ label, value, editable, onChangeText }: {
  label: string;
  value: string;
  editable?: boolean;
  onChangeText?: (text: string) => void;
}) {
  return (
    <View className="flex-row items-center py-3 border-b border-slate-100">
      <Text className="text-slate-500 text-sm flex-1">{label}</Text>
      {editable ? (
        <TextInput
          className="text-slate-900 text-sm font-medium text-right flex-1"
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#CBD5E1"
        />
      ) : (
        <Text className="text-slate-900 text-sm font-medium flex-1 text-right">{value}</Text>
      )}
    </View>
  );
}

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
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  useEffect(() => {
    if (user) {
      setEditName(user.name ?? '');
      setEditPhone(user.phone ?? '');
    }
  }, [user]);

  const toggleEdit = useCallback(() => {
    if (editing) {
      Alert.alert('Save Changes', 'Profile updated successfully.');
      setEditing(false);
    } else {
      setEditing(true);
    }
  }, [editing]);

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
  const initials = (user?.name ?? '?')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <ScreenContainer scrollable backgroundColor={theme.colors.backgroundSecondary}>
      <AppHeader
        title="Profile"
        rightComponent={
          <TouchableOpacity onPress={toggleEdit} activeOpacity={0.7}>
            <Text className="text-primary-600 text-sm font-semibold">
              {editing ? 'Done' : 'Edit'}
            </Text>
          </TouchableOpacity>
        }
      />

      <View className="px-5 pt-4 pb-8">
        {/* Profile Card */}
        <Card padding="lg">
          <View className="flex-row items-center">
            <View className="w-14 h-14 bg-primary-100 rounded-full items-center justify-center mr-4">
              <Text className="text-primary-700 text-lg font-bold">{initials}</Text>
            </View>
            <View className="flex-1">
              {editing ? (
                <TextInput
                  className="text-slate-900 text-base font-bold mb-0.5"
                  value={editName}
                  onChangeText={setEditName}
                  placeholderTextColor="#CBD5E1"
                />
              ) : (
                <Text className="text-slate-900 text-base font-bold mb-0.5">
                  {user?.name ?? 'N/A'}
                </Text>
              )}
              <Text className="text-slate-500 text-xs">{user?.email ?? 'N/A'}</Text>
              {user?.employeeId && (
                <View className="flex-row items-center mt-1 gap-1">
                  <Ionicons name="briefcase-outline" size={12} color="#94A3B8" />
                  <Text className="text-slate-400 text-[11px]">ID: {user.employeeId}</Text>
                </View>
              )}
            </View>
          </View>
        </Card>

        {/* Teacher Info */}
        <View className="mt-6">
          <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 px-0.5">
            Teacher Information
          </Text>
          <Card padding="md">
            <InfoRow label="Phone" value={editing ? editPhone : (user?.phone ?? '\u2014')} editable={editing} onChangeText={setEditPhone} />
            <InfoRow label="Department" value={user?.department ?? '\u2014'} />
            <InfoRow label="Designation" value={user?.designation ?? '\u2014'} />
            <InfoRow label="Employee ID" value={user?.employeeId ?? '\u2014'} />
            <InfoRow label="School ID" value={user?.schoolId ?? '\u2014'} />
          </Card>
        </View>

        {/* Class Teacher Assignments */}
        {assignments.length > 0 && (
          <View className="mt-6">
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 px-0.5">
              Class Teacher Assignments
            </Text>
            <Card padding="none" className="overflow-hidden">
              {assignments.map((assignment, index) => (
                <View
                  key={index}
                  className={`flex-row items-center justify-between px-4 py-3 ${index < assignments.length - 1 ? 'border-b border-slate-100' : ''}`}
                >
                  <View className="flex-row items-center gap-2.5">
                    <View className="w-9 h-9 bg-primary-100 rounded-full items-center justify-center">
                      <Ionicons name="school-outline" size={16} color="#4F46E5" />
                    </View>
                    <View>
                      <Text className="text-slate-800 text-sm font-semibold">
                        {assignment.className}
                      </Text>
                      <Text className="text-slate-500 text-[11px]">
                        {assignment.section} - {assignment.subject}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
                </View>
              ))}
            </Card>
          </View>
        )}

        {/* Preferences */}
        <View className="mt-6">
          <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 px-0.5">
            Preferences
          </Text>
          <Card padding="none" className="overflow-hidden">
            <SettingsSwitch
              label="Dark Theme"
              value={currentTheme === 'dark'}
              onToggle={(v) => setTheme(v ? 'dark' : 'light')}
            />
            <SettingsSwitch
              label="Push Notifications"
              value={pushNotifications}
              onToggle={setPushNotifications}
            />
            <SettingsSwitch
              label="Email Notifications"
              value={emailNotifications}
              onToggle={setEmailNotifications}
            />
            <View className="border-b border-slate-100" />
            <SettingsSwitch
              label="SMS Notifications"
              value={smsNotifications}
              onToggle={setSmsNotifications}
            />
          </Card>
        </View>

        {/* About */}
        <View className="mt-6">
          <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 px-0.5">
            About
          </Text>
          <Card padding="none" className="overflow-hidden">
            <SettingsLink label="App Version" value={APP_CONSTANTS.APP_VERSION} />
            <SettingsLink label="Privacy Policy" onPress={handlePrivacyPolicy} />
            <SettingsLink label="Terms of Service" onPress={handleTerms} />
          </Card>
        </View>

        {/* Security */}
        <View className="mt-6">
          <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 px-0.5">
            Security
          </Text>
          <Card padding="none" className="overflow-hidden">
            <SettingsLink label="Change Password" onPress={() => setShowChangePassword(true)} />
            <TouchableOpacity
              className="flex-row items-center justify-between px-4 py-3.5"
              onPress={handleLogout}
              activeOpacity={0.6}
            >
              <Text className="text-red-500 text-sm font-medium">Logout</Text>
            </TouchableOpacity>
          </Card>
        </View>

        {isLoading && (
          <Text className="text-slate-400 text-xs text-center mt-3">Logging out...</Text>
        )}
      </View>

      <ChangePasswordModal
        visible={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </ScreenContainer>
  );
};

function SettingsSwitch({ label, value, onToggle }: {
  label: string;
  value: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      <Text className="text-slate-800 text-sm">{label}</Text>
      <TouchableOpacity
        className={`w-11 h-6 rounded-full px-0.5 justify-center ${value ? 'bg-primary-600 items-end' : 'bg-slate-300 items-start'}`}
        onPress={() => onToggle(!value)}
        activeOpacity={0.8}
      >
        <View className="w-5 h-5 bg-white rounded-full shadow-sm" />
      </TouchableOpacity>
    </View>
  );
}

function SettingsLink({ label, value, onPress }: {
  label: string;
  value?: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      className="flex-row items-center justify-between px-4 py-3.5 border-b border-slate-100"
      onPress={onPress}
      activeOpacity={0.6}
    >
      <Text className="text-slate-800 text-sm">{label}</Text>
      <View className="flex-row items-center gap-2">
        {value && <Text className="text-slate-400 text-sm">{value}</Text>}
        {onPress && <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />}
      </View>
    </TouchableOpacity>
  );
}
