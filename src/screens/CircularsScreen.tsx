import React, { useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AppHeader, EmptyState, ScreenContainer, SkeletonList } from '../components';
import { Card } from '../components/ui/Card';
import { useNotifications } from '../hooks/useNotifications';
import { theme } from '../theme';

export const CircularsScreen: React.FC = () => {
  const { data = [], isLoading, isError, refetch, isRefetching } = useNotifications();

  const circulars = useMemo(
    () => data.filter((item) => {
      const text = `${item?.title ?? ''} ${item?.message ?? ''} ${item?.type ?? ''}`.toLowerCase();
      return text.includes('circular') || text.includes('notice') || text.includes('announcement') || item?.type === 'system';
    }),
    [data]
  );

  if (isLoading) {
    return (
      <ScreenContainer scrollable={false} backgroundColor={theme.colors.backgroundSecondary}>
        <AppHeader title="Circulars" showBackButton onBackPress={() => router.back()} />
        <SkeletonList count={5} style={styles.skeletonList} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={false} backgroundColor={theme.colors.backgroundSecondary}>
      <AppHeader title="Circulars" showBackButton onBackPress={() => router.back()} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={theme.colors.primary} />}
      >
        {isError ? (
          <EmptyState icon="cloud-offline-outline" title="Unable to Load Circulars" message="Pull down to retry." />
        ) : circulars.length === 0 ? (
          <EmptyState icon="megaphone-outline" title="No circulars found" message="School circulars and announcements will appear here." />
        ) : (
          circulars.map((item, index) => (
            <TouchableOpacity
              key={item?.id ?? `circular-${index}`}
              activeOpacity={0.72}
              onPress={() => router.push({
                pathname: '/(tabs)/notifications/[id]',
                params: {
                  id: item?.id ?? '',
                  title: item?.title ?? 'Circular',
                  body: item?.message ?? '',
                  type: item?.type ?? 'system',
                  is_read: String(!!item?.isRead),
                  created_at: item?.createdAt ?? '',
                },
              })}
              accessibilityRole="button"
              accessibilityLabel={`Open ${item?.title ?? 'circular'}`}
            >
              <Card padding="md" className="mb-3">
                <View style={styles.row}>
                  <View style={styles.iconBox}>
                    <Ionicons name="megaphone-outline" size={18} color="#B45309" />
                  </View>
                  <View style={styles.textBox}>
                    <Text style={styles.title} numberOfLines={1}>{item?.title ?? 'Circular'}</Text>
                    <Text style={styles.message} numberOfLines={2}>{item?.message ?? ''}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
                </View>
              </Card>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: theme.spacing.xxl },
  skeletonList: { padding: theme.spacing.md },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.icon,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFBEB',
    marginRight: theme.spacing.md,
  },
  textBox: { flex: 1 },
  title: { ...theme.typography.hierarchy.bodySmall, fontWeight: theme.typography.weight.bold, color: theme.colors.text },
  message: { ...theme.typography.hierarchy.caption, color: theme.colors.textSecondary, marginTop: 2 },
});
