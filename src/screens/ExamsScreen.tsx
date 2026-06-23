import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer, AppHeader } from '../components';

export const ExamsScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <AppHeader title="Exams" />
      <View style={styles.container}>
        <Text style={styles.text}>Exams Screen</Text>
        <Text style={styles.subtext}>Manage exams and assessments</Text>
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
