import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '../components';
import { EmptyState } from '../components/EmptyState';
import { SkeletonCard } from '../components/SkeletonLoader';
import { HomeworkForm } from '../components';
import { useCreateHomework, useHomeworkDetail, useUpdateHomework } from '../hooks/useHomework';
import { useClasses } from '../hooks/useAttendance';
import { theme } from '../theme';

export const HomeworkCreateScreen: React.FC = () => {
  const { homeworkId } = useLocalSearchParams<{ homeworkId?: string }>();
  const isEditMode = Boolean(homeworkId);

  const { mutate: createHomework, isPending: isCreating } = useCreateHomework();
  const { mutate: updateHomework, isPending: isUpdating } = useUpdateHomework();
  const { data: classes, isLoading: classesLoading, error: classesError } = useClasses();
  const {
    data: existingHomework,
    isLoading: homeworkLoading,
    error: homeworkError,
  } = useHomeworkDetail(homeworkId || '');

  const handleSubmit = (data: any) => {
    const callbackOptions = {
      onSuccess: () => {
        Alert.alert('Success', `Homework ${isEditMode ? 'updated' : 'created'} successfully`, [
          { text: 'OK', onPress: () => router.back() },
        ]);
      },
      onError: (error: Error) => {
        Alert.alert('Error', error.message || `Failed to ${isEditMode ? 'update' : 'create'} homework`);
      },
    };

    if (isEditMode && homeworkId) {
      updateHomework({ id: homeworkId, payload: data }, callbackOptions);
    } else {
      createHomework(data, callbackOptions);
    }
  };

  if (classesLoading || (isEditMode && homeworkLoading)) {
    return (
      <ScreenContainer>
        <View style={styles.loadingContainer}>
          <SkeletonCard lines={5} />
        </View>
      </ScreenContainer>
    );
  }

  if (classesError || homeworkError) {
    return (
      <ScreenContainer>
        <EmptyState
          icon="alert-circle-outline"
          title="Unable to Load Data"
          message={classesError?.message || homeworkError?.message || 'Unable to load data for homework form.'}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <HomeworkForm
        initialData={existingHomework}
        classes={classes || []}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    padding: theme.spacing.md,
  },
});
