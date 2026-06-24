import React, { useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Animated,
} from 'react-native';
import { theme } from '../theme';

export type CardVariant = 'default' | 'elevated' | 'interactive' | 'stat';

interface AppCardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  accentColor?: string;
  onPress?: () => void;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  accessibilityLabel?: string;
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  variant = 'default',
  accentColor,
  onPress,
  style,
  contentStyle,
  accessibilityLabel,
}) => {
  const animatedValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(animatedValue, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  }, [animatedValue]);

  const handlePressOut = useCallback(() => {
    Animated.spring(animatedValue, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [animatedValue]);

  const variantStyles = variantConfig[variant];

  const containerStyle = [
    styles.base,
    variantStyles.base,
    accentColor ? { borderLeftColor: accentColor, borderLeftWidth: 4 } : null,
    style,
  ];

  const renderContent = () => (
    <Animated.View
      style={[
        styles.content,
        variantStyles.content,
        contentStyle,
        variant === 'interactive' || variant === 'stat'
          ? { transform: [{ scale: animatedValue }] }
          : null,
      ]}
    >
      {children}
    </Animated.View>
  );

  if (onPress || variant === 'interactive' || variant === 'stat') {
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{renderContent()}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radius.md,
    overflow: 'hidden',
  },
  content: {
    padding: theme.spacing.md,
  },
});

const variantConfig: Record<
  CardVariant,
  { base: ViewStyle; content: ViewStyle }
> = {
  default: {
    base: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    content: {},
  },
  elevated: {
    base: {
      backgroundColor: theme.colors.surface,
      ...theme.shadows.md,
    },
    content: {},
  },
  interactive: {
    base: {
      backgroundColor: theme.colors.surface,
      ...theme.shadows.sm,
    },
    content: {},
  },
  stat: {
    base: {
      backgroundColor: theme.colors.surface,
      ...theme.shadows.sm,
    },
    content: {},
  },
};
