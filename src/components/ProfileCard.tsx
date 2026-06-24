import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { AppCard } from './AppCard';

interface ProfileCardProps {
  name: string;
  email: string;
  employeeId?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ name, email, employeeId }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <AppCard variant="elevated">
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
          {employeeId && (
            <View style={styles.idRow}>
              <Ionicons name="briefcase-outline" size={14} color={theme.colors.textLight} />
              <Text style={styles.employeeId}>ID: {employeeId}</Text>
            </View>
          )}
        </View>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.background,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    ...theme.typography.hierarchy.body,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  email: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  employeeId: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textLight,
  },
});
