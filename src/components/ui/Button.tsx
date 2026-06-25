import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { theme } from '@/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';

interface ButtonProps {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  loading = false,
  disabled = false,
  onPress,
  style,
  textStyle,
}) => {
  const variantStyle = variants[variant];
  const isDisabled = loading || disabled;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.base, variantStyle.button, isDisabled && styles.disabled, style]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? theme.colors.textInverse : theme.colors.primary}
        />
      ) : (
        <Text style={[styles.text, variantStyle.text, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: theme.radius.button,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    flexDirection: 'row',
  },
  text: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.weight.semibold,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});

const variants: Record<ButtonVariant, { button: ViewStyle; text: TextStyle }> = {
  primary: {
    button: {
      backgroundColor: theme.colors.primary,
    },
    text: {
      color: theme.colors.onPrimary,
    },
  },
  secondary: {
    button: {
      backgroundColor: theme.colors.surfaceSecondary,
    },
    text: {
      color: theme.colors.textPrimary,
    },
  },
  ghost: {
    button: {
      backgroundColor: 'transparent',
    },
    text: {
      color: theme.colors.primary,
    },
  },
  outline: {
    button: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.outline,
    },
    text: {
      color: theme.colors.primary,
    },
  },
  danger: {
    button: {
      backgroundColor: theme.colors.error,
    },
    text: {
      color: theme.colors.onError,
    },
  },
};
