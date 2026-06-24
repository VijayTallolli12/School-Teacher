import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { useClasses } from '../hooks/useAttendance';
import { StudentStatus } from '../types';
import { AppButton } from './AppButton';

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
    <Modal visible={visible} transparent animationType="slide" accessibilityViewIsModal>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity
              onPress={onClose}
              accessibilityLabel="Close filters"
              accessibilityRole="button"
            >
              <Ionicons name="close" size={20} color={theme.colors.textLight} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body}>
            {/* Class Filter */}
            <Text style={styles.filterLabel}>Class</Text>
            <View style={styles.chipRow} accessibilityRole="radiogroup" accessibilityLabel="Select class">
              <TouchableOpacity
                style={[
                  styles.chip,
                  filters.class === '' && styles.chipActive,
                ]}
                onPress={() => setFilters((f) => ({ ...f, class: '', section: '' }))}
                accessibilityRole="radio"
                accessibilityState={{ selected: filters.class === '' }}
                accessibilityLabel="All classes"
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
                  accessibilityRole="radio"
                  accessibilityState={{ selected: filters.class === cls }}
                  accessibilityLabel={`Class ${cls}`}
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
            <View style={styles.chipRow} accessibilityRole="radiogroup" accessibilityLabel="Select section">
              <TouchableOpacity
                style={[
                  styles.chip,
                  filters.section === '' && styles.chipActive,
                ]}
                onPress={() => setFilters((f) => ({ ...f, section: '' }))}
                accessibilityRole="radio"
                accessibilityState={{ selected: filters.section === '' }}
                accessibilityLabel="All sections"
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
                  accessibilityRole="radio"
                  accessibilityState={{ selected: filters.section === sec }}
                  accessibilityLabel={`Section ${sec}`}
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
            <View style={styles.chipRow} accessibilityRole="radiogroup" accessibilityLabel="Select status">
              {STATUSES.map((s) => (
                <TouchableOpacity
                  key={s.label}
                  style={[
                    styles.chip,
                    filters.status === s.value && styles.chipActive,
                  ]}
                  onPress={() => setFilters((f) => ({ ...f, status: s.value }))}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: filters.status === s.value }}
                  accessibilityLabel={s.label}
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
            <AppButton
              title="Reset"
              variant="ghost"
              onPress={handleReset}
              style={styles.footerButton}
              accessibilityLabel="Reset all filters"
            />
            <AppButton
              title="Apply"
              variant="primary"
              onPress={handleApply}
              style={styles.footerButton}
              accessibilityLabel="Apply filters"
            />
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
    backgroundColor: theme.colors.surface,
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
    ...theme.typography.hierarchy.heading,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text,
  },
  closeIcon: {
    padding: 4,
  },
  body: {
    padding: theme.spacing.md,
  },
  filterLabel: {
    ...theme.typography.hierarchy.bodySmall,
    fontWeight: theme.typography.weight.bold,
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
    backgroundColor: theme.colors.primaryLight,
  },
  chipText: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.textSecondary,
  },
  chipTextActive: {
    color: theme.colors.primary,
    fontWeight: theme.typography.weight.bold,
  },
  footer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  footerButton: {
    flex: 1,
  },
});
