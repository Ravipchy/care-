import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

// Sample appointment data
const appointments = [
  {
    id: 1,
    doctor: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    date: 'Today, 2:00 PM',
    status: 'Upcoming',
    type: 'In-Person',
    location: 'City Medical Center',
    duration: '30 min',
    image: '👩‍⚕️',
  },
  {
    id: 2,
    doctor: 'Dr. Michael Chen',
    specialty: 'Neurologist',
    date: 'Tomorrow, 10:00 AM',
    status: 'Confirmed',
    type: 'Video Call',
    location: 'Online',
    duration: '45 min',
    image: '👨‍⚕️',
  },
  {
    id: 3,
    doctor: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrician',
    date: 'Dec 15, 3:00 PM',
    status: 'Pending',
    type: 'In-Person',
    location: 'Children\'s Hospital',
    duration: '30 min',
    image: '👩‍⚕️',
  },
  {
    id: 4,
    doctor: 'Dr. David Wilson',
    specialty: 'Orthopedist',
    date: 'Dec 10, 11:00 AM',
    status: 'Completed',
    type: 'In-Person',
    location: 'Sports Medicine Clinic',
    duration: '45 min',
    image: '👨‍⚕️',
  },
];

export default function AppointmentsScreen() {
  const [selectedTab, setSelectedTab] = useState('Upcoming');

  const filteredAppointments = appointments.filter(appointment => {
    if (selectedTab === 'All') return true;
    return appointment.status === selectedTab;
  });

  const handleReschedule = (appointment: any) => {
    Alert.alert(
      'Reschedule Appointment',
      `Reschedule appointment with ${appointment.doctor}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reschedule', onPress: () => Alert.alert('Success', 'Appointment rescheduled successfully!') }
      ]
    );
  };

  const handleCancel = (appointment: any) => {
    Alert.alert(
      'Cancel Appointment',
      `Cancel appointment with ${appointment.doctor}?`,
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes, Cancel', style: 'destructive', onPress: () => Alert.alert('Success', 'Appointment cancelled successfully!') }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming': return theme.colors.primary[500];
      case 'Confirmed': return theme.colors.success;
      case 'Pending': return theme.colors.warning;
      case 'Completed': return theme.colors.neutral[500];
      default: return theme.colors.neutral[500];
    }
  };

  const tabs = ['All', 'Upcoming', 'Confirmed', 'Pending', 'Completed'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Appointments</Text>
          <Text style={styles.headerSubtitle}>Manage your medical appointments</Text>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  selectedTab === tab && styles.tabActive
                ]}
                onPress={() => setSelectedTab(tab)}
              >
                <Text style={[
                  styles.tabText,
                  selectedTab === tab && styles.tabTextActive
                ]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="add" size={20} color={theme.colors.primary[500]} />
            <Text style={styles.quickActionText}>Book New Appointment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="videocam" size={20} color={theme.colors.secondary[500]} />
            <Text style={styles.quickActionText}>Join Video Call</Text>
          </TouchableOpacity>
        </View>

        {/* Appointments List */}
        <View style={styles.appointmentsSection}>
          <Text style={styles.sectionTitle}>
            {selectedTab} Appointments ({filteredAppointments.length})
          </Text>
          {filteredAppointments.map((appointment) => (
            <View key={appointment.id} style={styles.appointmentCard}>
              <View style={styles.appointmentHeader}>
                <View style={styles.doctorImage}>
                  <Text style={styles.doctorEmoji}>{appointment.image}</Text>
                </View>
                <View style={styles.appointmentInfo}>
                  <Text style={styles.doctorName}>{appointment.doctor}</Text>
                  <Text style={styles.specialty}>{appointment.specialty}</Text>
                  <View style={styles.appointmentMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="calendar" size={14} color={theme.colors.text.secondary} />
                      <Text style={styles.metaText}>{appointment.date}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="time" size={14} color={theme.colors.text.secondary} />
                      <Text style={styles.metaText}>{appointment.duration}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="location" size={14} color={theme.colors.text.secondary} />
                      <Text style={styles.metaText}>{appointment.location}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.statusContainer}>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(appointment.status) }
                  ]}>
                    <Text style={styles.statusText}>{appointment.status}</Text>
                  </View>
                  <Text style={styles.appointmentType}>{appointment.type}</Text>
                </View>
              </View>
              
              {appointment.status !== 'Completed' && (
                <View style={styles.appointmentActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleReschedule(appointment)}
                  >
                    <Ionicons name="refresh" size={16} color={theme.colors.primary[500]} />
                    <Text style={styles.actionButtonText}>Reschedule</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={() => handleCancel(appointment)}
                  >
                    <Ionicons name="close" size={16} color={theme.colors.error} />
                    <Text style={[styles.actionButtonText, styles.cancelButtonText]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Empty State */}
        {filteredAppointments.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={60} color={theme.colors.neutral[300]} />
            <Text style={styles.emptyTitle}>No {selectedTab.toLowerCase()} appointments</Text>
            <Text style={styles.emptyDescription}>
              {selectedTab === 'All' ? 'You don\'t have any appointments yet.' : `You don't have any ${selectedTab.toLowerCase()} appointments.`}
            </Text>
            <TouchableOpacity style={styles.bookButton}>
              <Text style={styles.bookButtonText}>Book New Appointment</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  headerTitle: {
    ...theme.typography.textStyles.h2,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  headerSubtitle: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.secondary,
  },
  tabContainer: {
    marginBottom: theme.spacing.xl,
  },
  tab: {
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: 20,
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  tabActive: {
    backgroundColor: theme.colors.primary[500],
    borderColor: theme.colors.primary[500],
  },
  tabText: {
    ...theme.typography.textStyles.label,
    color: theme.colors.text.secondary,
  },
  tabTextActive: {
    color: theme.colors.text.inverse,
  },
  quickActions: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xl,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.xs,
    borderRadius: 12,
    ...theme.components.card,
  },
  quickActionText: {
    ...theme.typography.textStyles.label,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  appointmentsSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.textStyles.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  appointmentCard: {
    ...theme.components.card,
    marginBottom: theme.spacing.lg,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.lg,
  },
  doctorEmoji: {
    fontSize: 24,
  },
  appointmentInfo: {
    flex: 1,
  },
  doctorName: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  specialty: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.primary[500],
    marginBottom: theme.spacing.sm,
  },
  appointmentMeta: {
    gap: theme.spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: 12,
    marginBottom: theme.spacing.xs,
  },
  statusText: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.inverse,
    fontWeight: '600',
  },
  appointmentType: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.secondary,
  },
  appointmentActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    backgroundColor: theme.colors.background.tertiary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: 8,
  },
  actionButtonText: {
    ...theme.typography.textStyles.label,
    color: theme.colors.primary[500],
    marginLeft: theme.spacing.xs,
  },
  cancelButton: {
    backgroundColor: theme.colors.error + '20',
  },
  cancelButtonText: {
    color: theme.colors.error,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing['6xl'],
  },
  emptyTitle: {
    ...theme.typography.textStyles.h4,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  emptyDescription: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  bookButton: {
    backgroundColor: theme.colors.primary[500],
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderRadius: 8,
  },
  bookButtonText: {
    ...theme.typography.textStyles.label,
    color: theme.colors.text.inverse,
    fontWeight: '600',
  },
});