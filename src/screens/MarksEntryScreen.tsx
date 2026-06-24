import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer, AppHeader } from '../components';
import { AppButton } from '../components/AppButton';
import { MarksEntryRow } from '../components/MarksEntryRow';
import { SkeletonList } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import { useMarks, useSaveMarks } from '../hooks/useExams';
import { useExamDetail } from '../hooks/useExams';
import { theme } from '../theme';
import { AppStackParamList, MarksEntry as MarksEntryType } from '../types';

type MarksEntryRouteProp = RouteProp<AppStackParamList, 'MarksEntry'>;
type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

interface MarksRecord {
  studentId: string;
  marks: number | null;
  error?: string;
}

export const MarksEntryScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<MarksEntryRouteProp>();
  const { examId } = route.params;
  const { data: exam } = useExamDetail(examId);
  const [classId, setClassId] = useState(exam?.className || '');
  const [subjectId, setSubjectId] = useState(exam?.subject || '');
  const { data: marksData, isLoading, error, refetch, isRefetching } = useMarks(
    examId,
    classId,
    subjectId
  );
  const saveMarksMutation = useSaveMarks();
  const [marksMap, setMarksMap] = useState<Record<string, MarksRecord>>({});
  const [isDraft, setIsDraft] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const initialMarks = React.useMemo(() => {
    if (!marksData) return {};
    const map: Record<string, MarksRecord> = {};
    marksData.forEach((entry) => {
      map[entry.studentId] = { studentId: entry.studentId, marks: entry.marks };
    });
    return map;
  }, [marksData]);

  React.useEffect(() => {
    setMarksMap(initialMarks);
  }, [initialMarks]);

  const handleChangeMarks = useCallback(
    (studentId: string, marks: number | null) => {
      setMarksMap((prev) => ({
        ...prev,
        [studentId]: { ...prev[studentId], studentId, marks, error: undefined },
      }));
    },
    []
  );

  const validateMarks = useCallback((): boolean => {
    let isValid = true;
    const updatedMap = { ...marksMap };

    if (!marksData) return false;

    marksData.forEach((entry) => {
      const record = updatedMap[entry.studentId];
      if (record && record.marks !== null) {
        if (record.marks < 0) {
          updatedMap[entry.studentId] = { ...record, error: 'Cannot be negative' };
          isValid = false;
        } else if (record.marks > entry.maxMarks) {
          updatedMap[entry.studentId] = {
            ...record,
            error: `Max ${entry.maxMarks}`,
          };
          isValid = false;
        }
      }
    });

    setMarksMap(updatedMap);
    return isValid;
  }, [marksMap, marksData]);

  const handleSave = useCallback(
    (saveAsDraft: boolean) => {
      if (!validateMarks()) {
        Alert.alert('Validation Error', 'Please fix the highlighted errors before saving.');
        return;
      }

      const marksPayload = Object.entries(marksMap)
        .filter(([_, record]) => record.marks !== null && record.marks !== undefined)
        .map(([studentId, record]) => ({
          studentId,
          marks: record.marks!,
        }));

      if (marksPayload.length === 0) {
        Alert.alert('No Marks', 'Please enter marks for at least one student.');
        return;
      }

      saveMarksMutation.mutate(
        {
          examId,
          classId: classId || exam?.className || '',
          subjectId: subjectId || exam?.subject || '',
          marks: marksPayload,
          isDraft: saveAsDraft,
        },
        {
          onSuccess: (response) => {
            Alert.alert('Success', response.message || 'Marks saved successfully', [
              {
                text: 'OK',
                onPress: () => {
                  if (!saveAsDraft) {
                    navigation.goBack();
                  }
                  refetch();
                },
              },
            ]);
          },
          onError: (err) => {
            Alert.alert('Error', err.message || 'Failed to save marks');
          },
        }
      );
    },
    [marksMap, validateMarks, examId, classId, subjectId, exam, saveMarksMutation, navigation, refetch]
  );

  const renderItem = useCallback(
    ({ item }: { item: MarksEntryType }) => (
      <MarksEntryRow
        entry={item}
        maxMarks={item.maxMarks}
        onChangeMarks={handleChangeMarks}
        error={marksMap[item.studentId]?.error}
      />
    ),
    [marksMap, handleChangeMarks]
  );

  const keyExtractor = useCallback((item: MarksEntryType) => item.studentId, []);

  if (error) {
    return (
      <ScreenContainer>
        <AppHeader title="Enter Marks" showBackButton onBackPress={() => navigation.goBack()} />
        <EmptyState
          icon="cloud-offline-outline"
          title="Unable to Load"
          message={error.message || 'Failed to load student marks data'}
          actionLabel="Retry"
          onAction={() => refetch()}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={false}>
      <AppHeader
        title="Enter Marks"
        showBackButton
        onBackPress={() => navigation.goBack()}
        rightComponent={
          exam && (
            <View style={styles.headerInfo}>
              <Text style={styles.headerMarks}>{exam.totalMarks}</Text>
              <Text style={styles.headerLabel}>max</Text>
            </View>
          )
        }
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {isLoading ? (
          <SkeletonList count={6} />
        ) : !marksData || marksData.length === 0 ? (
          <EmptyState
            icon="people-outline"
            title="No Students"
            message="No students found for this exam class and subject."
          />
        ) : (
          <>
            <View style={styles.statsBar}>
              <Ionicons name="people-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.statsText}>
                {marksData.length} students
              </Text>
              <View style={styles.statsDivider} />
              <Ionicons name="checkmark-done-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.statsText}>
                {Object.values(marksMap).filter((r) => r.marks !== null && r.marks !== undefined).length} entered
              </Text>
            </View>
            <FlatList
              ref={flatListRef}
              data={marksData}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              style={styles.list}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl
                  refreshing={isRefetching}
                  onRefresh={refetch}
                  tintColor={theme.colors.primary}
                  colors={[theme.colors.primary]}
                />
              }
            />
            <View style={styles.footer}>
              <AppButton
                title="Save Draft"
                variant="secondary"
                onPress={() => handleSave(true)}
                loading={saveMarksMutation.isPending}
                style={styles.footerButton}
              />
              <AppButton
                title="Submit Marks"
                variant="primary"
                leftIcon={<Ionicons name="checkmark-done" size={18} color={theme.colors.primaryContrast} />}
                onPress={() => handleSave(false)}
                loading={saveMarksMutation.isPending}
                style={styles.footerButton}
              />
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  headerInfo: {
    alignItems: 'center',
  },
  headerMarks: {
    ...theme.typography.hierarchy.body,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text,
  },
  headerLabel: {
    ...theme.typography.hierarchy.caption,
    fontSize: 10,
    color: theme.colors.textTertiary,
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceVariant,
    gap: 6,
  },
  statsText: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textSecondary,
  },
  statsDivider: {
    width: 1,
    height: 12,
    backgroundColor: theme.colors.border,
    marginHorizontal: 4,
  },
  list: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  listContent: {
    paddingBottom: theme.spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  footerButton: {
    flex: 1,
  },
});
