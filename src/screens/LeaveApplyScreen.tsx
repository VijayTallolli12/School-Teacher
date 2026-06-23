import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenContainer, AppHeader } from '../components';
import { LeaveForm } from '../components/LeaveForm';
import { useLeaveTypes, useApplyLeave } from '../hooks/useLeave';
import { theme } from '../theme';
import { AppStackParamList, LeavePayload } from '../types';

type ApplyRouteProp = RouteProp<AppStackParamList, 'LeaveApply'>;

export const LeaveApplyScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<ApplyRouteProp>();
  const preselectedTypeId = route.params?.leaveType;

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
          title="Apply Leave"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  if (!leaveTypes || leaveTypes.length === 0) {
    return (
      <ScreenContainer>
        <AppHeader
          title="Apply Leave"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.centeredContainer}>
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
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
  },
});
