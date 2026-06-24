import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { LeaveType, LeavePayload } from '../types';
import { AppButton } from './AppButton';

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

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* Leave Type */}
      <View style={styles.labelRow}>
        <Ionicons name="list-outline" size={16} color={theme.colors.textSecondary} />
        <Text style={styles.label}>Leave Type *</Text>
      </View>
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
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Leave type: ${type.name}`}
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
      <View style={styles.labelRow}>
        <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
        <Text style={styles.label}>From Date *</Text>
      </View>
      <TextInput
        style={[styles.input, errors.fromDate && styles.inputError]}
        value={fromDate}
        onChangeText={(v) => {
          setFromDate(v);
          setErrors((e) => ({ ...e, fromDate: '' }));
        }}
        placeholder="YYYY-MM-DD"
        placeholderTextColor={theme.colors.textLight}
        keyboardType="numbers-and-punctuation"
        maxLength={10}
        accessibilityLabel="From date"
      />
      {errors.fromDate && <Text style={styles.errorText}>{errors.fromDate}</Text>}

      {/* To Date */}
      <View style={styles.labelRow}>
        <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
        <Text style={styles.label}>To Date *</Text>
      </View>
      <TextInput
        style={[styles.input, errors.toDate && styles.inputError]}
        value={toDate}
        onChangeText={(v) => {
          setToDate(v);
          setErrors((e) => ({ ...e, toDate: '' }));
        }}
        placeholder="YYYY-MM-DD"
        placeholderTextColor={theme.colors.textLight}
        keyboardType="numbers-and-punctuation"
        maxLength={10}
        accessibilityLabel="To date"
      />
      {errors.toDate && <Text style={styles.errorText}>{errors.toDate}</Text>}

      {/* Days summary */}
      {days > 0 && (
        <View style={styles.daysBanner}>
          <Ionicons name="calendar-outline" size={16} color={theme.colors.secondary} />
          <Text style={styles.daysBannerText}>
            {days} day{days > 1 ? 's' : ''}
            {selectedType && days > selectedType.maxConsecutiveDays
              ? ` (exceeds max ${selectedType.maxConsecutiveDays})`
              : ''}
          </Text>
        </View>
      )}

      {/* Reason */}
      <View style={styles.labelRow}>
        <Ionicons name="create-outline" size={16} color={theme.colors.textSecondary} />
        <Text style={styles.label}>Reason *</Text>
      </View>
      <TextInput
        style={[styles.input, styles.textArea, errors.reason && styles.inputError]}
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
        accessibilityLabel="Reason for leave"
      />
      {errors.reason && <Text style={styles.errorText}>{errors.reason}</Text>}

      {/* Submit */}
      <AppButton
        title="Apply Leave"
        variant="primary"
        onPress={handleSubmit}
        loading={isSubmitting}
        leftIcon={<Ionicons name="paper-plane-outline" size={18} color={theme.colors.primaryContrast} />}
        style={styles.submitButton}
        accessibilityLabel="Submit leave application"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  label: {
    ...theme.typography.hierarchy.bodySmall,
    fontWeight: theme.typography.weight.medium,
    color: theme.colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 2,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  textArea: {
    minHeight: 100,
    paddingTop: theme.spacing.sm + 2,
  },
  errorText: {
    ...theme.typography.hierarchy.caption,
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
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    minWidth: '30%',
    flex: 1,
  },
  typeChipSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  typeChipText: {
    ...theme.typography.hierarchy.bodySmall,
    fontWeight: theme.typography.weight.medium,
    color: theme.colors.text,
    marginBottom: 2,
  },
  typeChipTextSelected: {
    color: theme.colors.primary,
    fontWeight: theme.typography.weight.bold,
  },
  typeChipDays: {
    ...theme.typography.hierarchy.caption,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  daysBannerText: {
    ...theme.typography.hierarchy.bodySmall,
    fontWeight: theme.typography.weight.medium,
    color: theme.colors.secondary,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
  },
});
