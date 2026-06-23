import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer, AppHeader } from '../components';

export const DashboardScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <AppHeader title="Dashboard" />
      <View style={styles.container}>
        <Text style={styles.text}>Dashboard Screen</Text>
        <Text style={styles.subtext}>Welcome to the Teacher App</Text>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
  },
});
