import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

// Sample ambulance data
const ambulanceTypes = [
  {
    id: 1,
    name: 'Basic Life Support',
    description: 'Standard ambulance with basic medical equipment',
    price: 200,
    eta: '15-20 mins',
    icon: 'car',
    available: true,
    features: ['Oxygen', 'First Aid', 'Stretcher', 'Basic Monitoring']
  },
  {
    id: 2,
    name: 'Advanced Life Support',
    description: 'Advanced ambulance with critical care equipment',
    price: 350,
    eta: '10-15 mins',
    icon: 'medical',
    available: true,
    features: ['Defibrillator', 'Ventilator', 'ECG Monitor', 'IV Support']
  },
  {
    id: 3,
    name: 'Critical Care Unit',
    description: 'Mobile ICU with specialized medical team',
    price: 500,
    eta: '5-10 mins',
    icon: 'heart',
    available: false,
    features: ['ICU Equipment', 'Specialist Doctor', 'Advanced Monitoring', 'Emergency Surgery']
  },
];

const emergencyContacts = [
  { name: 'Emergency Services', number: '911', type: 'Emergency' },
  { name: 'Police', number: '100', type: 'Police' },
  { name: 'Fire Department', number: '101', type: 'Fire' },
  { name: 'Medical Emergency', number: '108', type: 'Medical' },
];

