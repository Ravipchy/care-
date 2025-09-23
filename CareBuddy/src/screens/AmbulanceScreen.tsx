import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert, Dimensions, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

// Sample ambulance service providers
const ambulanceProviders = [
  {
    id: 1,
    name: 'City Emergency Services',
    contact: '+1 (555) 123-4567',
    estimatedTime: '8-12 mins',
    serviceType: 'Basic Life Support',
    rating: 4.8,
    distance: '2.3 km',
    available: true,
    features: ['Oxygen', 'First Aid', 'Stretcher', 'Basic Monitoring']
  },
  {
    id: 2,
    name: 'Metro Ambulance Corp',
    contact: '+1 (555) 234-5678',
    estimatedTime: '5-8 mins',
    serviceType: 'Advanced Life Support',
    rating: 4.9,
    distance: '1.8 km',
    available: true,
    features: ['Defibrillator', 'Ventilator', 'ECG Monitor', 'IV Support']
  },
  {
    id: 3,
    name: 'Critical Care Transport',
    contact: '+1 (555) 345-6789',
    estimatedTime: '3-5 mins',
    serviceType: 'Critical Care Unit',
    rating: 4.7,
    distance: '0.9 km',
    available: true,
    features: ['ICU Equipment', 'Specialist Doctor', 'Advanced Monitoring']
  },
  {
    id: 4,
    name: 'Rapid Response Medical',
    contact: '+1 (555) 456-7890',
    estimatedTime: '12-15 mins',
    serviceType: 'Basic Life Support',
    rating: 4.6,
    distance: '4.1 km',
    available: false,
    features: ['Oxygen', 'First Aid', 'Stretcher']
  },
];

const emergencyContacts = [
  { name: 'Emergency Services', number: '911', type: 'Emergency' },
  { name: 'Police', number: '100', type: 'Police' },
  { name: 'Fire Department', number: '101', type: 'Fire' },
  { name: 'Medical Emergency', number: '108', type: 'Medical' },
];

