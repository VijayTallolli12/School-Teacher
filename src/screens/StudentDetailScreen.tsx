import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer, AppHeader } from '../components';
import { StudentProfileCard } from '../components/StudentProfileCard';
import { ParentInfoCard } from '../components/ParentInfoCard';
import { AttendanceSummaryCard } from '../components/AttendanceSummaryCard';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { useStudentDetail } from '../hooks/useStudents';
import { theme } from '../theme';

export const StudentDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const { studentId } = useLocalSearchParams<{ studentId: string }>();

  const {
    data: student,
    isLoading,
    isError,
    refetch,
  } = useStudentDetail(studentId);

  const handleCall = useCallback((phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() =>
      Alert.alert('Error', 'Could not initiate call')
    );
  }, []);

  const handleAttendance = useCallback(() => {
    router.push('/(tabs)/attendance');
  }, []);

  const handleHomework = useCallback(() => {
    router.push('/(tabs)/homework');
  }, []);

  if (isLoading) {
    return (
      <ScreenContainer>
        <AppHeader
          variant="secondary"
          title="Student Detail"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  if (isError || !student) {
    return (
      <ScreenContainer>
        <AppHeader
          variant="secondary"
          title="Student Detail"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.centeredContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={theme.colors.textLight} />
          <Text style={styles.errorText}>Could not load student details</Text>
          <AppButton title="Retry" variant="primary" onPress={() => refetch()} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <View style={styles.screen}>
      <AppHeader
        variant="secondary"
        title="Student Detail"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile */}
        <StudentProfileCard
          name={student.name}
          admissionNo={student.admissionNo}
          className={student.className}
          section={student.section}
          rollNumber={student.rollNumber}
          gender={student.gender}
          dateOfBirth={student.dateOfBirth}
          bloodGroup={student.bloodGroup}
        />

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <AppButton
            title="Call Parent"
            variant="secondary"
            leftIcon={<Ionicons name="call-outline" size={18} color={theme.colors.primary} />}
            onPress={() => handleCall(student.parentInfo.fatherPhone)}
            style={styles.quickActionBtn}
            accessibilityLabel="Call parent"
          />
          <AppButton
            title="Attendance"
            variant="secondary"
            leftIcon={<Ionicons name="clipboard-outline" size={18} color={theme.colors.secondary} />}
            onPress={handleAttendance}
            style={styles.quickActionBtn}
            accessibilityLabel="View attendance"
          />
          <AppButton
            title="Homework"
            variant="secondary"
            leftIcon={<Ionicons name="create-outline" size={18} color={theme.colors.warning} />}
            onPress={handleHomework}
            style={styles.quickActionBtn}
            accessibilityLabel="View homework"
          />
        </View>

        {/* Attendance Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="bar-chart-outline" size={14} color={theme.colors.textLight} /> Attendance
          </Text>
          <AttendanceSummaryCard
            totalDays={student.attendance.totalDays}
            present={student.attendance.present}
            absent={student.attendance.absent}
            late={student.attendance.late}
            percentage={student.attendance.percentage}
          />
        </View>

        {/* Parent Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="people-outline" size={14} color={theme.colors.textLight} /> Parent / Guardian
          </Text>
          <ParentInfoCard
            fatherName={student.parentInfo.fatherName}
            motherName={student.parentInfo.motherName}
            fatherPhone={student.parentInfo.fatherPhone}
            motherPhone={student.parentInfo.motherPhone}
            fatherEmail={student.parentInfo.fatherEmail}
            motherEmail={student.parentInfo.motherEmail}
            address={student.parentInfo.address}
          />
        </View>

        {/* Transport */}
        {student.transport && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="bus-outline" size={14} color={theme.colors.textLight} /> Transport
            </Text>
            <AppCard variant="default" contentStyle={styles.infoCardContent}>
              <InfoRow icon="map-outline" label="Route" value={student.transport.route} />
              <InfoRow icon="location-outline" label="Stop" value={student.transport.stop} />
              <InfoRow icon="time-outline" label="Pickup" value={student.transport.pickupTime} />
              <InfoRow icon="time-outline" label="Drop" value={student.transport.dropTime} />
              {student.transport.driverName && (
                <InfoRow icon="person-outline" label="Driver" value={student.transport.driverName} />
              )}
              {student.transport.driverPhone && (
                <InfoRow icon="call-outline" label="Driver Phone" value={student.transport.driverPhone} />
              )}
            </AppCard>
          </View>
        )}

        {/* Fee Status */}
        {student.feeStatus && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="cash-outline" size={14} color={theme.colors.textLight} /> Fee Status
            </Text>
            <AppCard variant="default" contentStyle={styles.infoCardContent}>
              <InfoRow icon="wallet-outline" label="Total Fee" value={`₹${student.feeStatus.totalFee.toLocaleString()}`} />
              <InfoRow icon="checkmark-circle" label="Paid" value={`₹${student.feeStatus.paid.toLocaleString()}`} />
              <InfoRow icon="alert-circle" label="Due" value={`₹${student.feeStatus.due.toLocaleString()}`} />
              <InfoRow icon="calendar-outline" label="Due Date" value={student.feeStatus.dueDate} />
              <InfoRow icon="information-circle-outline" label="Status" value={
                student.feeStatus.status.charAt(0).toUpperCase() +
                student.feeStatus.status.slice(1)
              } />
            </AppCard>
          </View>
        )}

        {/* Recent Homework */}
        {student.recentHomework.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="create-outline" size={14} color={theme.colors.textLight} /> Recent Homework
            </Text>
            {student.recentHomework.map((hw) => (
              <AppCard key={hw.id} variant="default" contentStyle={styles.homeworkCardContent}>
                <View style={styles.hwLeft}>
                  <Text style={styles.hwSubject}>{hw.subject}</Text>
                  <Text style={styles.hwTitle} numberOfLines={1}>
                    {hw.title}
                  </Text>
                </View>
                <View style={styles.hwRight}>
                  <Text style={styles.hwDueDate}>{hw.dueDate}</Text>
                  <Text style={styles.hwStatus}>{hw.status}</Text>
                </View>
              </AppCard>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

interface InfoRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
  <View style={styles.infoRow} accessibilityRole="text" accessibilityLabel={`${label}: ${value}`}>
    <View style={styles.infoLeft}>
      <Ionicons name={icon} size={14} color={theme.colors.textSecondary} />
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxl,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  errorText: {
    ...theme.typography.hierarchy.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  quickActionBtn: {
    flex: 1,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.hierarchy.caption,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
  infoCardContent: {
    padding: 0,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoLabel: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    ...theme.typography.hierarchy.bodySmall,
    fontWeight: theme.typography.weight.medium,
    color: theme.colors.text,
    textAlign: 'right',
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  homeworkCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  hwLeft: {
    flex: 1,
  },
  hwSubject: {
    ...theme.typography.hierarchy.caption,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.primary,
    marginBottom: 1,
  },
  hwTitle: {
    ...theme.typography.hierarchy.bodySmall,
    color: theme.colors.text,
  },
  hwRight: {
    alignItems: 'flex-end',
    marginLeft: theme.spacing.sm,
  },
  hwDueDate: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textLight,
    marginBottom: 2,
  },
  hwStatus: {
    ...theme.typography.hierarchy.caption,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.weight.medium,
  },
});
