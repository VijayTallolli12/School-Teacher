import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { theme } from '../theme';
import { useClasses } from '../hooks/useAttendance';
import { StudentStatus } from '../types';

interface FilterState {
  class: string;
  section: string;
  status: StudentStatus | '';
}

interface StudentFilterSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

const SECTIONS = ['A', 'B', 'C', 'D'];
const STATUSES: { value: StudentStatus | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'transferred', label: 'Transferred' },
];

export const StudentFilterSheet: React.FC<StudentFilterSheetProps> = ({
  visible,
  onClose,
  onApply,
  initialFilters,
}) => {
  const { data: classes } = useClasses();
  const [filters, setFilters] = useState<FilterState>(
    initialFilters ?? { class: '', section: '', status: '' }
  );

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const reset = { class: '', section: '', status: '' as const };
    setFilters(reset);
    onApply(reset);
    onClose();
  };

  const uniqueClasses = Array.from(
    new Set(classes?.map((c) => c.name) ?? [])
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body}>
            {/* Class Filter */}
            <Text style={styles.filterLabel}>Class</Text>
            <View style={styles.chipRow}>
              <TouchableOpacity
                style={[
                  styles.chip,
                  filters.class === '' && styles.chipActive,
                ]}
                onPress={() => setFilters((f) => ({ ...f, class: '', section: '' }))}
              >
                <Text
                  style={[
                    styles.chipText,
                    filters.class === '' && styles.chipTextActive,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>
              {uniqueClasses.map((cls) => (
                <TouchableOpacity
                  key={cls}
                  style={[
                    styles.chip,
                    filters.class === cls && styles.chipActive,
                  ]}
                  onPress={() => setFilters((f) => ({ ...f, class: cls }))}
                >
                  <Text
                    style={[
                      styles.chipText,
                      filters.class === cls && styles.chipTextActive,
                    ]}
                  >
                    {cls}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Section Filter */}
            <Text style={styles.filterLabel}>Section</Text>
            <View style={styles.chipRow}>
              <TouchableOpacity
                style={[
                  styles.chip,
                  filters.section === '' && styles.chipActive,
                ]}
                onPress={() => setFilters((f) => ({ ...f, section: '' }))}
              >
                <Text
                  style={[
                    styles.chipText,
                    filters.section === '' && styles.chipTextActive,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>
              {SECTIONS.map((sec) => (
                <TouchableOpacity
                  key={sec}
                  style={[
                    styles.chip,
                    filters.section === sec && styles.chipActive,
                  ]}
                  onPress={() => setFilters((f) => ({ ...f, section: sec }))}
                >
                  <Text
                    style={[
                      styles.chipText,
                      filters.section === sec && styles.chipTextActive,
                    ]}
                  >
                    {sec}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Status Filter */}
            <Text style={styles.filterLabel}>Status</Text>
            <View style={styles.chipRow}>
              {STATUSES.map((s) => (
                <TouchableOpacity
                  key={s.label}
                  style={[
                    styles.chip,
                    filters.status === s.value && styles.chipActive,
                  ]}
                  onPress={() => setFilters((f) => ({ ...f, status: s.value }))}
                >
                  <Text
                    style={[
                      styles.chipText,
                      filters.status === s.value && styles.chipTextActive,
                    ]}
                  >
                    {s.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
            >
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApply}
            >
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  closeText: {
    fontSize: 20,
    color: theme.colors.textLight,
    padding: 4,
  },
  body: {
    padding: theme.spacing.md,
  },
  filterLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  chip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm - 2,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  chipActive: {
    borderColor: theme.colors.primary,
    backgroundColor: '#EEF2FF',
  },
  chipText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  chipTextActive: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  footer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  resetButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm + 2,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  resetText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textSecondary,
  },
  applyButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm + 2,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
  },
  applyText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.background,
  },
});
