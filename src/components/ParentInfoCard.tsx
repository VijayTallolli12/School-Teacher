import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { theme } from '../theme';

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
    <View style={styles.container}>
      <View style={styles.parentRow}>
        <View style={styles.parentItem}>
          <Text style={styles.parentLabel}>Father</Text>
          <Text style={styles.parentName}>{fatherName}</Text>
          <TouchableOpacity
            style={styles.phoneRow}
            onPress={() => handleCall(fatherPhone)}
          >
            <Text style={styles.phoneIcon}>📞</Text>
            <Text style={styles.phoneText}>{fatherPhone}</Text>
          </TouchableOpacity>
          {fatherEmail && (
            <Text style={styles.emailText}>{fatherEmail}</Text>
          )}
        </View>
        <View style={styles.divider} />
        <View style={styles.parentItem}>
          <Text style={styles.parentLabel}>Mother</Text>
          <Text style={styles.parentName}>{motherName}</Text>
          <TouchableOpacity
            style={styles.phoneRow}
            onPress={() => handleCall(motherPhone)}
          >
            <Text style={styles.phoneIcon}>📞</Text>
            <Text style={styles.phoneText}>{motherPhone}</Text>
          </TouchableOpacity>
          {motherEmail && (
            <Text style={styles.emailText}>{motherEmail}</Text>
          )}
        </View>
      </View>
      <View style={styles.addressContainer}>
        <Text style={styles.addressLabel}>Address</Text>
        <Text style={styles.addressText}>{address}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.xs,
  },
  parentName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  phoneIcon: {
    fontSize: 14,
  },
  phoneText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  emailText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
    marginTop: 2,
  },
  addressContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    padding: theme.spacing.md,
  },
  addressLabel: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.xs,
  },
  addressText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
});
