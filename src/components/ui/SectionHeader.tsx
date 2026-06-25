import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  if (actionLabel && onAction) {
    return (
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
          {title}
        </Text>
        <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
          <Text className="text-primary-600 text-xs font-semibold">{actionLabel}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="pt-5 pb-1">
      <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
        {title}
      </Text>
    </View>
  );
}