export default function AmbulanceScreen() {
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [emergencyType, setEmergencyType] = useState('');
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [providers, setProviders] = useState(ambulanceProviders);

  const validateForm = () => {
    const errors = [];
    
    if (!patientName.trim()) {
      errors.push('Patient name is required');
    }
    
    if (!patientAge.trim()) {
      errors.push('Patient age is required');
    } else if (isNaN(Number(patientAge)) || Number(patientAge) < 0 || Number(patientAge) > 150) {
      errors.push('Please enter a valid age (0-150)');
    }
    
    if (!phoneNumber.trim()) {
      errors.push('Phone number is required');
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
      errors.push('Please enter a valid phone number');
    }
    
    if (!emergencyType.trim()) {
      errors.push('Emergency type is required');
    }
    
    if (!location.trim()) {
      errors.push('Location is required');
    }
    
    return errors;
  };

  const handleBookAmbulance = () => {
    const validationErrors = validateForm();
    
    if (validationErrors.length > 0) {
      Alert.alert('Validation Error', validationErrors.join('\n'));
      return;
    }

    Alert.alert(
      'Confirm Booking',
      `Book ${selectedProvider?.name || 'Ambulance Service'} for ${patientName}?\n\nService: ${selectedProvider?.serviceType || 'Emergency Transport'}\nETA: ${selectedProvider?.estimatedTime || '15-20 mins'}\nContact: ${selectedProvider?.contact || 'Emergency Services'}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            // Update provider availability after booking
            if (selectedProvider) {
              setProviders(prevProviders => 
                prevProviders.map(provider => 
                  provider.id === selectedProvider.id 
                    ? { ...provider, available: false }
                    : provider
                )
              );
            }
            
            Alert.alert(
              'Booking Confirmed!', 
              `Ambulance booked successfully!\n\n${selectedProvider?.name || 'Emergency Services'} will arrive in ${selectedProvider?.estimatedTime || '15-20 mins'}\n\nYou will receive a confirmation call shortly.`,
              [
                { 
                  text: 'OK', 
                  onPress: resetForm
                }
              ]
            );
          }
        }
      ]
    );
  };

  const handleQuickBook = (provider: any) => {
    setSelectedProvider(provider);
    setShowBookingForm(true);
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

  const resetForm = () => {
    setPatientName('');
    setPatientAge('');
    setPhoneNumber('');
    setEmergencyType('');
    setLocation('');
    setSelectedProvider(null);
    setShowBookingForm(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Emergency Ambulance</Text>
          <Text style={styles.headerSubtitle}>Quick emergency medical transport</Text>
        </View>

        {/* Hero Section with Map */}
        <View style={styles.heroSection}>
          <View style={styles.mapContainer}>
            <View style={styles.mapPlaceholder}>
              <Ionicons name="location" size={40} color={theme.colors.primary[500]} />
              <Text style={styles.mapText}>Your Location</Text>
              <View style={styles.ambulancePins}>
                <View style={[styles.ambulancePin, { top: 60, left: 80 }]}>
                  <Ionicons name="car" size={16} color={theme.colors.error[500]} />
                </View>
                <View style={[styles.ambulancePin, { top: 100, right: 60 }]}>
                  <Ionicons name="car" size={16} color={theme.colors.error[500]} />
                </View>
                <View style={[styles.ambulancePin, { bottom: 80, left: 100 }]}>
                  <Ionicons name="car" size={16} color={theme.colors.error[500]} />
                </View>
              </View>
            </View>
          </View>
          
          {/* Quick Book Button */}
          <TouchableOpacity 
            style={styles.quickBookButton} 
            onPress={() => setShowBookingForm(true)}
            accessibilityLabel="Book Ambulance Now"
            accessibilityHint="Opens the ambulance booking form"
            accessibilityRole="button"
          >
            <Ionicons name="car" size={24} color={theme.colors.text.inverse} />
            <Text style={styles.quickBookText}>Book Ambulance Now</Text>
          </TouchableOpacity>
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
                accessibilityLabel={`Call ${contact.name} at ${contact.number}`}
                accessibilityHint="Taps to call emergency services"
                accessibilityRole="button"
              >
                <Ionicons name="call" size={24} color={theme.colors.text.inverse} />
                <Text style={styles.emergencyName}>{contact.name}</Text>
                <Text style={styles.emergencyNumber}>{contact.number}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Ambulance Service Providers */}
        <View style={styles.providersSection}>
          <Text style={styles.sectionTitle}>Available Service Providers</Text>
          {providers.map((provider) => (
            <View key={provider.id} style={styles.providerCard}>
              <View style={styles.providerHeader}>
                <View style={styles.providerInfo}>
                  <Text style={styles.providerName}>{provider.name}</Text>
                  <Text style={styles.providerService}>{provider.serviceType}</Text>
                  <View style={styles.providerMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="time" size={14} color={theme.colors.text.secondary} />
                      <Text style={styles.metaText}>{provider.estimatedTime}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="location" size={14} color={theme.colors.text.secondary} />
                      <Text style={styles.metaText}>{provider.distance}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="star" size={14} color={theme.colors.warning[500]} />
                      <Text style={styles.metaText}>{provider.rating}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.providerActions}>
                  <TouchableOpacity 
                    style={styles.contactButton}
                    onPress={() => Alert.alert('Call', `Calling ${provider.contact}`)}
                    accessibilityLabel={`Call ${provider.name} at ${provider.contact}`}
                    accessibilityHint="Taps to call the ambulance service provider"
                    accessibilityRole="button"
                  >
                    <Ionicons name="call" size={16} color={theme.colors.primary[500]} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.bookProviderButton,
                      !provider.available && styles.disabledButton
                    ]}
                    onPress={() => provider.available && handleQuickBook(provider)}
                    disabled={!provider.available}
                    accessibilityLabel={provider.available ? `Book ${provider.name}` : `${provider.name} is unavailable`}
                    accessibilityHint={provider.available ? "Taps to book this ambulance service" : "This service is currently unavailable"}
                    accessibilityRole="button"
                  >
                    <Text style={[
                      styles.bookProviderText,
                      !provider.available && styles.disabledText
                    ]}>
                      {provider.available ? 'Book Now' : 'Unavailable'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.featuresContainer}>
                <Text style={styles.featuresTitle}>Services:</Text>
                <View style={styles.featuresList}>
                  {provider.features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <Ionicons name="checkmark" size={12} color={theme.colors.success[500]} />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Booking Form Modal */}
        <Modal
          visible={showBookingForm}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowBookingForm(false)}
        >
          <View style={styles.bookingModal}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardAvoidingView}
            >
              <View style={styles.bookingContent}>
                <View style={styles.bookingHeader}>
                  <Text style={styles.bookingTitle}>Book Ambulance</Text>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setShowBookingForm(false)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
                  </TouchableOpacity>
                </View>
                
                {selectedProvider && (
                  <View style={styles.selectedProviderInfo}>
                    <Text style={styles.selectedProviderTitle}>Selected Service:</Text>
                    <Text style={styles.selectedProviderName}>{selectedProvider.name}</Text>
                    <Text style={styles.selectedProviderDetails}>
                      {selectedProvider.serviceType} • ETA: {selectedProvider.estimatedTime}
                    </Text>
                  </View>
                )}
                
                <ScrollView 
                  style={styles.formContainer}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Patient Name *</Text>
                    <TextInput
                      style={styles.input}
                      value={patientName}
                      onChangeText={setPatientName}
                      placeholder="Enter patient name"
                      placeholderTextColor={theme.colors.text.secondary}
                      autoCapitalize="words"
                      returnKeyType="next"
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
                        maxLength={3}
                        returnKeyType="next"
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
                        returnKeyType="next"
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
                      autoCapitalize="words"
                      returnKeyType="next"
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
                      autoCapitalize="words"
                      returnKeyType="done"
                    />
                  </View>
                </ScrollView>

                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={styles.cancelButton} 
                    onPress={() => setShowBookingForm(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.confirmBookButton} onPress={handleBookAmbulance}>
                    <Ionicons name="car" size={20} color={theme.colors.text.inverse} />
                    <Text style={styles.confirmBookText}>Confirm Booking</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const getEmergencyColor = (type: string) => {
  switch (type) {
    case 'Emergency': return theme.colors.error[500];
    case 'Police': return theme.colors.primary[500];
    case 'Fire': return theme.colors.warning[500];
    case 'Medical': return theme.colors.success[500];
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
  heroSection: {
    marginBottom: theme.spacing['3xl'],
  },
  mapContainer: {
    height: 200,
    marginBottom: theme.spacing.lg,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: theme.colors.background.primary,
    shadowColor: theme.colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: theme.colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mapText: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.sm,
  },
  ambulancePins: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  ambulancePin: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  quickBookButton: {
    backgroundColor: theme.colors.error[500],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    borderRadius: 16,
  },
  quickBookText: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.inverse,
    marginLeft: theme.spacing.md,
    fontWeight: '700',
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
  providersSection: {
    marginBottom: theme.spacing['3xl'],
  },
  providerCard: {
    marginBottom: theme.spacing.lg,
    ...theme.components.card,
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
  },
  providerService: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  providerMeta: {
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
  providerActions: {
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
  },
  contactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookProviderButton: {
    backgroundColor: theme.colors.primary[500],
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: 20,
  },
  bookProviderText: {
    ...theme.typography.textStyles.label,
    color: theme.colors.text.inverse,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: theme.colors.neutral[300],
  },
  disabledText: {
    color: theme.colors.text.secondary,
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
  bookingModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bookingContent: {
    backgroundColor: theme.colors.background.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: theme.spacing.lg,
    maxHeight: '90%',
    shadowColor: theme.colors.shadow.medium,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  bookingTitle: {
    ...theme.typography.textStyles.h4,
    color: theme.colors.text.primary,
    fontWeight: '700',
  },
  closeButton: {
    padding: theme.spacing.sm,
    borderRadius: 20,
    backgroundColor: theme.colors.background.tertiary,
  },
  selectedProviderInfo: {
    backgroundColor: theme.colors.primary[50],
    padding: theme.spacing.md,
    borderRadius: 12,
    marginBottom: theme.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary[500],
  },
  selectedProviderTitle: {
    ...theme.typography.textStyles.label,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  selectedProviderName: {
    ...theme.typography.textStyles.h6,
    color: theme.colors.text.primary,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  selectedProviderDetails: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.secondary,
  },
  formContainer: {
    maxHeight: 400,
    marginBottom: theme.spacing.lg,
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
    fontWeight: '600',
  },
  input: {
    ...theme.components.input,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    backgroundColor: theme.colors.background.primary,
  },
  modalActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.colors.background.tertiary,
    padding: theme.spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    ...theme.typography.textStyles.h6,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
  confirmBookButton: {
    flex: 2,
    backgroundColor: theme.colors.error[500],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    borderRadius: 12,
    gap: theme.spacing.sm,
    shadowColor: theme.colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  confirmBookText: {
    ...theme.typography.textStyles.h6,
    color: theme.colors.text.inverse,
    fontWeight: '700',
  },
});