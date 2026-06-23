import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { ScreenContainer } from '../components';
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
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Unable to Load Classes</Text>
          <Text style={styles.errorMessage}>
            {classesError.message || 'Please check your connection and try again'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  // Success state
  if (showSuccess && successData) {
    return (
      <ScreenContainer>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.successContainer}>
            <Text style={styles.successIcon}>✅</Text>
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
            <TouchableOpacity style={styles.submitButton} onPress={handleReset}>
              <Text style={styles.submitButtonText}>Mark Another Class</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // Loading state for classes
  if (classesLoading) {
    return (
      <ScreenContainer>
        <View style={styles.container}>
          <ClassesSkeleton />
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
          <View style={styles.errorContainer}>
            <Text style={styles.errorMessage}>
              {studentsError.message || 'Failed to load students'}
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {studentsLoading && selectedClass && <StudentsSkeleton />}

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
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={theme.colors.background} />
              ) : (
                <Text style={styles.submitButtonText}>Submit Attendance</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

const ClassesSkeleton: React.FC = () => {
  return (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonChips}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.skeletonChip} />
        ))}
      </View>
    </View>
  );
};

const StudentsSkeleton: React.FC = () => {
  return (
    <View style={styles.studentsContainer}>
      <View style={styles.skeletonTitle} />
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={styles.skeletonCard} />
      ))}
    </View>
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
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: theme.colors.background,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
  },
  retryButtonText: {
    color: theme.colors.background,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },
  successContainer: {
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  successIcon: {
    fontSize: 80,
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
  skeletonContainer: {
    padding: theme.spacing.md,
  },
  skeletonTitle: {
    height: 24,
    width: 150,
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    marginBottom: theme.spacing.md,
  },
  skeletonChips: {
    flexDirection: 'row',
  },
  skeletonChip: {
    height: 40,
    width: 120,
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    marginRight: theme.spacing.sm,
  },
  skeletonCard: {
    height: 100,
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.sm,
  },
});
