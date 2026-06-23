import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer, AppHeader } from '../components';

export const AttendanceScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <AppHeader title="Attendance" />
      <View style={styles.container}>
        <Text style={styles.text}>Attendance Screen</Text>
        <Text style={styles.subtext}>Manage student attendance</Text>
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
