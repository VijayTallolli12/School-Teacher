import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { AppCard } from './AppCard';

interface ParentInfoCardProps {
  fatherName: string;
  motherName: string;
  fatherPhone: string;
  motherPhone: string;
  fatherEmail?: string;
  motherEmail?: string;
  address: string;
}

export const ParentInfoCard: React.FC<ParentInfoCardProps> = ({
  fatherName,
  motherName,
  fatherPhone,
  motherPhone,
  fatherEmail,
  motherEmail,
  address,
}) => {
  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() =>
      Alert.alert('Error', 'Could not initiate call')
    );
  };

  return (
    <AppCard variant="default" contentStyle={styles.cardContent}>
      <View style={styles.parentRow}>
        <View style={styles.parentItem}>
          <Ionicons name="person-outline" size={20} color={theme.colors.textSecondary} />
          <Text style={styles.parentLabel}>Father</Text>
          <Text style={styles.parentName}>{fatherName}</Text>
          <TouchableOpacity
            style={styles.phoneRow}
            onPress={() => handleCall(fatherPhone)}
            accessibilityLabel={`Call father at ${fatherPhone}`}
            accessibilityRole="button"
          >
            <Ionicons name="call-outline" size={14} color={theme.colors.primary} />
            <Text style={styles.phoneText}>{fatherPhone}</Text>
          </TouchableOpacity>
          {fatherEmail && (
            <View style={styles.emailRow}>
              <Ionicons name="mail-outline" size={12} color={theme.colors.textLight} />
              <Text style={styles.emailText}>{fatherEmail}</Text>
            </View>
          )}
        </View>
        <View style={styles.divider} />
        <View style={styles.parentItem}>
          <Ionicons name="person-outline" size={20} color={theme.colors.textSecondary} />
          <Text style={styles.parentLabel}>Mother</Text>
          <Text style={styles.parentName}>{motherName}</Text>
          <TouchableOpacity
            style={styles.phoneRow}
            onPress={() => handleCall(motherPhone)}
            accessibilityLabel={`Call mother at ${motherPhone}`}
            accessibilityRole="button"
          >
            <Ionicons name="call-outline" size={14} color={theme.colors.primary} />
            <Text style={styles.phoneText}>{motherPhone}</Text>
          </TouchableOpacity>
          {motherEmail && (
            <View style={styles.emailRow}>
              <Ionicons name="mail-outline" size={12} color={theme.colors.textLight} />
              <Text style={styles.emailText}>{motherEmail}</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.addressContainer}>
        <View style={styles.addressHeader}>
          <Ionicons name="location-outline" size={14} color={theme.colors.textLight} />
          <Text style={styles.addressLabel}>Address</Text>
        </View>
        <Text style={styles.addressText}>{address}</Text>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  cardContent: {
    padding: 0,
    overflow: 'hidden',
  },
  parentRow: {
    flexDirection: 'row',
  },
  parentItem: {
    flex: 1,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  parentLabel: {
    ...theme.typography.hierarchy.caption,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  parentName: {
    ...theme.typography.hierarchy.body,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  phoneText: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.primary,
    fontWeight: theme.typography.weight.medium,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  emailText: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textLight,
  },
  addressContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    padding: theme.spacing.md,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: theme.spacing.xs,
  },
  addressLabel: {
    ...theme.typography.hierarchy.caption,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  addressText: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
});
