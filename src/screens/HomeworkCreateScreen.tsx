import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ScreenContainer } from '../components';
import { HomeworkForm } from '../components';
import { useCreateHomework } from '../hooks/useHomework';
import { useClasses } from '../hooks/useAttendance';
import { useNavigation } from '@react-navigation/native';

export const HomeworkCreateScreen: React.FC = () => {
  const navigation = useNavigation();
  const { mutate: createHomework, isPending } = useCreateHomework();
  const { data: classes, isLoading: classesLoading } = useClasses();

  const handleSubmit = (data: any) => {
    createHomework(data, {
      onSuccess: () => {
        Alert.alert('Success', 'Homework created successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      },
      onError: (error) => {
        Alert.alert('Error', error.message || 'Failed to create homework');
      },
    });
  };

  if (classesLoading) {
    return (
      <ScreenContainer>
        <View style={styles.loadingContainer}>
          <View style={styles.skeleton} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <HomeworkForm
        classes={classes || []}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    padding: 16,
  },
  skeleton: {
    height: 400,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
  },
});
