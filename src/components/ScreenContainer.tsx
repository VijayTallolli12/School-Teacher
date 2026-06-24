import React from 'react';
import { ViewStyle } from 'react-native';
import { ScreenLayout } from './ScreenLayout';

interface ScreenContainerProps {
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

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = true,
  style,
  contentContainerStyle,
  backgroundColor,
  loading = false,
  loadingMessage,
  empty = false,
  emptyContent,
  keyboardAvoiding = true,
  bottomInset = true,
}) => {
  return (
    <ScreenLayout
      scrollable={scrollable}
      style={style}
      contentContainerStyle={contentContainerStyle}
      backgroundColor={backgroundColor}
      loading={loading}
      loadingMessage={loadingMessage}
      empty={empty}
      emptyContent={emptyContent}
      keyboardAvoiding={keyboardAvoiding}
      bottomInset={bottomInset}
    >
      {children}
    </ScreenLayout>
  );
};
