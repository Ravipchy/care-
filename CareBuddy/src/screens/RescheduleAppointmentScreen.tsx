import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

// Sample appointment data (in real app, this would come from props or navigation params)
const appointmentData = {
  id: '1',
  doctor: 'Dr. Sarah Johnson',
  specialty: 'Cardiologist',
  currentDate: 'Dec 15, 2024',
  currentTime: '2:00 PM',
  type: 'In-Person',
  location: 'City Medical Center',
  duration: '30 min',
  image: '👩‍⚕️',
  reason: 'Regular checkup',
};

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
  '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM'
];

const availableDates = [
  { date: 'Dec 16, 2024', day: 'Monday', available: true },
  { date: 'Dec 17, 2024', day: 'Tuesday', available: true },
  { date: 'Dec 18, 2024', day: 'Wednesday', available: true },
  { date: 'Dec 19, 2024', day: 'Thursday', available: false },
  { date: 'Dec 20, 2024', day: 'Friday', available: true },
  { date: 'Dec 23, 2024', day: 'Monday', available: true },
  { date: 'Dec 24, 2024', day: 'Tuesday', available: false },
  { date: 'Dec 26, 2024', day: 'Thursday', available: true },
];

export default function RescheduleAppointmentScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');

  const handleRescheduleAppointment = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Missing Information', 'Please select a new date and time for your appointment.');
      return;
    }

    Alert.alert(
      'Appointment Rescheduled!',
      `Your appointment with ${appointmentData.doctor} has been rescheduled to ${selectedDate} at ${selectedTime}.`,
      [{ text: 'OK', onPress: () => {
        // Navigate back or to appointments screen
      }}]
    );
  };

  const handleCancelAppointment = () => {
    Alert.alert(
      'Cancel Appointment',
      `Are you sure you want to cancel your appointment with ${appointmentData.doctor}?`,
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive', 
          onPress: () => Alert.alert('Appointment Cancelled', 'Your appointment has been cancelled successfully.') 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Reschedule Appointment</Text>
          <Text style={styles.headerSubtitle}>Change your appointment date and time</Text>
        </View>

        {/* Current Appointment Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Appointment</Text>
          <View style={styles.currentAppointmentCard}>
            <View style={styles.appointmentHeader}>
              <View style={styles.doctorImage}>
                <Text style={styles.doctorEmoji}>{appointmentData.image}</Text>
              </View>
              <View style={styles.appointmentInfo}>
                <Text style={styles.doctorName}>{appointmentData.doctor}</Text>
                <Text style={styles.specialty}>{appointmentData.specialty}</Text>
                <View style={styles.appointmentMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="calendar" size={14} color={theme.colors.text.secondary} />
                    <Text style={styles.metaText}>{appointmentData.currentDate}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="time" size={14} color={theme.colors.text.secondary} />
                    <Text style={styles.metaText}>{appointmentData.currentTime}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="location" size={14} color={theme.colors.text.secondary} />
                    <Text style={styles.metaText}>{appointmentData.location}</Text>
                  </View>
                </View>
                <Text style={styles.reasonText}>Reason: {appointmentData.reason}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* New Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select New Date</Text>
          <View style={styles.datesContainer}>
            {availableDates.map((dateInfo, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateCard,
                  !dateInfo.available && styles.dateCardUnavailable,
                  selectedDate === dateInfo.date && styles.dateCardSelected
                ]}
                onPress={() => dateInfo.available && setSelectedDate(dateInfo.date)}
                disabled={!dateInfo.available}
              >
                <Text style={[
                  styles.dateText,
                  !dateInfo.available && styles.dateTextUnavailable,
                  selectedDate === dateInfo.date && styles.dateTextSelected
                ]}>
                  {dateInfo.day}
                </Text>
                <Text style={[
                  styles.dateNumber,
                  !dateInfo.available && styles.dateTextUnavailable,
                  selectedDate === dateInfo.date && styles.dateTextSelected
                ]}>
                  {dateInfo.date.split(',')[0].split(' ')[1]}
                </Text>
                <Text style={[
                  styles.monthText,
                  !dateInfo.available && styles.dateTextUnavailable,
                  selectedDate === dateInfo.date && styles.dateTextSelected
                ]}>
                  {dateInfo.date.split(',')[0].split(' ')[0]}
                </Text>
                {!dateInfo.available && (
                  <View style={styles.unavailableOverlay}>
                    <Text style={styles.unavailableText}>Unavailable</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* New Time Selection */}
        {selectedDate && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select New Time</Text>
            <View style={styles.timeSlotsContainer}>
              {timeSlots.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeSlot,
                    selectedTime === time && styles.timeSlotSelected
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={[
                    styles.timeSlotText,
                    selectedTime === time && styles.timeSlotTextSelected
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Reason for Rescheduling */}
        {selectedTime && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reason for Rescheduling (Optional)</Text>
            <TextInput
              style={styles.reasonInput}
              placeholder="Please let us know why you need to reschedule..."
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={3}
              placeholderTextColor={theme.colors.text.secondary}
            />
          </View>
        )}

        {/* Action Buttons */}
        {selectedDate && selectedTime && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.rescheduleButton} 
              onPress={handleRescheduleAppointment}
            >
              <Text style={styles.rescheduleButtonText}>Reschedule Appointment</Text>
              <Ionicons name="refresh" size={20} color={theme.colors.text.inverse} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={handleCancelAppointment}
            >
              <Text style={styles.cancelButtonText}>Cancel Appointment</Text>
              <Ionicons name="close" size={20} color={theme.colors.error[500]} />
            </TouchableOpacity>
          </View>
        )}

        {/* Important Notes */}
        <View style={styles.notesSection}>
          <View style={styles.noteCard}>
            <Ionicons name="information-circle" size={20} color={theme.colors.info[500]} />
            <View style={styles.noteContent}>
              <Text style={styles.noteTitle}>Important Notes</Text>
              <Text style={styles.noteText}>
                • You can reschedule up to 24 hours before your appointment{'\n'}
                • Cancellation within 24 hours may incur a fee{'\n'}
                • New appointment times are subject to availability
              </Text>
            </View>
          </View>
        </View>
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
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.textStyles.h4,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  currentAppointmentCard: {
    ...theme.components.card,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    marginBottom: theme.spacing.sm,
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
  reasonText: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
  },
  datesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  dateCard: {
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    ...theme.components.card,
  },
  dateCardSelected: {
    backgroundColor: theme.colors.primary[500],
    borderColor: theme.colors.primary[500],
  },
  dateCardUnavailable: {
    backgroundColor: theme.colors.background.tertiary,
    opacity: 0.5,
  },
  dateText: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  dateTextSelected: {
    color: theme.colors.text.inverse,
  },
  dateTextUnavailable: {
    color: theme.colors.text.tertiary,
  },
  dateNumber: {
    ...theme.typography.textStyles.h4,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  monthText: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.secondary,
  },
  unavailableOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unavailableText: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.inverse,
    fontWeight: '600',
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  timeSlot: {
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  timeSlotSelected: {
    backgroundColor: theme.colors.primary[500],
    borderColor: theme.colors.primary[500],
  },
  timeSlotText: {
    ...theme.typography.textStyles.label,
    color: theme.colors.text.primary,
  },
  timeSlotTextSelected: {
    color: theme.colors.text.inverse,
  },
  reasonInput: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.primary,
    textAlignVertical: 'top',
    ...theme.components.card,
  },
  actionButtons: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  rescheduleButton: {
    backgroundColor: theme.colors.primary[500],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    borderRadius: 12,
  },
  rescheduleButtonText: {
    ...theme.typography.textStyles.label,
    color: theme.colors.text.inverse,
    fontWeight: '600',
    marginRight: theme.spacing.sm,
  },
  cancelButton: {
    backgroundColor: theme.colors.error + '20',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.error[500],
  },
  cancelButtonText: {
    ...theme.typography.textStyles.label,
    color: theme.colors.error[500],
    fontWeight: '600',
    marginRight: theme.spacing.sm,
  },
  notesSection: {
    marginTop: theme.spacing.lg,
  },
  noteCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.info[50],
    padding: theme.spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.info[200],
  },
  noteContent: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  noteTitle: {
    ...theme.typography.textStyles.h6,
    color: theme.colors.info[700],
    marginBottom: theme.spacing.sm,
  },
  noteText: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.info[600],
    lineHeight: 20,
  },
});
