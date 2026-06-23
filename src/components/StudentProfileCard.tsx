import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface StudentProfileCardProps {
  name: string;
  admissionNo: string;
  className: string;
  section: string;
  rollNumber: string;
  gender: string;
  dateOfBirth: string;
  bloodGroup?: string;
}

export const StudentProfileCard: React.FC<StudentProfileCardProps> = ({
  name,
  admissionNo,
  className,
  section,
  rollNumber,
  gender,
  dateOfBirth,
  bloodGroup,
}) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.admissionNo}>ADM: {admissionNo}</Text>
          <View style={styles.classRow}>
            <Text style={styles.classText}>
              {className} - {section}
            </Text>
            <Text style={styles.rollText}>Roll: {rollNumber}</Text>
          </View>
        </View>
      </View>
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Gender</Text>
          <Text style={styles.detailValue}>{gender}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>DOB</Text>
          <Text style={styles.detailValue}>{dateOfBirth}</Text>
        </View>
        {bloodGroup && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Blood</Text>
            <Text style={styles.detailValue}>{bloodGroup}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  avatar: {
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
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  admissionNo: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  classRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  classText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.md,
  },
  rollText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  detailsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.lg,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
  },
});
