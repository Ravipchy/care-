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
  Modal,
  FlatList,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { theme } from '../theme';
import { useFamily, FamilyMember } from '../contexts/FamilyContext';
import FamilyMemberSelector from '../components/FamilyMemberSelector';

type LabTestScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LabTest'>;

const { width } = Dimensions.get('window');

// Test categories
const categories = [
  { id: 'all', name: 'All', icon: 'grid-outline' },
  { id: 'full-body', name: 'Full Body Checkup', icon: 'body-outline' },
  { id: 'diabetes', name: 'Diabetes', icon: 'water-outline' },
  { id: 'heart', name: 'Heart', icon: 'heart-outline' },
  { id: 'kidney', name: 'Kidney', icon: 'fitness-outline' },
  { id: 'thyroid', name: 'Thyroid', icon: 'leaf-outline' },
  { id: 'liver', name: 'Liver', icon: 'medical-outline' },
];

// Enhanced lab tests data
const labTests = [
  {
    id: 1,
    name: 'Complete Blood Count (CBC)',
    description: 'Includes 5 parameters',
    price: 150,
    duration: '2-4 hours',
    fasting: true,
    category: 'full-body',
    icon: '🩸',
    popular: true,
    homeCollection: true,
  },
  {
    id: 2,
    name: 'Lipid Profile',
    description: 'Includes 4 parameters',
    price: 200,
    duration: '4-6 hours',
    fasting: true,
    category: 'heart',
    icon: '💉',
    popular: true,
    homeCollection: true,
  },
  {
    id: 3,
    name: 'Thyroid Function Test',
    description: 'Includes 3 parameters',
    price: 300,
    duration: '6-8 hours',
    fasting: false,
    category: 'thyroid',
    icon: '🦋',
    popular: false,
    homeCollection: true,
  },
  {
    id: 4,
    name: 'Diabetes Panel',
    description: 'Includes 6 parameters',
    price: 250,
    duration: '4-6 hours',
    fasting: true,
    category: 'diabetes',
    icon: '🍯',
    popular: true,
    homeCollection: true,
  },
  {
    id: 5,
    name: 'Liver Function Test',
    description: 'Includes 8 parameters',
    price: 180,
    duration: '4-6 hours',
    fasting: true,
    category: 'liver',
    icon: '🫀',
    popular: false,
    homeCollection: true,
  },
  {
    id: 6,
    name: 'Kidney Function Test',
    description: 'Includes 4 parameters',
    price: 120,
    duration: '2-4 hours',
    fasting: false,
    category: 'kidney',
    icon: '🫁',
    popular: false,
    homeCollection: true,
  },
  {
    id: 7,
    name: 'Full Body Checkup',
    description: 'Includes 25+ parameters',
    price: 800,
    duration: '6-8 hours',
    fasting: true,
    category: 'full-body',
    icon: '🏥',
    popular: true,
    homeCollection: true,
  },
  {
    id: 8,
    name: 'Cardiac Risk Assessment',
    description: 'Includes 8 parameters',
    price: 350,
    duration: '4-6 hours',
    fasting: true,
    category: 'heart',
    icon: '❤️',
    popular: false,
    homeCollection: true,
  },
  {
    id: 9,
    name: 'Vitamin D Test',
    description: 'Includes 1 parameter',
    price: 400,
    duration: '2-4 hours',
    fasting: false,
    category: 'full-body',
    icon: '☀️',
    popular: false,
    homeCollection: true,
  },
  {
    id: 10,
    name: 'HbA1c Test',
    description: 'Includes 1 parameter',
    price: 180,
    duration: '2-4 hours',
    fasting: false,
    category: 'diabetes',
    icon: '🩺',
    popular: true,
    homeCollection: true,
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
  const navigation = useNavigation<LabTestScreenNavigationProp>();
  const { familyMembers } = useFamily();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<any[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedPrescription, setUploadedPrescription] = useState<string | null>(null);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState<any>(null);

  const popularTests = labTests.filter(test => test.popular);
  
  const filteredTests = labTests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (test: any) => {
    setSelectedTest(test);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedMember) {
      Alert.alert('Select Patient', 'Please select a family member for the test.');
      return;
    }
    
    if (!selectedTest) return;

    const existingItem = cart.find(item => item.id === selectedTest.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === selectedTest.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...selectedTest, quantity: 1 }]);
    }
    
    Alert.alert(
      'Test Booked!',
      `${selectedTest.name} has been booked successfully for ${selectedMember.name}.\n\nPatient: ${selectedMember.name} (${selectedMember.relation})\nAge: ${selectedMember.age} years\nContact: ${selectedMember.contactNumber}\n\nPrice: $${selectedTest.price}\n\nYou will receive a confirmation call shortly.`,
      [
        { text: 'OK', onPress: () => {
          setShowBookingModal(false);
          setSelectedMember(null);
          setSelectedTest(null);
        }}
      ]
    );
  };

  const handleAddNewMember = () => {
    navigation.navigate('Family' as any);
  };

  const uploadPrescription = () => {
    // Simulate file upload
    setUploadedPrescription('prescription_uploaded.pdf');
    setShowUploadModal(false);
    setShowUploadSuccess(true);
    setTimeout(() => setShowUploadSuccess(false), 3000);
  };

  const goToCart = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty. Add some tests first.');
      return;
    }
    navigation.navigate('Cart' as any, { cart });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Cart Icon */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="flask" size={24} color={theme.colors.primary[500]} />
          <Text style={styles.headerTitle}>Lab Tests</Text>
        </View>
        <TouchableOpacity style={styles.cartIcon} onPress={goToCart}>
          <Ionicons name="cart" size={24} color={theme.colors.text.primary} />
          {cart.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cart.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={[{ type: 'content' }]}
        renderItem={() => (
          <View style={styles.scrollContent}>
            {/* Search Bar */}
            <View style={styles.searchSection}>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={theme.colors.text.secondary} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search tests..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor={theme.colors.text.secondary}
                />
                    </View>
                    </View>

            {/* Popular Tests Section */}
            <View style={styles.popularSection}>
              <Text style={styles.sectionTitle}>Popular Tests</Text>
              <FlatList
                data={popularTests}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.popularTestCard}>
                    <View style={styles.popularTestIcon}>
                      <Text style={styles.popularTestEmoji}>{item.icon}</Text>
                    </View>
                    <Text style={styles.popularTestName} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.popularTestPrice}>${item.price}</Text>
                    <TouchableOpacity 
                      style={styles.bookNowButton}
                      onPress={() => addToCart(item)}
                    >
                      <Text style={styles.bookNowText}>Book Now</Text>
                    </TouchableOpacity>
                  </View>
                )}
                contentContainerStyle={styles.popularTestsList}
              />
        </View>

            {/* Categories Section */}
            <View style={styles.categoriesSection}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <FlatList
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                      styles.categoryChip,
                      selectedCategory === item.id && styles.categoryChipActive
                    ]}
                    onPress={() => setSelectedCategory(item.id)}
                  >
                    <Ionicons 
                      name={item.icon as any} 
                      size={16} 
                      color={selectedCategory === item.id ? theme.colors.text.inverse : theme.colors.text.secondary} 
                    />
                  <Text style={[
                      styles.categoryChipText,
                      selectedCategory === item.id && styles.categoryChipTextActive
                  ]}>
                      {item.name}
                  </Text>
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.categoriesList}
              />
            </View>

            {/* Tests Grid */}
            <View style={styles.testsSection}>
              <Text style={styles.sectionTitle}>Available Tests</Text>
              <FlatList
                data={filteredTests}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.testCard}>
                    <View style={styles.testIconContainer}>
                      <Text style={styles.testEmoji}>{item.icon}</Text>
                    </View>
                    <Text style={styles.testName} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.testDescription} numberOfLines={2}>{item.description}</Text>
                    <Text style={styles.testPrice}>${item.price}</Text>
                    <View style={styles.testFeatures}>
                      <View style={styles.homeCollection}>
                        <Ionicons name="home" size={12} color={theme.colors.success[500]} />
                        <Text style={styles.homeCollectionText}>Home Collection</Text>
                      </View>
                      <View style={styles.fastingInfo}>
                        <Ionicons 
                          name={item.fasting ? "restaurant" : "checkmark-circle"} 
                          size={12} 
                          color={item.fasting ? theme.colors.warning[500] : theme.colors.success[500]} 
                        />
                  <Text style={[
                          styles.fastingText,
                          { color: item.fasting ? theme.colors.warning[500] : theme.colors.success[500] }
                  ]}>
                          {item.fasting ? 'Fasting' : 'No Fasting'}
                  </Text>
                      </View>
                    </View>
                    <TouchableOpacity 
                      style={styles.bookTestButton}
                      onPress={() => addToCart(item)}
                    >
                      <Text style={styles.bookTestText}>Book Test</Text>
                    </TouchableOpacity>
                    </View>
                  )}
                contentContainerStyle={styles.testsList}
              />
        </View>

            {/* Upload Prescription Section */}
            <View style={styles.uploadSection}>
              <View style={styles.uploadCard}>
                <View style={styles.uploadCardHeader}>
                  <Ionicons name="document-text" size={24} color={theme.colors.primary[500]} />
                  <Text style={styles.uploadCardTitle}>Upload Prescription</Text>
                </View>
                <Text style={styles.uploadCardDescription}>
                  Upload your prescription for custom test requests
                </Text>
                <TouchableOpacity 
                  style={styles.uploadButton}
                  onPress={() => setShowUploadModal(true)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="cloud-upload" size={20} color={theme.colors.text.inverse} />
                  <Text style={styles.uploadButtonText}>Upload Prescription</Text>
                </TouchableOpacity>
                {uploadedPrescription && (
                  <View style={styles.uploadedFile}>
                    <Ionicons name="checkmark-circle" size={20} color={theme.colors.success[500]} />
                    <Text style={styles.uploadedFileText}>Prescription uploaded successfully</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />

      {/* Upload Success Message */}
      {showUploadSuccess && (
        <View style={styles.successMessage}>
          <Ionicons name="checkmark-circle" size={20} color={theme.colors.text.inverse} />
          <Text style={styles.successMessageText}>
            Your prescription has been uploaded successfully.
            </Text>
        </View>
        )}

      {/* Upload Prescription Modal */}
      <Modal
        visible={showUploadModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUploadModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upload Prescription</Text>
            <Text style={styles.modalDescription}>
              Take a photo or select a file to upload your prescription
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={uploadPrescription}
              >
                <Ionicons name="camera" size={20} color={theme.colors.text.inverse} />
                <Text style={styles.modalButtonText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={uploadPrescription}
              >
                <Ionicons name="document" size={20} color={theme.colors.text.inverse} />
                <Text style={styles.modalButtonText}>Select File</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowUploadModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Booking Modal */}
      <Modal
        visible={showBookingModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBookingModal(false)}
      >
        <View style={styles.bookingModalOverlay}>
          <View style={styles.bookingModalContent}>
            <View style={styles.bookingModalHeader}>
              <Text style={styles.bookingModalTitle}>Book Lab Test</Text>
              <TouchableOpacity
                style={styles.bookingCloseButton}
                onPress={() => setShowBookingModal(false)}
              >
                <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            </View>

            {selectedTest && (
              <View style={styles.testInfoCard}>
                <Text style={styles.testInfoName}>{selectedTest.name}</Text>
                <Text style={styles.testInfoDescription}>{selectedTest.description}</Text>
                <Text style={styles.testInfoPrice}>Price: ${selectedTest.price}</Text>
                <Text style={styles.testInfoDuration}>Duration: {selectedTest.duration}</Text>
              </View>
            )}

            <FamilyMemberSelector
              selectedMember={selectedMember}
              onSelectMember={setSelectedMember}
              onAddNewMember={handleAddNewMember}
              title="Select Patient"
            />

            <View style={styles.bookingModalActions}>
              <TouchableOpacity
                style={styles.bookingCancelButton}
                onPress={() => setShowBookingModal(false)}
              >
                <Text style={styles.bookingCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bookingConfirmButton}
                onPress={handleConfirmBooking}
              >
                <Text style={styles.bookingConfirmButtonText}>Book Test</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    ...theme.typography.textStyles.h3,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
    fontWeight: '700',
  },
  cartIcon: {
    position: 'relative',
    padding: theme.spacing.sm,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: theme.colors.error[500],
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: theme.colors.text.inverse,
    fontSize: 12,
    fontWeight: '600',
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  flatListContent: {
    flexGrow: 1,
  },
  searchSection: {
    marginBottom: theme.spacing.xl,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    borderRadius: 16,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    shadowColor: theme.colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: theme.spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.textStyles.body1.fontSize,
    color: theme.colors.text.primary,
  },
  popularSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.textStyles.h4,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    fontWeight: '600',
  },
  popularTestsList: {
    paddingRight: theme.spacing.lg,
  },
  popularTestCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: 16,
    padding: theme.spacing.lg,
    marginRight: theme.spacing.md,
    width: 160,
    alignItems: 'center',
    shadowColor: theme.colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  popularTestIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  popularTestEmoji: {
    fontSize: 24,
  },
  popularTestName: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
  popularTestPrice: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.primary[500],
    marginBottom: theme.spacing.md,
    fontWeight: '700',
  },
  bookNowButton: {
    backgroundColor: theme.colors.primary[500],
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  bookNowText: {
    color: theme.colors.text.inverse,
    ...theme.typography.textStyles.label,
    fontWeight: '600',
  },
  categoriesSection: {
    marginBottom: theme.spacing.xl,
  },
  categoriesList: {
    paddingRight: theme.spacing.lg,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: 20,
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary[500],
    borderColor: theme.colors.primary[500],
  },
  categoryChipText: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: theme.colors.text.inverse,
  },
  testsSection: {
    marginBottom: theme.spacing.xl,
  },
  testsList: {
    paddingBottom: theme.spacing.xl,
  },
  testCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: 16,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    marginRight: theme.spacing.md,
    width: (width - theme.spacing.lg * 3) / 2,
    shadowColor: theme.colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  testIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    alignSelf: 'center',
  },
  testEmoji: {
    fontSize: 24,
  },
  testName: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
  testDescription: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  testPrice: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.primary[500],
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    fontWeight: '700',
  },
  testFeatures: {
    marginBottom: theme.spacing.md,
  },
  homeCollection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
  },
  homeCollectionText: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.success[500],
    marginLeft: theme.spacing.xs,
    fontWeight: '500',
  },
  fastingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fastingText: {
    ...theme.typography.textStyles.caption,
    marginLeft: theme.spacing.xs,
    fontWeight: '500',
  },
  bookTestButton: {
    backgroundColor: theme.colors.primary[500],
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookTestText: {
    color: theme.colors.text.inverse,
    ...theme.typography.textStyles.label,
    fontWeight: '600',
  },
  uploadSection: {
    marginBottom: theme.spacing.xl,
  },
  uploadCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: 16,
    padding: theme.spacing.xl,
    shadowColor: theme.colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  uploadCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  uploadCardTitle: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
    fontWeight: '600',
  },
  uploadCardDescription: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  uploadButton: {
    backgroundColor: theme.colors.primary[500],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 12,
  },
  uploadButtonText: {
    color: theme.colors.text.inverse,
    ...theme.typography.textStyles.label,
    marginLeft: theme.spacing.sm,
    fontWeight: '600',
  },
  uploadedFile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.success[50],
    padding: theme.spacing.md,
    borderRadius: 8,
    marginTop: theme.spacing.md,
  },
  uploadedFileText: {
    color: theme.colors.success[500],
    ...theme.typography.textStyles.body2,
    fontWeight: '600',
    marginLeft: theme.spacing.sm,
  },
  successMessage: {
    position: 'absolute',
    top: 100,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    backgroundColor: theme.colors.success[500],
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderRadius: 12,
    shadowColor: theme.colors.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  successMessageText: {
    color: theme.colors.text.inverse,
    ...theme.typography.textStyles.body2,
    marginLeft: theme.spacing.md,
    flex: 1,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: 16,
    padding: theme.spacing['3xl'],
    width: '90%',
    alignItems: 'center',
    shadowColor: theme.colors.shadow.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    ...theme.typography.textStyles.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    fontWeight: '600',
  },
  modalDescription: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing['3xl'],
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  modalButton: {
    backgroundColor: theme.colors.primary[500],
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    justifyContent: 'center',
  },
  modalButtonText: {
    color: theme.colors.text.inverse,
    ...theme.typography.textStyles.body1,
    fontWeight: '600',
    marginLeft: theme.spacing.sm,
  },
  cancelButton: {
    paddingVertical: theme.spacing.md,
  },
  cancelButtonText: {
    color: theme.colors.text.secondary,
    ...theme.typography.textStyles.body1,
    fontWeight: '600',
  },
  // Booking Modal Styles
  bookingModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingModalContent: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    shadowColor: theme.colors.shadow.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  bookingModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  bookingModalTitle: {
    ...theme.typography.textStyles.h4,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  bookingCloseButton: {
    padding: theme.spacing.sm,
  },
  testInfoCard: {
    backgroundColor: theme.colors.primary[50],
    margin: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary[500],
  },
  testInfoName: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.primary,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  testInfoDescription: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  testInfoPrice: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.primary[500],
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  testInfoDuration: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.text.secondary,
  },
  bookingModalActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  bookingCancelButton: {
    flex: 1,
    backgroundColor: theme.colors.background.tertiary,
    paddingVertical: theme.spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookingCancelButtonText: {
    ...theme.typography.textStyles.h6,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
  bookingConfirmButton: {
    flex: 1,
    backgroundColor: theme.colors.primary[500],
    paddingVertical: theme.spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookingConfirmButtonText: {
    ...theme.typography.textStyles.h6,
    color: theme.colors.text.inverse,
    fontWeight: '600',
  },
});