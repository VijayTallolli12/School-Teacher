import React, { useState } from 'react';
import { cardShadow } from "../theme/shadows";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScreenContainer } from '../components';
import { useAuthStore } from '../store/authStore';


export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { login, isLoading, error, clearError } = useAuthStore();

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
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
      // Success — move to the main app. (This screen unmounts; no redirect is
      // needed from the root index because it is no longer mounted.)
      router.replace('/(tabs)');
    } catch (err) {
      Alert.alert('Login Failed', useAuthStore.getState().error || 'An error occurred');
    }
  };

  return (
    <ScreenContainer scrollable={false} style={{ paddingHorizontal: 0, paddingBottom: 0 }} bottomInset={false}>
      <View className="flex-1 bg-surface-background">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 32 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo / Header */}
            <View className="items-center mb-10">
              <View className="w-20 h-20 bg-primary-100 rounded-3xl items-center justify-center" style={cardShadow}>
                <Ionicons name="school-outline" size={40} color="#4F46E5" />
              </View>
              <Text className="text-slate-900 text-[28px] font-bold mt-5">Teacher App</Text>
              <Text className="text-slate-400 text-sm mt-1.5">Sign in to continue</Text>
            </View>

            {/* Form */}
            <View className="gap-5">
              {/* Email */}
              <View>
                <Text className="text-slate-700 text-sm font-semibold mb-1.5">Email</Text>
                <View className={`flex-row items-center bg-white border rounded-xl px-4 ${emailError ? 'border-status-error' : 'border-surface-border'}`} style={cardShadow}>
                  <Ionicons name="mail-outline" size={18} color="#94A3B8" />
                  <TextInput
                    className="flex-1 text-slate-900 text-sm py-3 ml-2"
                    placeholder="Email"
                    placeholderTextColor="#94A3B8"
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
                {emailError ? <Text className="text-status-error text-xs mt-1">{emailError}</Text> : null}
              </View>

              {/* Password */}
              <View>
                <Text className="text-slate-700 text-sm font-semibold mb-1.5">Password</Text>
                <View className={`flex-row items-center bg-white border rounded-xl px-4 ${passwordError ? 'border-status-error' : 'border-surface-border'}`} style={cardShadow}>
                  <Ionicons name="key-outline" size={18} color="#94A3B8" />
                  <TextInput
                    className="flex-1 text-slate-900 text-sm py-3 ml-2"
                    placeholder="Password"
                    placeholderTextColor="#94A3B8"
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
                {passwordError ? <Text className="text-status-error text-xs mt-1">{passwordError}</Text> : null}
              </View>

              {error ? (
                <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <Text className="text-red-700 text-sm">{error}</Text>
                </View>
              ) : null}

              {/* Submit */}
              <TouchableOpacity
                className={`flex-row items-center justify-center py-4 rounded-2xl mt-2 ${isLoading ? 'bg-primary-400' : 'bg-primary-600'}`}
                style={{ shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 }}
                activeOpacity={0.8}
                onPress={handleLogin}
                disabled={isLoading}
                accessibilityRole="button"
                accessibilityLabel="Login to your account"
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="log-in-outline" size={18} color="#FFFFFF" />
                    <Text className="text-white font-semibold text-[15px] ml-2">Login</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ScreenContainer>
  );
};
