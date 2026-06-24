import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { AppButton } from './AppButton';
import { theme } from '../theme';
import { HomeworkPayload, TeacherClass } from '../types';

interface HomeworkFormProps {
  initialData?: HomeworkPayload;
  classes: TeacherClass[];
  onSubmit: (data: HomeworkPayload) => void;
  isSubmitting?: boolean;
}

export const HomeworkForm: React.FC<HomeworkFormProps> = ({
  initialData,
  classes,
  onSubmit,
  isSubmitting = false,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [subject, setSubject] = useState(initialData?.subject || '');
  const [selectedClass, setSelectedClass] = useState(initialData?.class || '');
  const [section, setSection] = useState(initialData?.section || '');
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setTitle(initialData?.title || '');
    setDescription(initialData?.description || '');
    setSubject(initialData?.subject || '');
    setSelectedClass(initialData?.class || '');
    setSection(initialData?.section || '');
    setDueDate(initialData?.dueDate || '');
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!selectedClass) {
      newErrors.class = 'Class is required';
    }

    if (!section.trim()) {
      newErrors.section = 'Section is required';
    }

    if (!dueDate.trim()) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const selectedDate = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (Number.isNaN(selectedDate.getTime())) {
        newErrors.dueDate = 'Please enter a valid date (YYYY-MM-DD)';
      } else if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({
        title: title.trim(),
        description: description.trim(),
        subject: subject.trim(),
        class: selectedClass,
        section: section.trim(),
        dueDate: dueDate.trim(),
      });
    }
  };

  const handleClassSelect = (cls: TeacherClass) => {
    setSelectedClass(cls.name);
    setSection(cls.section);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={[styles.input, errors.title && styles.inputError]}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter homework title"
          placeholderTextColor={theme.colors.textLight}
        />
        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea, errors.description && styles.inputError]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter homework description"
          placeholderTextColor={theme.colors.textLight}
          multiline
          numberOfLines={4}
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Subject *</Text>
        <TextInput
          style={[styles.input, errors.subject && styles.inputError]}
          value={subject}
          onChangeText={setSubject}
          placeholder="Enter subject"
          placeholderTextColor={theme.colors.textLight}
        />
        {errors.subject && <Text style={styles.errorText}>{errors.subject}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Class *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.classScroll}>
          {classes.map((cls) => (
            <TouchableOpacity
              key={cls.id}
              style={[
                styles.classChip,
                selectedClass === cls.name && styles.classChipSelected,
              ]}
              onPress={() => handleClassSelect(cls)}
            >
              <Text
                style={[
                  styles.classChipText,
                  selectedClass === cls.name && styles.classChipTextSelected,
                ]}
              >
                {cls.name} - {cls.section}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {errors.class && <Text style={styles.errorText}>{errors.class}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Section *</Text>
        <TextInput
          style={[styles.input, errors.section && styles.inputError]}
          value={section}
          onChangeText={setSection}
          placeholder="Enter section"
          placeholderTextColor={theme.colors.textLight}
        />
        {errors.section && <Text style={styles.errorText}>{errors.section}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Due Date *</Text>
        <TextInput
          style={[styles.input, errors.dueDate && styles.inputError]}
          value={dueDate}
          onChangeText={setDueDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={theme.colors.textLight}
        />
        {errors.dueDate && <Text style={styles.errorText}>{errors.dueDate}</Text>}
      </View>

      <AppButton
        title={initialData ? 'Update Homework' : 'Create Homework'}
        variant="primary"
        onPress={handleSubmit}
        loading={isSubmitting}
        style={styles.submitButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  formGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
  classScroll: {
    marginBottom: theme.spacing.sm,
  },
  classChip: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  classChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  classChipText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  },
  classChipTextSelected: {
    color: theme.colors.background,
    fontWeight: theme.typography.fontWeight.bold,
  },
  submitButton: {
    marginTop: theme.spacing.lg,
  },
});
