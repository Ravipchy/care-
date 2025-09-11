import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  Alert,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

// Sample lab tests data
const labTests = [
  {
    id: 1,
    name: 'Complete Blood Count (CBC)',
    description: 'Measures different components of blood',
    price: 150,
    duration: '2-4 hours',
    fasting: true,
    category: 'Blood Test',
    icon: '🩸',
    popular: true,
  },
  {
    id: 2,
    name: 'Lipid Profile',
    description: 'Cholesterol and triglyceride levels',
    price: 200,
    duration: '4-6 hours',
    fasting: true,
    category: 'Blood Test',
    icon: '💉',
    popular: true,
  },
  {
    id: 3,
    name: 'Thyroid Function Test',
    description: 'TSH, T3, T4 levels',
    price: 300,
    duration: '6-8 hours',
    fasting: false,
    category: 'Hormone Test',
    icon: '🦋',
    popular: false,
  },
  {
    id: 4,
    name: 'Diabetes Panel',
    description: 'Fasting glucose, HbA1c, insulin',
    price: 250,
    duration: '4-6 hours',
    fasting: true,
    category: 'Blood Test',
    icon: '🍯',
    popular: true,
  },
  {
    id: 5,
    name: 'Liver Function Test',
    description: 'ALT, AST, bilirubin levels',
    price: 180,
    duration: '4-6 hours',
    fasting: true,
    category: 'Blood Test',
    icon: '🫀',
    popular: false,
  },
  {
    id: 6,
    name: 'Kidney Function Test',
    description: 'Creatinine, BUN, eGFR',
    price: 120,
    duration: '2-4 hours',
    fasting: false,
    category: 'Blood Test',
    icon: '🫁',
    popular: false,
  },
];

const labCenters = [
  {
    id: 1,
    name: 'City Medical Lab',
    address: '123 Health Street, Medical City',
    rating: 4.8,
    distance: '2.5 km',
    available: true,
  },
  {
    id: 2,
    name: 'Central Diagnostic Center',
    address: '456 Lab Avenue, Central District',
    rating: 4.6,
    distance: '3.2 km',
    available: true,
  },
  {
    id: 3,
    name: 'Advanced Pathology Lab',
    address: '789 Test Road, North Side',
    rating: 4.9,
    distance: '5.1 km',
    available: false,
  },
];

