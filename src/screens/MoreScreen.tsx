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
        <Text style={styles.sectionTitle}>All Features</Text>
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
  screen: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  sectionTitle: {
    ...theme.typography.hierarchy.body,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  gridItem: {
    width: '30%',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  gridLabel: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.text,
    fontWeight: theme.typography.weight.medium,
    textAlign: 'center',
  },
});
