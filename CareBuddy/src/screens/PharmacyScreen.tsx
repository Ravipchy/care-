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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { theme } from '../theme';

type PharmacyScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

// Placeholder medicine data
const medicines = [
  { id: 1, name: 'Paracetamol 500mg', price: 15, image: '💊', available: true, description: 'Pain relief and fever reducer' },
  { id: 2, name: 'Amoxicillin 250mg', price: 45, image: '💊', available: true, description: 'Antibiotic for bacterial infections' },
  { id: 3, name: 'Ibuprofen 400mg', price: 25, image: '💊', available: false, description: 'Anti-inflammatory pain relief' },
  { id: 4, name: 'Vitamin D3', price: 35, image: '💊', available: true, description: 'Vitamin supplement for bone health' },
  { id: 5, name: 'Cetirizine 10mg', price: 20, image: '💊', available: true, description: 'Antihistamine for allergies' },
  { id: 6, name: 'Omeprazole 20mg', price: 30, image: '💊', available: true, description: 'Proton pump inhibitor for acid reflux' },
];

export default function PharmacyScreen() {
  const navigation = useNavigation<PharmacyScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedPrescription, setUploadedPrescription] = useState<string | null>(null);

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    Alert.alert('Success', 'Prescription uploaded successfully!');
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image 
            source={require('../../assets/images/carebuddy-logo.png')} 
            style={styles.heroLogo}
            resizeMode="contain"
          />
          <Text style={styles.heroTitle}>Pharmacy</Text>
          <Text style={styles.heroSubtitle}>Order medicines and upload prescriptions</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#7f8c8d" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search medicines..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#7f8c8d"
            />
          </View>
        </View>

        {/* Upload Prescription Button */}
        <View style={styles.uploadSection}>
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={() => setShowUploadModal(true)}
          >
            <Ionicons name="cloud-upload" size={25} color="#ffffff" />
            <Text style={styles.uploadButtonText}>Upload Prescription</Text>
          </TouchableOpacity>
          {uploadedPrescription && (
            <View style={styles.uploadedFile}>
              <Ionicons name="document" size={20} color="#27ae60" />
              <Text style={styles.uploadedFileText}>{uploadedPrescription}</Text>
            </View>
          )}
        </View>

        {/* Medicines List */}
        <View style={styles.medicinesSection}>
          <Text style={styles.sectionTitle}>Available Medicines</Text>
          {filteredMedicines.map((medicine) => (
            <View key={medicine.id} style={styles.medicineCard}>
              <View style={styles.medicineImage}>
                <Text style={styles.medicineEmoji}>{medicine.image}</Text>
              </View>
              <View style={styles.medicineInfo}>
                <Text style={styles.medicineName}>{medicine.name}</Text>
                <Text style={styles.medicineDescription}>{medicine.description}</Text>
                <View style={styles.medicinePriceRow}>
                  <Text style={styles.medicinePrice}>${medicine.price}</Text>
                  <Text style={[
                    styles.availability, 
                    { color: medicine.available ? '#27ae60' : '#e74c3c' }
                  ]}>
                    {medicine.available ? 'In Stock' : 'Out of Stock'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={[
                  styles.bookButton, 
                  { backgroundColor: medicine.available ? '#3498db' : '#bdc3c7' }
                ]}
                onPress={() => addToCart(medicine)}
                disabled={!medicine.available}
              >
                <Text style={styles.bookButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Cart Button */}
        {cart.length > 0 && (
          <TouchableOpacity style={styles.cartButton} onPress={goToCart}>
            <Ionicons name="cart" size={25} color="#ffffff" />
            <Text style={styles.cartButtonText}>View Cart ({cart.length})</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

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
                <Ionicons name="camera" size={20} color="#ffffff" />
                <Text style={styles.modalButtonText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={uploadPrescription}
              >
                <Ionicons name="document" size={20} color="#ffffff" />
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
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: theme.spacing['3xl'],
    paddingVertical: theme.spacing['2xl'],
    ...theme.components.card,
  },
  heroLogo: {
    width: 80,
    height: 80,
    marginBottom: theme.spacing.lg,
  },
  heroTitle: {
    ...theme.typography.textStyles.h2,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  heroSubtitle: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  searchSection: {
    marginBottom: theme.spacing.xl,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    borderRadius: 12,
    paddingHorizontal: theme.spacing.lg,
    ...theme.components.card,
  },
  searchIcon: {
    marginRight: theme.spacing.md,
  },
  searchInput: {
    flex: 1,
    paddingVertical: theme.spacing.lg,
    fontSize: theme.typography.textStyles.body1.fontSize,
    color: theme.colors.text.primary,
  },
  uploadSection: {
    marginBottom: theme.spacing['3xl'],
  },
  uploadButton: {
    backgroundColor: theme.colors.secondary[500],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    borderRadius: 12,
    ...theme.components.card,
  },
  uploadButtonText: {
    color: theme.colors.text.inverse,
    ...theme.typography.textStyles.h5,
    marginLeft: theme.spacing.md,
  },
  uploadedFile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.secondary[50],
    padding: theme.spacing.lg,
    borderRadius: 8,
    marginTop: theme.spacing.md,
  },
  uploadedFileText: {
    color: theme.colors.secondary[500],
    ...theme.typography.textStyles.body1,
    fontWeight: '600',
    marginLeft: theme.spacing.md,
  },
  medicinesSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.textStyles.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  medicineCard: {
    ...theme.components.card,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  medicineImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.lg,
  },
  medicineEmoji: {
    fontSize: 30,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  medicineDescription: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  medicinePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medicinePrice: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.secondary[500],
  },
  availability: {
    ...theme.typography.textStyles.body2,
    fontWeight: '600',
  },
  bookButton: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: 8,
  },
  bookButtonText: {
    color: theme.colors.text.inverse,
    ...theme.typography.textStyles.label,
  },
  cartButton: {
    backgroundColor: theme.colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    borderRadius: 12,
    ...theme.components.card,
  },
  cartButtonText: {
    color: theme.colors.text.inverse,
    ...theme.typography.textStyles.h5,
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
    alignItems: 'center',
  },
  modalTitle: {
    ...theme.typography.textStyles.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  modalDescription: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing['3xl'],
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
    borderRadius: 8,
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
