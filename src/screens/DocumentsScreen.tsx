import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AppHeader, EmptyState, ScreenContainer } from '../components';
import { Card } from '../components/ui/Card';
import { theme } from '../theme';

const DOCUMENT_TYPES = [
  { label: 'Homework Attachments', icon: 'document-attach-outline' as const, color: '#D97706', tint: '#FFFBEB' },
  { label: 'Exam Documents', icon: 'reader-outline' as const, color: '#4F46E5', tint: '#EEF2FF' },
  { label: 'School Circulars', icon: 'megaphone-outline' as const, color: '#B45309', tint: '#FFFBEB' },
];

export const DocumentsScreen: React.FC = () => {
  return (
    <ScreenContainer scrollable={false} backgroundColor={theme.colors.backgroundSecondary}>
      <AppHeader title="Documents" showBackButton onBackPress={() => router.back()} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {DOCUMENT_TYPES.map((item) => (
            <Card key={item.label} padding="md" className="mb-3">
              <View style={styles.row}>
                <View style={[styles.iconBox, { backgroundColor: item.tint }]}>
                  <Ionicons name={item.icon} size={18} color={item.color} />
                </View>
                <Text style={styles.label}>{item.label}</Text>
              </View>
            </Card>
          ))}
        </View>
        <EmptyState
          icon="folder-open-outline"
          title="No documents found"
          message="Shared documents and attachments will appear here."
        />
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: theme.spacing.xxl },
  grid: { marginBottom: theme.spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.icon,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  label: { ...theme.typography.hierarchy.bodySmall, fontWeight: theme.typography.weight.bold, color: theme.colors.text },
});
