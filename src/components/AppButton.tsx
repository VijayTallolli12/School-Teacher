import React, { useRef, useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  Animated,
} from 'react-native';
import { theme } from '../theme';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'destructive'
  | 'destructive-ghost';

export interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  variant = 'primary',
  loading = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  ...props
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

  const animatedStyle = {
    transform: [{ scale: animatedValue }],
  };

  const variantStyles = variants[variant];
  const disabledStyle = loading || props.disabled ? styles.disabled : {};

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.baseButton, variantStyles.button, style, disabledStyle]}
      disabled={loading || props.disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...props}
    >
      <Animated.View style={[styles.content, animatedStyle]}>
        {leftIcon && !loading && (
          <Animated.View style={styles.iconContainer}>{leftIcon}</Animated.View>
        )}

        {loading ? (
          <ActivityIndicator size="small" color={variantStyles.text.color} />
        ) : (
          <Text style={[styles.baseText, variantStyles.text, textStyle]}>
            {title}
          </Text>
        )}

        {rightIcon && !loading && (
          <Animated.View style={styles.iconContainer}>{rightIcon}</Animated.View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    height: 48,
    minWidth: 48,
    borderRadius: theme.radius.button,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    flexDirection: 'row',
    ...theme.shadows.xs,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    fontSize: theme.typography.fontSize.lg,
    textAlign: 'center',
    fontWeight: theme.typography.weight.semibold,
  },
  iconContainer: {
    marginHorizontal: theme.spacing.sm,
  },
  disabled: {
    opacity: 0.6,
  },
});

const variants: {
  [key in ButtonVariant]: { button: ViewStyle; text: TextStyle };
} = {
  primary: {
    button: {
      backgroundColor: theme.colors.primary,
    },
    text: {
      color: theme.colors.primaryContrast,
    },
  },
  secondary: {
    button: {
      backgroundColor: theme.colors.secondary,
      borderWidth: 1,
      borderColor: theme.colors.outline,
    },
    text: {
      color: theme.colors.text,
    },
  },
  ghost: {
    button: {
      backgroundColor: 'transparent',
      shadowColor: 'transparent',
    },
    text: {
      color: theme.colors.primary,
    },
  },
  destructive: {
    button: {
      backgroundColor: theme.colors.error,
    },
    text: {
      color: theme.colors.surface,
    },
  },
  'destructive-ghost': {
    button: {
      backgroundColor: 'transparent',
      shadowColor: 'transparent',
    },
    text: {
      color: theme.colors.error,
    },
  },
};