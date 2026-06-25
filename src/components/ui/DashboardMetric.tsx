import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';

interface DashboardMetricProps {
  value: string | number;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export function DashboardMetric({ value, label, icon, color }: DashboardMetricProps) {
  return (
    <Card padding="md" className="flex-1">
      <View className="items-center">
        <Text
          className="text-slate-900 text-2xl font-bold"
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ lineHeight: 30 }}
        >
          {value}
        </Text>
        <View className="flex-row items-center gap-1 mt-1.5">
          <View
            className="w-5 h-5 rounded-md items-center justify-center"
            style={{ backgroundColor: color + '20' }}
          >
            <Ionicons name={icon} size={12} color={color} />
          </View>
          <Text className="text-slate-500 text-[11px] font-medium" numberOfLines={1}>
            {label}
          </Text>
        </View>
      </View>
    </Card>
  );
}