export default function AmbulanceScreen() {
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [emergencyType, setEmergencyType] = useState('');
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleBookAmbulance = () => {
    if (!selectedAmbulance) {
      Alert.alert('Error', 'Please select an ambulance type');
      return;
    }
    if (!patientName || !patientAge || !emergencyType || !location || !phoneNumber) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert(
      'Confirm Booking',
      `Book ${selectedAmbulance.name} for ${patientName}?\n\nPrice: $${selectedAmbulance.price}\nETA: ${selectedAmbulance.eta}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => Alert.alert('Success', 'Ambulance booked successfully! ETA: ' + selectedAmbulance.eta) }
      ]
    );
  };

  const handleEmergencyCall = (contact: any) => {
    Alert.alert(
      'Emergency Call',
      `Call ${contact.name} at ${contact.number}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Alert.alert('Calling', `Calling ${contact.name}...`) }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Emergency Ambulance</Text>
          <Text style={styles.headerSubtitle}>Book emergency medical transport</Text>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.emergencySection}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <View style={styles.emergencyGrid}>
            {emergencyContacts.map((contact, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.emergencyCard,
                  { backgroundColor: getEmergencyColor(contact.type) }
                ]}
                onPress={() => handleEmergencyCall(contact)}
              >
                <Ionicons name="call" size={24} color={theme.colors.text.inverse} />
                <Text style={styles.emergencyName}>{contact.name}</Text>
                <Text style={styles.emergencyNumber}>{contact.number}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Ambulance Types */}
        <View style={styles.ambulanceSection}>
          <Text style={styles.sectionTitle}>Available Ambulances</Text>
          {ambulanceTypes.map((ambulance) => (
            <TouchableOpacity
              key={ambulance.id}
              style={[
                styles.ambulanceCard,
                selectedAmbulance?.id === ambulance.id && styles.selectedAmbulance,
                !ambulance.available && styles.unavailableAmbulance
              ]}
              onPress={() => ambulance.available && setSelectedAmbulance(ambulance)}
              disabled={!ambulance.available}
            >
              <View style={styles.ambulanceHeader}>
                <View style={styles.ambulanceIcon}>
                  <Ionicons 
                    name={ambulance.icon as any} 
                    size={24} 
                    color={ambulance.available ? theme.colors.primary[500] : theme.colors.neutral[400]} 
                  />
                </View>
                <View style={styles.ambulanceInfo}>
                  <Text style={[
                    styles.ambulanceName,
                    !ambulance.available && styles.unavailableText
                  ]}>
                    {ambulance.name}
                  </Text>
                  <Text style={[
                    styles.ambulanceDescription,
                    !ambulance.available && styles.unavailableText
                  ]}>
                    {ambulance.description}
                  </Text>
                  <View style={styles.ambulanceMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="time" size={14} color={theme.colors.text.secondary} />
                      <Text style={styles.metaText}>{ambulance.eta}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="cash" size={14} color={theme.colors.text.secondary} />
                      <Text style={styles.metaText}>${ambulance.price}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.ambulanceStatus}>
                  {ambulance.available ? (
                    <View style={styles.availableBadge}>
                      <Text style={styles.availableText}>Available</Text>
                    </View>
                  ) : (
                    <View style={styles.unavailableBadge}>
                      <Text style={styles.unavailableBadgeText}>Unavailable</Text>
                    </View>
                  )}
                </View>
              </View>
              
              <View style={styles.featuresContainer}>
                <Text style={styles.featuresTitle}>Features:</Text>
                <View style={styles.featuresList}>
                  {ambulance.features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <Ionicons name="checkmark" size={12} color={theme.colors.success} />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Booking Form */}
        {selectedAmbulance && (
          <View style={styles.bookingSection}>
            <Text style={styles.sectionTitle}>Booking Details</Text>
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Patient Name *</Text>
                <TextInput
                  style={styles.input}
                  value={patientName}
                  onChangeText={setPatientName}
                  placeholder="Enter patient name"
                  placeholderTextColor={theme.colors.text.secondary}
                />
              </View>
              
              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: theme.spacing.sm }]}>
                  <Text style={styles.inputLabel}>Age *</Text>
                  <TextInput
                    style={styles.input}
                    value={patientAge}
                    onChangeText={setPatientAge}
                    placeholder="Age"
                    keyboardType="numeric"
                    placeholderTextColor={theme.colors.text.secondary}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: theme.spacing.sm }]}>
                  <Text style={styles.inputLabel}>Phone *</Text>
                  <TextInput
                    style={styles.input}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    placeholder="Phone number"
                    keyboardType="phone-pad"
                    placeholderTextColor={theme.colors.text.secondary}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Emergency Type *</Text>
                <TextInput
                  style={styles.input}
                  value={emergencyType}
                  onChangeText={setEmergencyType}
                  placeholder="e.g., Heart attack, Accident, etc."
                  placeholderTextColor={theme.colors.text.secondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Location *</Text>
                <TextInput
                  style={styles.input}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Enter pickup location"
                  placeholderTextColor={theme.colors.text.secondary}
                />
              </View>
            </View>
          </View>
        )}

        {/* Book Button */}
        {selectedAmbulance && (
          <TouchableOpacity style={styles.bookButton} onPress={handleBookAmbulance}>
            <Ionicons name="car" size={24} color={theme.colors.text.inverse} />
            <Text style={styles.bookButtonText}>
              Book {selectedAmbulance.name} - ${selectedAmbulance.price}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const getEmergencyColor = (type: string) => {
  switch (type) {
    case 'Emergency': return theme.colors.error;
    case 'Police': return theme.colors.primary[500];
    case 'Fire': return theme.colors.warning;
    case 'Medical': return theme.colors.success;
    default: return theme.colors.neutral[500];
  }
};

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
  emergencySection: {
    marginBottom: theme.spacing['3xl'],
  },
  sectionTitle: {
    ...theme.typography.textStyles.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  emergencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emergencyCard: {
    width: '48%',
    padding: theme.spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    ...theme.components.card,
  },
  emergencyName: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.inverse,
    fontWeight: '600',
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  emergencyNumber: {
    ...theme.typography.textStyles.h4,
    color: theme.colors.text.inverse,
    fontWeight: 'bold',
    marginTop: theme.spacing.xs,
  },
  ambulanceSection: {
    marginBottom: theme.spacing['3xl'],
  },
  ambulanceCard: {
    ...theme.components.card,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAmbulance: {
    borderColor: theme.colors.primary[500],
    backgroundColor: theme.colors.primary[50],
  },
  unavailableAmbulance: {
    opacity: 0.6,
  },
  ambulanceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  ambulanceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.lg,
  },
  ambulanceInfo: {
    flex: 1,
  },
  ambulanceName: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  ambulanceDescription: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  ambulanceMeta: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  ambulanceStatus: {
    alignItems: 'flex-end',
  },
  availableBadge: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: 12,
  },
  availableText: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.inverse,
    fontWeight: '600',
  },
  unavailableBadge: {
    backgroundColor: theme.colors.neutral[300],
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: 12,
  },
  unavailableBadgeText: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
  unavailableText: {
    color: theme.colors.neutral[400],
  },
  featuresContainer: {
    marginTop: theme.spacing.sm,
  },
  featuresTitle: {
    ...theme.typography.textStyles.label,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
    marginBottom: theme.spacing.xs,
  },
  featureText: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  bookingSection: {
    marginBottom: theme.spacing.xl,
  },
  formContainer: {
    ...theme.components.card,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  inputRow: {
    flexDirection: 'row',
  },
  inputLabel: {
    ...theme.typography.textStyles.label,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    ...theme.components.input,
  },
  bookButton: {
    backgroundColor: theme.colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    borderRadius: 12,
    ...theme.components.card,
  },
  bookButtonText: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.inverse,
    marginLeft: theme.spacing.md,
  },
});