export default function LabTestScreen() {
  const [selectedTests, setSelectedTests] = useState<any[]>([]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const categories = ['All', 'Blood Test', 'Hormone Test', 'Urine Test', 'Other'];

  const toggleTestSelection = (test: any) => {
    const isSelected = selectedTests.find(t => t.id === test.id);
    if (isSelected) {
      setSelectedTests(selectedTests.filter(t => t.id !== test.id));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const getTotalPrice = () => {
    return selectedTests.reduce((total, test) => total + test.price, 0);
  };

  const handleBookTest = () => {
    if (selectedTests.length === 0) {
      Alert.alert('Error', 'Please select at least one test');
      return;
    }
    if (!selectedCenter) {
      Alert.alert('Error', 'Please select a lab center');
      return;
    }
    setShowBookingModal(true);
  };

  const handleConfirmBooking = () => {
    if (!patientName || !patientAge || !phoneNumber || !selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert(
      'Booking Confirmed',
      `Lab test booked successfully!\n\nPatient: ${patientName}\nTests: ${selectedTests.length}\nTotal: $${getTotalPrice()}\nCenter: ${selectedCenter.name}\nDate: ${selectedDate} at ${selectedTime}`,
      [
        { text: 'OK', onPress: () => {
          setShowBookingModal(false);
          setSelectedTests([]);
          setSelectedCenter(null);
        }}
      ]
    );
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={i} name="star" size={14} color="#ffd700" />);
    }
    if (hasHalfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={14} color="#ffd700" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={14} color="#ffd700" />);
    }
    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Lab Tests</Text>
          <Text style={styles.headerSubtitle}>Book diagnostic tests and health checkups</Text>
        </View>

        {/* Lab Tests */}
        <View style={styles.testsSection}>
          <Text style={styles.sectionTitle}>Available Tests</Text>
          {labTests.map((test) => (
            <TouchableOpacity
              key={test.id}
              style={[
                styles.testCard,
                selectedTests.find(t => t.id === test.id) && styles.selectedTest
              ]}
              onPress={() => toggleTestSelection(test)}
            >
              <View style={styles.testHeader}>
                <View style={styles.testIcon}>
                  <Text style={styles.testEmoji}>{test.icon}</Text>
                </View>
                <View style={styles.testInfo}>
                  <View style={styles.testTitleRow}>
                    <Text style={styles.testName}>{test.name}</Text>
                    {test.popular && (
                      <View style={styles.popularBadge}>
                        <Text style={styles.popularText}>Popular</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.testDescription}>{test.description}</Text>
                  <View style={styles.testMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="time" size={14} color={theme.colors.text.secondary} />
                      <Text style={styles.metaText}>{test.duration}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="restaurant" size={14} color={theme.colors.text.secondary} />
                      <Text style={styles.metaText}>{test.fasting ? 'Fasting Required' : 'No Fasting'}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="pricetag" size={14} color={theme.colors.text.secondary} />
                      <Text style={styles.metaText}>${test.price}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.testActions}>
                  <View style={[
                    styles.checkbox,
                    selectedTests.find(t => t.id === test.id) && styles.checkboxSelected
                  ]}>
                    {selectedTests.find(t => t.id === test.id) && (
                      <Ionicons name="checkmark" size={16} color={theme.colors.text.inverse} />
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Lab Centers */}
        <View style={styles.centersSection}>
          <Text style={styles.sectionTitle}>Lab Centers</Text>
          {labCenters.map((center) => (
            <TouchableOpacity
              key={center.id}
              style={[
                styles.centerCard,
                selectedCenter?.id === center.id && styles.selectedCenter,
                !center.available && styles.unavailableCenter
              ]}
              onPress={() => center.available && setSelectedCenter(center)}
              disabled={!center.available}
            >
              <View style={styles.centerHeader}>
                <View style={styles.centerInfo}>
                  <Text style={[
                    styles.centerName,
                    !center.available && styles.unavailableText
                  ]}>
                    {center.name}
                  </Text>
                  <Text style={[
                    styles.centerAddress,
                    !center.available && styles.unavailableText
                  ]}>
                    {center.address}
                  </Text>
                  <View style={styles.centerMeta}>
                    <View style={styles.metaItem}>
                      <View style={styles.starsContainer}>
                        {renderStars(center.rating)}
                      </View>
                      <Text style={styles.metaText}>{center.rating}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="location" size={14} color={theme.colors.text.secondary} />
                      <Text style={styles.metaText}>{center.distance}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.centerStatus}>
                  {center.available ? (
                    <View style={styles.availableBadge}>
                      <Text style={styles.availableText}>Available</Text>
                    </View>
                  ) : (
                    <View style={styles.unavailableBadge}>
                      <Text style={styles.unavailableBadgeText}>Closed</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Booking Summary */}
        {selectedTests.length > 0 && (
          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Booking Summary</Text>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Selected Tests ({selectedTests.length})</Text>
              {selectedTests.map((test) => (
                <View key={test.id} style={styles.summaryItem}>
                  <Text style={styles.summaryItemName}>{test.name}</Text>
                  <Text style={styles.summaryItemPrice}>${test.price}</Text>
                </View>
              ))}
              <View style={styles.summaryTotal}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalPrice}>${getTotalPrice()}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Book Button */}
        {selectedTests.length > 0 && selectedCenter && (
          <TouchableOpacity style={styles.bookButton} onPress={handleBookTest}>
            <Ionicons name="flask" size={24} color={theme.colors.text.inverse} />
            <Text style={styles.bookButtonText}>
              Book Tests - ${getTotalPrice()}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Booking Modal */}
      <Modal
        visible={showBookingModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBookingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Book Lab Test</Text>
            <Text style={styles.modalDescription}>
              Please provide your details to complete the booking
            </Text>
            
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

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: theme.spacing.sm }]}>
                  <Text style={styles.inputLabel}>Date *</Text>
                  <TextInput
                    style={styles.input}
                    value={selectedDate}
                    onChangeText={setSelectedDate}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor={theme.colors.text.secondary}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: theme.spacing.sm }]}>
                  <Text style={styles.inputLabel}>Time *</Text>
                  <TextInput
                    style={styles.input}
                    value={selectedTime}
                    onChangeText={setSelectedTime}
                    placeholder="HH:MM"
                    placeholderTextColor={theme.colors.text.secondary}
                  />
                </View>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowBookingModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleConfirmBooking}
              >
                <Text style={styles.confirmButtonText}>Confirm Booking</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  testsSection: {
    marginBottom: theme.spacing['3xl'],
  },
  sectionTitle: {
    ...theme.typography.textStyles.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  testCard: {
    ...theme.components.card,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTest: {
    borderColor: theme.colors.primary[500],
    backgroundColor: theme.colors.primary[50],
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  testIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.lg,
  },
  testEmoji: {
    fontSize: 24,
  },
  testInfo: {
    flex: 1,
  },
  testTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  testName: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.primary,
    flex: 1,
  },
  popularBadge: {
    backgroundColor: theme.colors.warning,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: 8,
  },
  popularText: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.inverse,
    fontWeight: '600',
  },
  testDescription: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  testMeta: {
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
  testActions: {
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary[500],
    borderColor: theme.colors.primary[500],
  },
  centersSection: {
    marginBottom: theme.spacing['3xl'],
  },
  centerCard: {
    ...theme.components.card,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCenter: {
    borderColor: theme.colors.primary[500],
    backgroundColor: theme.colors.primary[50],
  },
  unavailableCenter: {
    opacity: 0.6,
  },
  centerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  centerInfo: {
    flex: 1,
  },
  centerName: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  centerAddress: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  centerMeta: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: theme.spacing.xs,
  },
  centerStatus: {
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
  summarySection: {
    marginBottom: theme.spacing.xl,
  },
  summaryCard: {
    ...theme.components.card,
  },
  summaryTitle: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  summaryItemName: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.text.primary,
    flex: 1,
  },
  summaryItemPrice: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.text.secondary,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    paddingTop: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  totalLabel: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.primary,
  },
  totalPrice: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.primary[500],
    fontWeight: 'bold',
  },
  bookButton: {
    backgroundColor: theme.colors.primary[500],
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: 12,
    padding: theme.spacing['3xl'],
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    ...theme.typography.textStyles.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  modalDescription: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing['3xl'],
  },
  formContainer: {
    marginBottom: theme.spacing.xl,
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
  modalButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.colors.background.tertiary,
    padding: theme.spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...theme.typography.textStyles.label,
    color: theme.colors.text.secondary,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: theme.colors.primary[500],
    padding: theme.spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    ...theme.typography.textStyles.label,
    color: theme.colors.text.inverse,
    fontWeight: '600',
  },
});