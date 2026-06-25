import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppHeader, ScreenContainer } from '../components';
import { AppCard } from '../components/AppCard';
import { theme } from '../theme';
import { AppStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

interface MoreItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: keyof AppStackParamList;
  color: string;
}

const moreItems: MoreItem[] = [
  { label: 'Students', icon: 'people-outline', route: 'Students', color: theme.colors.info },
  { label: 'Timetable', icon: 'calendar-outline', route: 'PeriodDetail', color: theme.colors.secondary },
  { label: 'Exams', icon: 'book-outline', route: 'Exams', color: theme.colors.warning },
  { label: 'Leave', icon: 'exit-outline', route: 'Leave', color: theme.colors.error },
  { label: 'Transport', icon: 'bus-outline', route: 'Transport', color: theme.colors.primary },
  { label: 'Profile', icon: 'person-outline', route: 'Profile', color: theme.colors.text },
];

export const MoreScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ScreenContainer scrollable={false} backgroundColor={theme.colors.backgroundSecondary}>
      <AppHeader title="More" />
      <ScrollView contentContainerStyle={styles.content}>
        <View className="pt-5 pb-3">
          <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            All Features
          </Text>
        </View>
        <View style={styles.grid}>
          {moreItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.gridItem}
              onPress={() => navigation.navigate(item.route as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <Text style={styles.gridLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridLabel: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '600',
    textAlign: 'center',
  },
});
