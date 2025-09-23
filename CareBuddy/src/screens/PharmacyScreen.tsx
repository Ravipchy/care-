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

type PharmacyScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Pharmacy'>;

const { width } = Dimensions.get('window');

// Medicine categories
const categories = [
  { id: 'all', name: 'All', icon: 'grid-outline' },
  { id: 'pain-relief', name: 'Pain Relief', icon: 'medical-outline' },
  { id: 'diabetes', name: 'Diabetes Care', icon: 'water-outline' },
  { id: 'heart-health', name: 'Heart Health', icon: 'heart-outline' },
  { id: 'general', name: 'General', icon: 'medkit-outline' },
  { id: 'vitamins', name: 'Vitamins', icon: 'leaf-outline' },
  { id: 'respiratory', name: 'Respiratory', icon: 'fitness-outline' },
];

// Enhanced medicine data with categories
const medicines = [
  { id: 1, name: 'Paracetamol 500mg', price: 15, image: '💊', available: true, description: 'Pain relief and fever reducer', category: 'pain-relief' },
  { id: 2, name: 'Amoxicillin 250mg', price: 45, image: '💊', available: true, description: 'Antibiotic for bacterial infections', category: 'general' },
  { id: 3, name: 'Ibuprofen 400mg', price: 25, image: '💊', available: false, description: 'Anti-inflammatory pain relief', category: 'pain-relief' },
  { id: 4, name: 'Vitamin D3', price: 35, image: '💊', available: true, description: 'Vitamin supplement for bone health', category: 'vitamins' },
  { id: 5, name: 'Cetirizine 10mg', price: 20, image: '💊', available: true, description: 'Antihistamine for allergies', category: 'respiratory' },
  { id: 6, name: 'Omeprazole 20mg', price: 30, image: '💊', available: true, description: 'Proton pump inhibitor for acid reflux', category: 'general' },
  { id: 7, name: 'Metformin 500mg', price: 28, image: '💊', available: true, description: 'Diabetes medication', category: 'diabetes' },
  { id: 8, name: 'Aspirin 75mg', price: 18, image: '💊', available: true, description: 'Heart health and blood thinner', category: 'heart-health' },
  { id: 9, name: 'Vitamin C', price: 22, image: '💊', available: true, description: 'Immune system support', category: 'vitamins' },
  { id: 10, name: 'Salbutamol Inhaler', price: 55, image: '💊', available: true, description: 'Asthma and respiratory relief', category: 'respiratory' },
];

export default function PharmacyScreen() {
  const navigation = useNavigation<PharmacyScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedPrescription, setUploadedPrescription] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         medicine.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (medicine: any) => {
    if (!medicine.available) {
      Alert.alert('Not Available', 'This medicine is currently out of stock.');
      return;
    }

    const existingItem = cart.find(item => item.id === medicine.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === medicine.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }]);
    }
    Alert.alert('Added to Cart', `${medicine.name} has been added to your cart.`);
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
      Alert.alert('Empty Cart', 'Your cart is empty. Add some medicines first.');
      return;
    }
    navigation.navigate('Cart' as any, { cart });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Cart Icon */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pharmacy</Text>
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
              placeholder="Search medicines..."
              value={searchQuery}
              onChangeText={setSearchQuery}
                  placeholderTextColor={theme.colors.text.secondary}
            />
          </View>
        </View>

            {/* Upload Prescription Card */}
            <View style={styles.uploadCard}>
              <View style={styles.uploadCardHeader}>
                <Ionicons name="cloud-upload" size={24} color={theme.colors.primary[500]} />
                <Text style={styles.uploadCardTitle}>Upload Prescription</Text>
              </View>
              <Text style={styles.uploadCardDescription}>
                Upload your prescription and our pharmacist will verify and contact you
              </Text>
          <TouchableOpacity 
            style={styles.uploadButton}
                onPress={() => setShowUploadModal(true)}
            activeOpacity={0.7}
          >
                <Ionicons name="add" size={20} color={theme.colors.text.inverse} />
                <Text style={styles.uploadButtonText}>Upload Now</Text>
          </TouchableOpacity>
          {uploadedPrescription && (
            <View style={styles.uploadedFile}>
                  <Ionicons name="checkmark-circle" size={20} color={theme.colors.success[500]} />
                  <Text style={styles.uploadedFileText}>Prescription uploaded successfully</Text>
            </View>
          )}
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

            {/* Popular Medicines Section */}
        <View style={styles.medicinesSection}>
              <Text style={styles.sectionTitle}>Popular Medicines</Text>
              <FlatList
                data={filteredMedicines}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.medicineCard}>
                    <View style={styles.medicineImageContainer}>
                      <Text style={styles.medicineEmoji}>{item.image}</Text>
              </View>
              <View style={styles.medicineInfo}>
                      <Text style={styles.medicineName} numberOfLines={2}>{item.name}</Text>
                      <Text style={styles.medicinePrice}>${item.price}</Text>
                      <View style={styles.medicineAvailability}>
                        <View style={[
                          styles.availabilityDot,
                          { backgroundColor: item.available ? theme.colors.success[500] : theme.colors.error[500] }
                        ]} />
                  <Text style={[
                          styles.availabilityText,
                          { color: item.available ? theme.colors.success[500] : theme.colors.error[500] }
                  ]}>
                          {item.available ? 'In Stock' : 'Out of Stock'}
                  </Text>
              </View>
              <TouchableOpacity 
                style={[
                          styles.addToCartButton,
                          { backgroundColor: item.available ? theme.colors.primary[500] : theme.colors.neutral[300] }
                        ]}
                        onPress={() => addToCart(item)}
                        disabled={!item.available}
                      >
                        <Ionicons 
                          name="add" 
                          size={16} 
                          color={item.available ? theme.colors.text.inverse : theme.colors.text.secondary} 
                        />
                        <Text style={[
                          styles.addToCartText,
                          { color: item.available ? theme.colors.text.inverse : theme.colors.text.secondary }
                        ]}>
                          Add to Cart
                        </Text>
              </TouchableOpacity>
                    </View>
                  </View>
                )}
                contentContainerStyle={styles.medicinesList}
              />
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
            Prescription uploaded successfully. Our pharmacist will verify and contact you.
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
  headerTitle: {
    ...theme.typography.textStyles.h3,
    color: theme.colors.text.primary,
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
  uploadCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: 16,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
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
  categoriesSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.textStyles.h4,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    fontWeight: '600',
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
  medicinesSection: {
    marginBottom: theme.spacing.xl,
  },
  medicinesList: {
    paddingBottom: theme.spacing.xl,
  },
  medicineCard: {
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
    alignItems: 'center',
  },
  medicineImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    alignSelf: 'center',
  },
  medicineEmoji: {
    fontSize: 24,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
  medicinePrice: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.primary[500],
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
    fontWeight: '700',
  },
  medicineAvailability: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.xs,
  },
  availabilityText: {
    ...theme.typography.textStyles.caption,
    fontWeight: '600',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 8,
  },
  addToCartText: {
    ...theme.typography.textStyles.caption,
    marginLeft: theme.spacing.xs,
    fontWeight: '600',
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
});
