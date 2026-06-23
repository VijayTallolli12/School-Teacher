import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer, AppHeader } from '../components';
import { StudentProfileCard } from '../components/StudentProfileCard';
import { ParentInfoCard } from '../components/ParentInfoCard';
import { AttendanceSummaryCard } from '../components/AttendanceSummaryCard';
import { useStudentDetail } from '../hooks/useStudents';
import { theme } from '../theme';
import { AppStackParamList } from '../types';

type DetailRouteProp = RouteProp<AppStackParamList, 'StudentDetail'>;
type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export const StudentDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DetailRouteProp>();
  const { studentId } = route.params;

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
    navigation.navigate('MainTabs', { screen: 'Attendance' });
  }, [navigation]);

  const handleHomework = useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'Homework' });
  }, [navigation]);

  if (isLoading) {
    return (
      <ScreenContainer>
        <AppHeader
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
          title="Student Detail"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.centeredContainer}>
          <Text style={styles.errorText}>Could not load student details</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <View style={styles.screen}>
      <AppHeader
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
          <TouchableOpacity
            style={[styles.quickActionBtn, styles.callBtn]}
            onPress={() => handleCall(student.parentInfo.fatherPhone)}
          >
            <Text style={styles.quickActionIcon}>📞</Text>
            <Text style={styles.quickActionLabel}>Call{'\n'}Parent</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickActionBtn, styles.attBtn]}
            onPress={handleAttendance}
          >
            <Text style={styles.quickActionIcon}>📋</Text>
            <Text style={styles.quickActionLabel}>View{'\n'}Attendance</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickActionBtn, styles.hwBtn]}
            onPress={handleHomework}
          >
            <Text style={styles.quickActionIcon}>📝</Text>
            <Text style={styles.quickActionLabel}>View{'\n'}Homework</Text>
          </TouchableOpacity>
        </View>

        {/* Attendance Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attendance</Text>
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
          <Text style={styles.sectionTitle}>Parent / Guardian</Text>
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
            <Text style={styles.sectionTitle}>Transport</Text>
            <View style={styles.infoCard}>
              <InfoRow label="Route" value={student.transport.route} />
              <InfoRow label="Stop" value={student.transport.stop} />
              <InfoRow label="Pickup" value={student.transport.pickupTime} />
              <InfoRow label="Drop" value={student.transport.dropTime} />
              {student.transport.driverName && (
                <InfoRow label="Driver" value={student.transport.driverName} />
              )}
              {student.transport.driverPhone && (
                <InfoRow label="Driver Phone" value={student.transport.driverPhone} />
              )}
            </View>
          </View>
        )}

        {/* Fee Status */}
        {student.feeStatus && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fee Status</Text>
            <View style={styles.infoCard}>
              <InfoRow label="Total Fee" value={`₹${student.feeStatus.totalFee.toLocaleString()}`} />
              <InfoRow label="Paid" value={`₹${student.feeStatus.paid.toLocaleString()}`} />
              <InfoRow
                label="Due"
                value={`₹${student.feeStatus.due.toLocaleString()}`}
              />
              <InfoRow label="Due Date" value={student.feeStatus.dueDate} />
              <InfoRow
                label="Status"
                value={
                  student.feeStatus.status.charAt(0).toUpperCase() +
                  student.feeStatus.status.slice(1)
                }
              />
            </View>
          </View>
        )}

        {/* Recent Homework */}
        {student.recentHomework.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Homework</Text>
            {student.recentHomework.map((hw) => (
              <View key={hw.id} style={styles.homeworkItem}>
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
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
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
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  retryButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primary,
  },
  retryText: {
    color: theme.colors.background,
    fontWeight: theme.typography.fontWeight.bold,
    fontSize: theme.typography.fontSize.sm,
  },
  quickActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  quickActionBtn: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    borderWidth: 1,
  },
  callBtn: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  attBtn: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  hwBtn: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: theme.spacing.xs,
  },
  quickActionLabel: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 16,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
  infoCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
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
  infoLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    textAlign: 'right',
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  homeworkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  hwLeft: {
    flex: 1,
  },
  hwSubject: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: 1,
  },
  hwTitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  },
  hwRight: {
    alignItems: 'flex-end',
    marginLeft: theme.spacing.sm,
  },
  hwDueDate: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
    marginBottom: 2,
  },
  hwStatus: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
});
