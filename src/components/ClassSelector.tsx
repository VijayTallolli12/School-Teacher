import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '../theme';
import { TeacherClass } from '../types';

interface ClassSelectorProps {
  classes: TeacherClass[];
  selectedClass: TeacherClass | null;
  onSelectClass: (cls: TeacherClass) => void;
}

export const ClassSelector: React.FC<ClassSelectorProps> = ({
  classes,
  selectedClass,
  onSelectClass,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Class</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
        {classes.map((cls) => (
          <TouchableOpacity
            key={cls.id}
            style={[
              styles.classChip,
              selectedClass?.id === cls.id && styles.selectedChip,
            ]}
            onPress={() => onSelectClass(cls)}
          >
            <Text
              style={[
                styles.classText,
                selectedClass?.id === cls.id && styles.selectedText,
              ]}
            >
              {cls.name} - {cls.section}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  scrollContainer: {
    flexDirection: 'row',
  },
  classChip: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.sm,
  },
  selectedChip: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  classText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  },
  selectedText: {
    color: theme.colors.background,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
