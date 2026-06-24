import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, AppHeader } from '../components';
import { AppButton } from '../components/AppButton';
import { useAuthStore } from '../store/authStore';
import { theme } from '../theme';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { login, isLoading, error, clearError } = useAuthStore();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    let isValid = true;

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleLogin = async () => {
    clearError();
    
    if (!validateForm()) {
      return;
    }

    try {
      await login({ email, password });
    } catch (error) {
      Alert.alert('Login Failed', useAuthStore.getState().error || 'An error occurred');
    }
  };

  return (
    <ScreenContainer scrollable={false}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Ionicons name="school-outline" size={64} color={theme.colors.primary} />
          <Text style={styles.title}>Teacher App</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={18} color={theme.colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, emailError && styles.inputError]}
              placeholder="Email"
              placeholderTextColor={theme.colors.textLight}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Email address"
            />
          </View>
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <View style={styles.inputWrapper}>
            <Ionicons name="key-outline" size={18} color={theme.colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, passwordError && styles.inputError]}
              placeholder="Password"
              placeholderTextColor={theme.colors.textLight}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
              }}
              secureTextEntry
              autoCapitalize="none"
              accessibilityLabel="Password"
            />
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          <AppButton
            title={isLoading ? 'Logging in...' : 'Login'}
            variant="primary"
            onPress={handleLogin}
            loading={isLoading}
            leftIcon={<Ionicons name="log-in-outline" size={18} color={theme.colors.primaryContrast} />}
            style={styles.button}
            accessibilityLabel="Login to your account"
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[6],
    backgroundColor: theme.colors.background,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing[8],
  },
  title: {
    ...theme.typography.hierarchy.display,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.hierarchy.body,
    color: theme.colors.textSecondary,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    ...theme.typography.hierarchy.caption,
    marginBottom: theme.spacing.md,
    marginLeft: theme.spacing.xs,
  },
  button: {
    marginTop: theme.spacing.lg,
    width: '100%',
  },
});
