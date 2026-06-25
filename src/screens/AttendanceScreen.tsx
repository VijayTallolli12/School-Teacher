import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, AppHeader } from '../components';
import { AppButton } from '../components/AppButton';
import { EmptyState } from '../components/EmptyState';
import { SkeletonList, SkeletonCard } from '../components/SkeletonLoader';
import { Card } from '../components/ui/Card';
import {
  ClassSelector,
  StudentAttendanceCard,
  AttendanceSummary,
} from '../components';
import { useClasses, useStudents, useMarkAttendance } from '../hooks/useAttendance';
import { TeacherClass, AttendanceStudent, AttendanceMarkingRecord, MarkAttendancePayload, MarkAttendanceResponse } from '../types';
import { theme } from '../theme';

type AttendanceStatus = 'present' | 'absent' | 'late';

export const AttendanceScreen: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<TeacherClass | null>(null);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{
    markedCount: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
  } | null>(null);
  const [isAlreadyMarked, setIsAlreadyMarked] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  // Reset success state when screen loses focus (fixes P9: success screen persistence)
  useFocusEffect(
    useCallback(() => {
      return () => {
        setShowSuccess(false);
        setSuccessData(null);
      };
    }, [])
  );

  const { data: classes, isLoading: classesLoading, error: classesError, refetch: refetchClasses } = useClasses();
  const { data: students, isLoading: studentsLoading, error: studentsError, refetch: refetchStudents } = useStudents(
    selectedClass?.id || ''
  );
  const { mutate: markAttendance, isPending: isSubmitting } = useMarkAttendance();

  useEffect(() => {
    if (classes && classes.length === 1 && !selectedClass) {
      setSelectedClass(classes[0]);
    }
  }, [classes, selectedClass]);

  // Reset success state on every focus (fixes P9: navigation state persistence)
  useFocusEffect(
    useCallback(() => {
      if (showSuccess) {
        setShowSuccess(false);
        setSuccessData(null);
      }
    }, [])
  );

  // Detect if attendance already marked
  useEffect(() => {
    if (students && students.length > 0) {
      const hasExisting = students.some((s) => s.attendanceStatus != null);
      setIsAlreadyMarked(hasExisting);
      if (hasExisting) {
        const prefill: Record<string, AttendanceStatus> = {};
        students.forEach((s) => {
          if (s.attendanceStatus) prefill[s.id] = s.attendanceStatus;
        });
        setAttendanceMap(prefill);
      } else {
        setAttendanceMap({});
      }
    }
  }, [students]);

  const handleStatusChange = useCallback((studentId: string, status: AttendanceStatus) => {
    if (isAlreadyMarked) return;
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  }, [isAlreadyMarked]);

  const handleSubmit = useCallback(() => {
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

    const doSubmit = () => {
      const records: AttendanceMarkingRecord[] = Object.entries(attendanceMap).map(([studentId, status]) => ({
        student_id: Number(studentId),
        status,
      }));
      const payload: MarkAttendancePayload = {
        class_section_id: Number(selectedClass.id),
        attendance_date: new Date().toISOString().split('T')[0],
        students: records,
      };
      markAttendance(payload, {
        onSuccess: (data: MarkAttendanceResponse) => {
          const records = data.data.records;
          setSuccessData({
            markedCount: data.data.marked_count,
            presentCount: records.filter((r) => r.status === 'present').length,
            absentCount: records.filter((r) => r.status === 'absent').length,
            lateCount: records.filter((r) => r.status === 'late').length,
          });
          setShowSuccess(true);
          setAttendanceMap({});
          setSelectedClass(null);
          setIsAlreadyMarked(false);
        },
        onError: (error) => {
          const message = error.message || '';
          if (message.toLowerCase().includes('already') || message.toLowerCase().includes('already marked')) {
            Alert.alert('Already Marked', 'Attendance has already been recorded for this class today.');
          } else {
            Alert.alert('Error', message || 'Failed to submit attendance');
          }
        },
      });
    };

    if (markedCount < students.length) {
      Alert.alert(
        'Incomplete',
        `You have marked ${markedCount} out of ${students.length} students. Submit anyway?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Submit', onPress: doSubmit },
        ]
      );
    } else {
      doSubmit();
    }
  }, [selectedClass, students, attendanceMap, markAttendance]);

  const handleReset = useCallback(() => {
    setShowSuccess(false);
    setSuccessData(null);
    setAttendanceMap({});
    setSelectedClass(null);
    setIsAlreadyMarked(false);
  }, []);

  const handleEditAttendance = useCallback(() => {
    setIsAlreadyMarked(false);
  }, []);

  // Classes loading
  if (classesLoading) {
    return (
      <ScreenContainer>
        <AppHeader title="Attendance" />
        <View className="flex-1 bg-slate-50">
          <View>
            <SkeletonCard lines={1} />
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
              <SkeletonCard lines={1} style={{ width: 120 }} />
              <SkeletonCard lines={1} style={{ width: 120 }} />
              <SkeletonCard lines={1} style={{ width: 120 }} />
            </View>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  // Classes error
  if (classesError) {
    return (
      <ScreenContainer>
        <AppHeader title="Attendance" />
        <EmptyState
          icon="school-outline"
          title="Unable to Load Classes"
          message={classesError.message || 'Please check your connection and try again'}
          actionLabel="Retry"
          onAction={refetchClasses}
        />
      </ScreenContainer>
    );
  }

  // Success screen (redesigned)
  if (showSuccess && successData) {
    return (
      <ScreenContainer scrollable={false}>
        <AppHeader title="Attendance" />
        <View className="flex-1 bg-slate-50 justify-center">
          <Card padding="lg" className="items-center">
            <View className="w-14 h-14 bg-green-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="checkmark-circle" size={32} color="#22C55E" />
            </View>
            <Text className="text-slate-900 text-xl font-bold mb-1">Attendance Saved</Text>
            <Text className="text-slate-400 text-xs text-center mb-5">
              Attendance recorded and notifications sent.
            </Text>
            <AttendanceSummary
              processedCount={successData.markedCount}
              presentCount={successData.presentCount}
              absentCount={successData.absentCount}
              lateCount={successData.lateCount}
            />
            <View className="w-full mt-5">
              <AppButton
                title="Mark Another Class"
                variant="primary"
                onPress={handleReset}
              />
            </View>
          </Card>
        </View>
      </ScreenContainer>
    );
  }

  // Main screen
  return (
    <ScreenContainer scrollable={false}>
      <AppHeader title="Attendance" />
      <ScrollView
        ref={scrollRef}
        className="flex-1 bg-slate-50"
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
        {classes && classes.length > 0 && (
          <View className="pt-4">
            <ClassSelector
              classes={classes}
              selectedClass={selectedClass}
              onSelectClass={setSelectedClass}
            />
          </View>
        )}

        {studentsError && (
          <View className="items-center py-6">
            <Text className="text-slate-400 text-sm mb-3 text-center">
              {studentsError.message || 'Failed to load students'}
            </Text>
            <AppButton title="Retry" variant="ghost" onPress={() => refetchStudents()} />
          </View>
        )}

        {studentsLoading && selectedClass && (
          <View className="mt-4">
            <SkeletonList count={4} />
          </View>
        )}

        {students && students.length > 0 && (
          <View className="mt-4">
            {isAlreadyMarked && (
              <Card padding="sm" className="mb-3 flex-row items-center gap-2 bg-amber-50 border-amber-200">
                <Ionicons name="information-circle-outline" size={18} color="#D97706" />
                <Text className="text-amber-700 text-sm flex-1">
                  Attendance already submitted for today
                </Text>
                <TouchableOpacity onPress={handleEditAttendance} activeOpacity={0.7}>
                  <Text className="text-primary-600 text-sm font-semibold">Edit</Text>
                </TouchableOpacity>
              </Card>
            )}
            <Text className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">
              Students ({students.length})
            </Text>
            {students.map((student, index) => (
              <StudentAttendanceCard
                key={student.id ?? `student-${index}`}
                student={student}
                status={attendanceMap[student.id] || null}
                onStatusChange={(status) => handleStatusChange(student.id, status)}
              />
            ))}
          </View>
        )}

        {selectedClass && students && students.length > 0 && (
          <View className="mt-6">
            <AppButton
              title={isAlreadyMarked ? 'Update Attendance' : 'Submit Attendance'}
              variant="primary"
              onPress={handleSubmit}
              loading={isSubmitting}
              className="w-full"
            />
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
};
