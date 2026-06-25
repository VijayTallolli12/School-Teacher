import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer, AppHeader } from '../components';
import { LeaveForm } from '../components/LeaveForm';
import { SkeletonList } from '../components/SkeletonLoader';
import { useLeaveTypes, useApplyLeave } from '../hooks/useLeave';
import { theme } from '../theme';
import { LeavePayload } from '../types';

export const LeaveApplyScreen: React.FC = () => {
  const navigation = useNavigation();
  const { leaveType } = useLocalSearchParams<{ leaveType?: string }>();
  const preselectedTypeId = leaveType;

  const { data: leaveTypes, isLoading: typesLoading } = useLeaveTypes();
  const applyMutation = useApplyLeave();

  const handleSubmit = useCallback(
    async (payload: LeavePayload) => {
      try {
        await applyMutation.mutateAsync(payload);
        Alert.alert('Success', 'Leave application submitted successfully.', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } catch (error: any) {
        const message =
          error.response?.data?.message || 'Failed to apply for leave';
        Alert.alert('Error', message);
      }
    },
    [applyMutation, navigation]
  );

  if (typesLoading) {
    return (
      <ScreenContainer>
        <AppHeader
          variant="secondary"
          title="Apply Leave"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <SkeletonList count={3} style={styles.skeletonList} />
      </ScreenContainer>
    );
  }

  if (!leaveTypes || leaveTypes.length === 0) {
    return (
      <ScreenContainer>
        <AppHeader
          variant="secondary"
          title="Apply Leave"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.centeredContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={theme.colors.textLight} />
          <Text style={styles.errorText}>Leave types not available</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={false}>
      <AppHeader
        title="Apply Leave"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <LeaveForm
          leaveTypes={leaveTypes}
          preselectedTypeId={preselectedTypeId}
          onSubmit={handleSubmit}
          isSubmitting={applyMutation.isPending}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  skeletonList: {
    padding: theme.spacing.md,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  errorText: {
    ...theme.typography.hierarchy.body,
    color: theme.colors.textSecondary,
  },
});
