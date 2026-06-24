import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, AppCard } from '../components';
import { AppButton } from '../components/AppButton';
import { EmptyState } from '../components/EmptyState';
import { SkeletonCard } from '../components/SkeletonLoader';
import { HomeworkHeader, HomeworkStatusBadge } from '../components';
import { useHomeworkById } from '../hooks/useHomework';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { theme } from '../theme';
import { getHomeworkStatusLabel, getHomeworkStatusColor } from '../utils/homework';

type HomeworkDetailRouteProp = RouteProp<{ HomeworkDetail: { homeworkId: string } }, 'HomeworkDetail'>;

export const HomeworkDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<HomeworkDetailRouteProp>();
  const { homeworkId } = route.params;
  const { data: homework, isLoading, error, refetch } = useHomeworkById(homeworkId);

  const handleRetry = () => {
    refetch();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const statusLabel = homework ? getHomeworkStatusLabel(homework) : 'Upcoming';
  const statusColor = getHomeworkStatusColor(statusLabel);

  if (error) {
    return (
      <ScreenContainer>
        <EmptyState
          icon="cloud-offline-outline"
          title="Unable to Load Homework"
          message={error.message || 'Please check your connection and try again'}
          actionLabel="Retry"
          onAction={handleRetry}
        />
      </ScreenContainer>
    );
  }

  if (isLoading || !homework) {
    return (
      <ScreenContainer>
        <HomeworkHeader title="Homework Details" />
        <View style={styles.container}>
          <SkeletonCard lines={6} style={styles.skeletonCard} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <HomeworkHeader title="Homework Details" />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <AppCard variant="elevated">
          <View style={styles.header}>
            <View style={styles.titleBlock}>
              <Text style={styles.title}>{homework.title}</Text>
              <HomeworkStatusBadge label={statusLabel} color={statusColor} />
            </View>
            <AppButton
              title="Edit"
              variant="ghost"
              leftIcon={<Ionicons name="create-outline" size={16} color={theme.colors.primary} />}
              onPress={() => (navigation as any).navigate('HomeworkCreate', { homeworkId })}
              style={styles.editButton}
            />
          </View>
          <Text style={styles.description}>{homework.description}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Class Information</Text>
            <View style={styles.detailRow}>
              <Ionicons name="school-outline" size={16} color={theme.colors.textSecondary} style={styles.detailIcon} />
              <Text style={styles.detailLabel}>Class:</Text>
              <Text style={styles.detailValue}>{homework.class} - {homework.section}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="book-outline" size={16} color={theme.colors.textSecondary} style={styles.detailIcon} />
              <Text style={styles.detailLabel}>Subject:</Text>
              <Text style={styles.detailValue}>{homework.subject}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dates</Text>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} style={styles.detailIcon} />
              <Text style={styles.detailLabel}>Created:</Text>
              <Text style={styles.detailValue}>{formatDate(homework.createdAt)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="alarm-outline" size={16} color={statusColor} style={styles.detailIcon} />
              <Text style={styles.detailLabel}>Due:</Text>
              <Text style={[styles.detailValue, { color: statusColor }]}>
                {formatDate(homework.dueDate)}
              </Text>
            </View>
          </View>
        </AppCard>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  skeletonCard: {
    margin: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  titleBlock: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  editButton: {
    alignSelf: 'flex-start',
  },
  section: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeight.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  detailIcon: {
    marginRight: theme.spacing.sm,
  },
  detailLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
    width: 80,
  },
  detailValue: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.bold,
    flex: 1,
    textAlign: 'right',
  },
});
