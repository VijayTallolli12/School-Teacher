import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { MarksEntry } from '../types';

interface MarksEntryRowProps {
  entry: MarksEntry;
  maxMarks: number;
  onChangeMarks: (studentId: string, marks: number | null) => void;
  error?: string;
}

export const MarksEntryRow: React.FC<MarksEntryRowProps> = ({
  entry,
  maxMarks,
  onChangeMarks,
  error,
}) => {
  const [localValue, setLocalValue] = useState(
    entry.marks !== null ? String(entry.marks) : ''
  );

  const handleChange = useCallback(
    (text: string) => {
      setLocalValue(text);
      const parsed = parseInt(text, 10);
      if (text === '') {
        onChangeMarks(entry.studentId, null);
      } else if (!isNaN(parsed)) {
        onChangeMarks(entry.studentId, Math.min(Math.max(0, parsed), maxMarks));
      }
    },
    [entry.studentId, maxMarks, onChangeMarks]
  );

  return (
    <View style={[styles.container, error ? styles.containerError : null]}>
      <View style={styles.info}>
        <Text style={styles.rollNumber}>#{entry.rollNumber}</Text>
        <Text style={styles.studentName} numberOfLines={1}>
          {entry.studentName}
        </Text>
        {entry.isDraft && (
          <View style={styles.draftBadge}>
            <Text style={styles.draftText}>Draft</Text>
          </View>
        )}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          value={localValue}
          onChangeText={handleChange}
          keyboardType="number-pad"
          placeholder={`0-${maxMarks}`}
          placeholderTextColor={theme.colors.textLight}
          maxLength={String(maxMarks).length + 1}
          accessibilityLabel={`Marks for ${entry.studentName}`}
        />
        <Text style={styles.maxMarks}>/ {maxMarks}</Text>
      </View>
      {error && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={12} color={theme.colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    minHeight: 52,
  },
  containerError: {
    backgroundColor: theme.colors.error + '08',
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  rollNumber: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textTertiary,
    fontWeight: theme.typography.weight.medium,
    minWidth: 28,
  },
  studentName: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.text,
    flex: 1,
  },
  draftBadge: {
    backgroundColor: theme.colors.warning + '18',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: theme.radius.xs,
  },
  draftText: {
    ...theme.typography.hierarchy.caption,
    fontSize: 10,
    color: theme.colors.warning,
    fontWeight: theme.typography.weight.medium,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  input: {
    width: 60,
    height: 36,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.sm,
    textAlign: 'center',
    ...theme.typography.hierarchy.body,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text,
  },
  inputError: {
    borderColor: theme.colors.error,
    backgroundColor: theme.colors.error + '08',
  },
  maxMarks: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.textTertiary,
    minWidth: 40,
  },
  errorRow: {
    position: 'absolute',
    bottom: 2,
    left: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  errorText: {
    ...theme.typography.hierarchy.caption,
    fontSize: 10,
    color: theme.colors.error,
  },
});
