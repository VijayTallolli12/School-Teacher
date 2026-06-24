import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { LoadingScreen } from './LoadingScreen';

interface ScreenLayoutProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  backgroundColor?: string;
  loading?: boolean;
  loadingMessage?: string;
  empty?: boolean;
  emptyContent?: React.ReactNode;
  keyboardAvoiding?: boolean;
  bottomInset?: boolean;
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  scrollable = true,
  style,
  contentContainerStyle,
  backgroundColor = theme.colors.background,
  loading = false,
  loadingMessage,
  empty = false,
  emptyContent,
  keyboardAvoiding = true,
  bottomInset = true,
}) => {
  const insets = useSafeAreaInsets();

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
        <LoadingScreen message={loadingMessage} />
      </SafeAreaView>
    );
  }

  const content = (
    <View style={[styles.inner, style, { backgroundColor, paddingBottom: bottomInset ? insets.bottom + theme.spacing.md : theme.spacing.md }]}>
      {empty ? emptyContent ?? null : children}
    </View>
  );

  if (!scrollable) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          {content}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle, { paddingTop: theme.spacing.md, paddingBottom: bottomInset ? insets.bottom + theme.spacing.md : theme.spacing.md }]}
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
  },
  flex: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
});
