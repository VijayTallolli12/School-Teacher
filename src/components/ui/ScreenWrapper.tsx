import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme';
import { Loading } from './Loading';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';

interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  loading?: boolean;
  loadingMessage?: string;
  error?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  empty?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyIcon?: keyof typeof Ionicons.glyphMap;
  emptyAction?: { label: string; onAction: () => void };
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  scrollable = true,
  style,
  contentContainerStyle,
  loading = false,
  loadingMessage,
  error = false,
  errorMessage,
  onRetry,
  empty = false,
  emptyTitle,
  emptyMessage,
  emptyIcon,
  emptyAction,
}) => {
  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, style]}>
        <Loading message={loadingMessage} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.safeArea, style]}>
        <ErrorState
          title="Error"
          message={errorMessage}
          onRetry={onRetry}
        />
      </SafeAreaView>
    );
  }

  if (empty) {
    return (
      <SafeAreaView style={[styles.safeArea, style]}>
        <EmptyState
          title={emptyTitle || 'No data'}
          message={emptyMessage}
          icon={emptyIcon}
          actionLabel={emptyAction?.label}
          onAction={emptyAction?.onAction}
        />
      </SafeAreaView>
    );
  }

  const content = (
    <View style={[styles.content, style]}>
      {children}
    </View>
  );

  if (!scrollable) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {content}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {content}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.lg,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.lg,
  },
});
