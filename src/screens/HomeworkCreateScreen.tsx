import React from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { ScreenContainer } from '../components';
import { HomeworkForm } from '../components';
import { useCreateHomework, useHomeworkDetail, useUpdateHomework } from '../hooks/useHomework';
import { useClasses } from '../hooks/useAttendance';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { AppStackParamList } from '../types';
import { theme } from '../theme';

type HomeworkCreateRouteProp = RouteProp<AppStackParamList, 'HomeworkCreate'>;

export const HomeworkCreateScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<HomeworkCreateRouteProp>();
  const homeworkId = route.params?.homeworkId;
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
          { text: 'OK', onPress: () => navigation.goBack() },
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
          <View style={styles.skeleton} />
        </View>
      </ScreenContainer>
    );
  }

  if (classesError || homeworkError) {
    return (
      <ScreenContainer>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {classesError?.message || homeworkError?.message || 'Unable to load data for homework form.'}
          </Text>
        </View>
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
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.error,
    textAlign: 'center',
  },
  skeleton: {
    height: 400,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
  },
});
