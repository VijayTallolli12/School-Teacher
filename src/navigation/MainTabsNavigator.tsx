import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  DashboardScreen,
  AttendanceScreen,
  HomeworkScreen,
  ProfileScreen,
  TimetableScreen,
  StudentsScreen,
} from '../screens';
import { MainTabParamList } from '../types';
import { NotificationsNavigator } from './NotificationsNavigator';
import { useUnreadCount } from '../hooks/useNotifications';
import { theme } from '../theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabs: React.FC = () => {
  const { data: unreadCount = 0 } = useUnreadCount();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ tabBarLabel: 'Dashboard' }}
      />
      <Tab.Screen
        name="Students"
        component={StudentsScreen}
        options={{ tabBarLabel: 'Students' }}
      />
      <Tab.Screen 
        name="Timetable" 
        component={TimetableScreen}
        options={{ tabBarLabel: 'Timetable' }}
      />
      <Tab.Screen 
        name="Attendance" 
        component={AttendanceScreen}
        options={{ tabBarLabel: 'Attendance' }}
      />
      <Tab.Screen 
        name="Homework" 
        component={HomeworkScreen}
        options={{ tabBarLabel: 'Homework' }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsNavigator}
        options={{
          tabBarLabel: 'Alerts',
          tabBarBadge: unreadCount > 0 ? (unreadCount > 99 ? '99+' : unreadCount) : undefined,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};
