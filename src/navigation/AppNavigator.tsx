import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabs } from './MainTabsNavigator';
import {
  ExamsScreen,
  ExamDetailScreen,
  MarksEntryScreen,
  ExamScheduleScreen,
  HomeworkCreateScreen,
  HomeworkDetailScreen,
  PeriodDetailScreen,
  LeaveScreen,
  LeaveApplyScreen,
  LeaveDetailScreen,
  StudentsScreen,
  StudentDetailScreen,
  TransportScreen,
  VehicleTrackingScreen,
  RouteDetailScreen,
  ProfileScreen,
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
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Exams" component={ExamsScreen} />
      <Stack.Screen name="ExamDetail" component={ExamDetailScreen} />
      <Stack.Screen name="MarksEntry" component={MarksEntryScreen} />
      <Stack.Screen name="ExamSchedule" component={ExamScheduleScreen} />
      <Stack.Screen name="HomeworkCreate" component={HomeworkCreateScreen} />
      <Stack.Screen name="HomeworkDetail" component={HomeworkDetailScreen} />
      <Stack.Screen name="PeriodDetail" component={PeriodDetailScreen} />
      <Stack.Screen name="Leave" component={LeaveScreen} />
      <Stack.Screen name="LeaveApply" component={LeaveApplyScreen} />
      <Stack.Screen name="LeaveDetail" component={LeaveDetailScreen} />
      <Stack.Screen name="Students" component={StudentsScreen} />
      <Stack.Screen name="StudentDetail" component={StudentDetailScreen} />
      <Stack.Screen name="Transport" component={TransportScreen} />
      <Stack.Screen name="VehicleTracking" component={VehicleTrackingScreen} />
      <Stack.Screen name="RouteDetail" component={RouteDetailScreen} />
    </Stack.Navigator>
  );
};
