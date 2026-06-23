import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ScreenContainer, AppHeader } from '../components';
import { useAuthStore } from '../store/authStore';

export const ProfileScreen: React.FC = () => {
  const { user, logout, isLoading } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer>
      <AppHeader title="Profile" />
      <View style={styles.container}>
        <View style={styles.profileCard}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{user?.name || 'N/A'}</Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email || 'N/A'}</Text>

          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{user?.role || 'N/A'}</Text>

          <Text style={styles.label}>School ID</Text>
          <Text style={styles.value}>{user?.schoolId || 'N/A'}</Text>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, isLoading && styles.buttonDisabled]}
          onPress={handleLogout}
          disabled={isLoading}
        >
          <Text style={styles.logoutButtonText}>
            {isLoading ? 'Logging out...' : 'Logout'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
    marginTop: 16,
  },
  value: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
