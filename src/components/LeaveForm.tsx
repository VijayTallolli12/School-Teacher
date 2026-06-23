import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { theme } from '../theme';
import { LeaveType, LeavePayload } from '../types';

interface LeaveFormProps {
  leaveTypes: LeaveType[];
  preselectedTypeId?: string;
  onSubmit: (payload: LeavePayload) => Promise<void>;
  isSubmitting: boolean;
}

const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const parseDate = (str: string): Date | null => {
  const match = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  if (
    date.getFullYear() !== Number(y) ||
    date.getMonth() !== Number(m) - 1 ||
    date.getDate() !== Number(d)
  ) {
    return null;
  }
  return date;
};

const calcDays = (from: string, to: string): number => {
  const fromDate = parseDate(from);
  const toDate = parseDate(to);
  if (!fromDate || !toDate) return 0;
  const diff = toDate.getTime() - fromDate.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)) + 1);
};

export const LeaveForm: React.FC<LeaveFormProps> = ({
  leaveTypes,
  preselectedTypeId,
  onSubmit,
  isSubmitting,
}) => {
  const [selectedTypeId, setSelectedTypeId] = useState(preselectedTypeId ?? '');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const days = useMemo(() => calcDays(fromDate, toDate), [fromDate, toDate]);

  const selectedType = leaveTypes.find((t) => t.id === selectedTypeId);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedTypeId) newErrors.type = 'Leave type is required';
    if (!fromDate) newErrors.fromDate = 'From date is required';
    else if (!parseDate(fromDate)) newErrors.fromDate = 'Invalid date (YYYY-MM-DD)';

    if (!toDate) newErrors.toDate = 'To date is required';
    else if (!parseDate(toDate)) newErrors.toDate = 'Invalid date (YYYY-MM-DD)';

    const parsedFrom = parseDate(fromDate);
    const parsedTo = parseDate(toDate);
    if (parsedFrom && parsedTo && parsedFrom > parsedTo) {
      newErrors.toDate = 'To date must be after from date';
    }

    if (
      selectedType &&
      days > selectedType.maxConsecutiveDays
    ) {
      newErrors.toDate = `Max ${selectedType.maxConsecutiveDays} consecutive days allowed`;
    }

    if (!reason.trim()) newErrors.reason = 'Reason is required';
    else if (reason.trim().length < 10)
      newErrors.reason = 'Please provide a detailed reason (min 10 chars)';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    await onSubmit({
      leaveTypeId: selectedTypeId,
      fromDate,
      toDate,
      reason: reason.trim(),
    });
  };

  const todayStr = formatDate(new Date());

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* Leave Type */}
      <Text style={styles.label}>Leave Type *</Text>
      <View style={styles.typeGrid}>
        {leaveTypes.map((type) => {
          const isSelected = selectedTypeId === type.id;
          return (
            <TouchableOpacity
              key={type.id}
              style={[styles.typeChip, isSelected && styles.typeChipSelected]}
              onPress={() => {
                setSelectedTypeId(type.id);
                setErrors((e) => ({ ...e, type: '' }));
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.typeChipText,
                  isSelected && styles.typeChipTextSelected,
                ]}
              >
                {type.name}
              </Text>
              <Text
                style={[
                  styles.typeChipDays,
                  isSelected && styles.typeChipDaysSelected,
                ]}
              >
                {type.defaultDays} days
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}

      {/* From Date */}
      <Text style={styles.label}>From Date *</Text>
      <TextInput
        style={styles.input}
        value={fromDate}
        onChangeText={(v) => {
          setFromDate(v);
          setErrors((e) => ({ ...e, fromDate: '' }));
        }}
        placeholder="YYYY-MM-DD"
        placeholderTextColor={theme.colors.textLight}
        keyboardType="numbers-and-punctuation"
        maxLength={10}
      />
      {errors.fromDate && <Text style={styles.errorText}>{errors.fromDate}</Text>}

      {/* To Date */}
      <Text style={styles.label}>To Date *</Text>
      <TextInput
        style={styles.input}
        value={toDate}
        onChangeText={(v) => {
          setToDate(v);
          setErrors((e) => ({ ...e, toDate: '' }));
        }}
        placeholder="YYYY-MM-DD"
        placeholderTextColor={theme.colors.textLight}
        keyboardType="numbers-and-punctuation"
        maxLength={10}
      />
      {errors.toDate && <Text style={styles.errorText}>{errors.toDate}</Text>}

      {/* Days summary */}
      {days > 0 && (
        <View style={styles.daysBanner}>
          <Text style={styles.daysBannerText}>
            {days} day{days > 1 ? 's' : ''}
            {selectedType && days > selectedType.maxConsecutiveDays
              ? ` (exceeds max ${selectedType.maxConsecutiveDays})`
              : ''}
          </Text>
        </View>
      )}

      {/* Reason */}
      <Text style={styles.label}>Reason *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={reason}
        onChangeText={(v) => {
          setReason(v);
          setErrors((e) => ({ ...e, reason: '' }));
        }}
        placeholder="Please describe the reason for leave"
        placeholderTextColor={theme.colors.textLight}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
      {errors.reason && <Text style={styles.errorText}>{errors.reason}</Text>}

      {/* Submit */}
      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
        activeOpacity={0.7}
      >
        {isSubmitting ? (
          <ActivityIndicator color={theme.colors.background} size="small" />
        ) : (
          <Text style={styles.submitButtonText}>Apply Leave</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 2,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
  },
  textArea: {
    minHeight: 100,
    paddingTop: theme.spacing.sm + 2,
  },
  errorText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.error,
    marginTop: 2,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  typeChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    minWidth: '30%',
    flex: 1,
  },
  typeChipSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: '#EEF2FF',
  },
  typeChipText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: 2,
  },
  typeChipTextSelected: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  typeChipDays: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
  },
  typeChipDaysSelected: {
    color: theme.colors.primaryLight,
  },
  daysBanner: {
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: '#F0FDF4',
    borderRadius: theme.radius.sm,
  },
  daysBannerText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.secondary,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md - 2,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.background,
  },
});
