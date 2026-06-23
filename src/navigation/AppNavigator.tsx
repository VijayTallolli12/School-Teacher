import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabs } from './MainTabsNavigator';
import {
  ExamsScreen,
  HomeworkCreateScreen,
  HomeworkDetailScreen,
  PeriodDetailScreen,
  LeaveScreen,
  LeaveApplyScreen,
  LeaveDetailScreen,
  StudentsScreen,
  StudentDetailScreen,
} from '../screens';
import { AppStackParamList } from '../types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Exams" component={ExamsScreen} />
      <Stack.Screen name="HomeworkCreate" component={HomeworkCreateScreen} />
      <Stack.Screen name="HomeworkDetail" component={HomeworkDetailScreen} />
      <Stack.Screen name="PeriodDetail" component={PeriodDetailScreen} />
      <Stack.Screen name="Leave" component={LeaveScreen} />
      <Stack.Screen name="LeaveApply" component={LeaveApplyScreen} />
      <Stack.Screen name="LeaveDetail" component={LeaveDetailScreen} />
      <Stack.Screen name="Students" component={StudentsScreen} />
      <Stack.Screen name="StudentDetail" component={StudentDetailScreen} />
    </Stack.Navigator>
  );
};
