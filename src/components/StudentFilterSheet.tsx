import React, { useEffect, useState } from 'react';
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
import { StudentStatus, TeacherClass } from '../types';
import { AppButton } from './AppButton';

interface StudentFilterSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: { classSectionId: string; status: StudentStatus | '' }) => void;
  initialClassSectionId?: string;
  initialStatus?: StudentStatus | '';
}

function findClassSectionId(className: string, section: string, classes?: TeacherClass[]): string {
  if (!className || !section || !classes) return '';
  return classes.find((c) => c.name === className && c.section === section)?.id ?? '';
}

function decomposeClassSectionId(classSectionId: string, classes?: TeacherClass[]): { className: string; section: string } {
  if (!classSectionId || !classes) return { className: '', section: '' };
  const match = classes.find((c) => c.id === classSectionId);
  return match ? { className: match.name, section: match.section } : { className: '', section: '' };
}

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
  initialClassSectionId,
  initialStatus,
}) => {
  const { data: classes } = useClasses();
  const [filters, setFilters] = useState<{ class: string; section: string; status: StudentStatus | '' }>({
    class: '',
    section: '',
    status: initialStatus ?? '',
  });

  useEffect(() => {
    if (!classes || !initialClassSectionId) return;
    const decomposed = decomposeClassSectionId(initialClassSectionId, classes);
    if (decomposed.className) {
      setFilters({ class: decomposed.className, section: decomposed.section, status: initialStatus ?? '' });
    }
  }, [classes, initialClassSectionId, initialStatus]);

  const handleApply = () => {
    const classSectionId = findClassSectionId(filters.class, filters.section, classes);
    onApply({ classSectionId, status: filters.status });
    onClose();
  };

  const handleReset = () => {
    setFilters({ class: '', section: '', status: '' });
    onApply({ classSectionId: '', status: '' });
    onClose();
  };

  const uniqueClasses = Array.from(
    new Set(classes?.map((c) => c.name) ?? [])
  );

  const availableSections = React.useMemo(() => {
    if (!filters.class || !classes) return [];
    return classes
      .filter((c) => c.name === filters.class)
      .map((c) => c.section);
  }, [filters.class, classes]);

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
                  onPress={() => setFilters((f) => ({ ...f, class: cls, section: '' }))}
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

            {/* Section Filter — dynamically populated from teacher's assigned sections */}
            <Text style={styles.filterLabel}>Section</Text>
            {!filters.class ? (
              <Text style={styles.noSelectionText}>Select a class to filter by section</Text>
            ) : (
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
                {availableSections.map((sec) => (
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
            )}

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
  noSelectionText: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.sm,
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
