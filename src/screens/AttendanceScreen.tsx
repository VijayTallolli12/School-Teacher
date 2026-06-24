import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components';
import { AppButton } from '../components/AppButton';
import { EmptyState } from '../components/EmptyState';
import { SkeletonList, SkeletonCard } from '../components/SkeletonLoader';
import {
  ClassSelector,
  StudentAttendanceCard,
  AttendanceSummary,
} from '../components';
import { useClasses, useStudents, useMarkAttendance } from '../hooks/useAttendance';
import { TeacherClass, AttendanceStudent, AttendanceMarkingRecord } from '../types';
import { theme } from '../theme';

type AttendanceStatus = 'present' | 'absent' | 'late';

export const AttendanceScreen: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<TeacherClass | null>(null);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{
    processedCount: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
  } | null>(null);

  const { data: classes, isLoading: classesLoading, error: classesError, refetch: refetchClasses } = useClasses();
  const { data: students, isLoading: studentsLoading, error: studentsError, refetch: refetchStudents } = useStudents(
    selectedClass?.id || ''
  );
  const { mutate: markAttendance, isPending: isSubmitting, error: submitError } = useMarkAttendance();

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmit = () => {
    // Validation
    if (!selectedClass) {
      Alert.alert('Error', 'Please select a class first');
      return;
    }

    if (!students || students.length === 0) {
      Alert.alert('Error', 'No students loaded for this class');
      return;
    }

    const markedCount = Object.keys(attendanceMap).length;
    if (markedCount === 0) {
      Alert.alert('Error', 'Please mark attendance for at least one student');
      return;
    }

    if (markedCount < students.length) {
      Alert.alert(
        'Incomplete Attendance',
        `You have marked ${markedCount} out of ${students.length} students. Do you want to submit?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Submit',
            onPress: submitAttendance,
          },
        ]
      );
    } else {
      submitAttendance();
    }
  };

  const submitAttendance = () => {
    if (!selectedClass) {
      Alert.alert('Error', 'Please select a class first');
      return;
    }

    const attendance: AttendanceMarkingRecord[] = Object.entries(attendanceMap).map(([studentId, status]) => ({
      studentId,
      status,
    }));

    const payload = {
      classId: selectedClass.id,
      date: new Date().toISOString().split('T')[0],
      attendance,
    };

    markAttendance(payload, {
      onSuccess: (data) => {
        setSuccessData(data.data);
        setShowSuccess(true);
        setAttendanceMap({});
        setSelectedClass(null);
      },
      onError: (error) => {
        Alert.alert('Error', error.message || 'Failed to submit attendance');
      },
    });
  };

  const handleRetry = () => {
    if (classesError) {
      refetchClasses();
    }
    if (studentsError) {
      refetchStudents();
    }
  };

  const handleReset = () => {
    setShowSuccess(false);
    setSuccessData(null);
    setAttendanceMap({});
    setSelectedClass(null);
  };

  // Error state
  if (classesError) {
    return (
      <ScreenContainer>
        <EmptyState
          icon="school-outline"
          title="Unable to Load Classes"
          message={classesError.message || 'Please check your connection and try again'}
          actionLabel="Retry"
          onAction={handleRetry}
        />
      </ScreenContainer>
    );
  }

  // Success state
  if (showSuccess && successData) {
    return (
      <ScreenContainer>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={80} color={theme.colors.success} style={styles.successIcon} />
            <Text style={styles.successTitle}>Attendance Saved!</Text>
            <Text style={styles.successMessage}>
              Attendance has been successfully recorded and notifications have been sent.
            </Text>
            <AttendanceSummary
              processedCount={successData.processedCount}
              presentCount={successData.presentCount}
              absentCount={successData.absentCount}
              lateCount={successData.lateCount}
            />
            <AppButton
              title="Mark Another Class"
              variant="primary"
              onPress={handleReset}
              style={styles.successButton}
            />
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  if (classesLoading) {
    return (
      <ScreenContainer>
        <View style={styles.container}>
          <View style={styles.skeletonContainer}>
            <SkeletonCard lines={1} style={styles.skeletonTitleOnly} />
            <View style={styles.skeletonChips}>
              <SkeletonCard lines={1} style={styles.skeletonChipItem} />
              <SkeletonCard lines={1} style={styles.skeletonChipItem} />
              <SkeletonCard lines={1} style={styles.skeletonChipItem} />
            </View>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Mark Attendance</Text>

        {classes && classes.length > 0 && (
          <ClassSelector
            classes={classes}
            selectedClass={selectedClass}
            onSelectClass={setSelectedClass}
          />
        )}

        {studentsError && (
          <View style={styles.inlineErrorContainer}>
            <Text style={styles.errorMessage}>
              {studentsError.message || 'Failed to load students'}
            </Text>
            <AppButton title="Retry" variant="ghost" onPress={handleRetry} />
          </View>
        )}

        {studentsLoading && selectedClass && (
          <View style={styles.studentsContainer}>
            <SkeletonList count={4} />
          </View>
        )}

        {students && students.length > 0 && (
          <View style={styles.studentsContainer}>
            <Text style={styles.sectionTitle}>
              Students ({students.length})
            </Text>
            {students.map((student) => (
              <StudentAttendanceCard
                key={student.id}
                student={student}
                status={attendanceMap[student.id] || null}
                onStatusChange={(status) => handleStatusChange(student.id, status)}
              />
            ))}
          </View>
        )}

        {selectedClass && students && students.length > 0 && (
          <View style={styles.submitContainer}>
            <AppButton
              title="Submit Attendance"
              variant="primary"
              onPress={handleSubmit}
              loading={isSubmitting}
              style={styles.submitButton}
            />
          </View>
        )}
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
    paddingBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  studentsContainer: {
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  submitContainer: {
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  submitButton: {
    width: '100%',
  },
  errorMessage: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  inlineErrorContainer: {
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  successContainer: {
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  successIcon: {
    marginBottom: theme.spacing.lg,
  },
  successTitle: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  successMessage: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  successButton: {
    minWidth: 200,
  },
  skeletonContainer: {
    padding: theme.spacing.md,
  },
  skeletonChips: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  skeletonTitleOnly: {
    marginBottom: 0,
  },
  skeletonChipItem: {
    width: 120,
  },
});
