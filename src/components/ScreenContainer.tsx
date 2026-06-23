import React from 'react';
import { View, StyleSheet, ScrollView, ViewStyle } from 'react-native';
import { theme } from '../theme';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  backgroundColor?: string;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = true,
  style,
  backgroundColor = theme.colors.background,
}) => {
  const containerStyle = [
    styles.container,
    { backgroundColor },
    style,
  ];

  if (scrollable) {
    return (
      <ScrollView style={containerStyle} contentContainerStyle={styles.content}>
        {children}
      </ScrollView>
    );
  }

  return <View style={containerStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});
