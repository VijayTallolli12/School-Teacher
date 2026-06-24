import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { AppCard } from './AppCard';

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
    <AppCard variant="elevated" style={styles.card} contentStyle={styles.cardContent}>
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.admissionNo}>ADM: {admissionNo}</Text>
          <View style={styles.classRow}>
            <Ionicons name="school-outline" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.classText}>
              {className} - {section}
            </Text>
            <Text style={styles.rollText}>Roll: {rollNumber}</Text>
          </View>
        </View>
      </View>
      <View style={styles.detailsRow}>
        <View style={styles.detailItem} accessibilityRole="text" accessibilityLabel={`Gender: ${gender}`}>
          <Ionicons name="person-outline" size={14} color={theme.colors.textLight} />
          <Text style={styles.detailLabel}>Gender</Text>
          <Text style={styles.detailValue}>{gender}</Text>
        </View>
        <View style={styles.detailItem} accessibilityRole="text" accessibilityLabel={`Date of birth: ${dateOfBirth}`}>
          <Ionicons name="calendar-outline" size={14} color={theme.colors.textLight} />
          <Text style={styles.detailLabel}>DOB</Text>
          <Text style={styles.detailValue}>{dateOfBirth}</Text>
        </View>
        {bloodGroup && (
          <View style={styles.detailItem} accessibilityRole="text" accessibilityLabel={`Blood group: ${bloodGroup}`}>
            <Ionicons name="water-outline" size={14} color={theme.colors.textLight} />
            <Text style={styles.detailLabel}>Blood</Text>
            <Text style={styles.detailValue}>{bloodGroup}</Text>
          </View>
        )}
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.lg,
  },
  cardContent: {
    padding: theme.spacing.lg,
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
    ...theme.typography.hierarchy.heading,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.background,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    ...theme.typography.hierarchy.heading,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  admissionNo: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  classRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  classText: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.md,
  },
  rollText: {
    ...theme.typography.hierarchy.bodySmall,
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
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textLight,
    marginBottom: 2,
    marginTop: 2,
  },
  detailValue: {
    ...theme.typography.hierarchy.bodySmall,
    fontWeight: theme.typography.weight.medium,
    color: theme.colors.text,
  },
});
