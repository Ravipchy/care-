import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Modal,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { RootStackParamList } from '../types/navigation';
import { theme } from '../theme';

const { width, height } = Dimensions.get('window');

// Mock doctor data with coordinates
const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    rating: 4.8,
    experience: '15 years',
    image: '👩‍⚕️',
    available: true,
    nextAvailable: 'Today 2:00 PM',
    consultationFee: 150,
    latitude: 37.7749,
    longitude: -122.4194,
    address: '123 Medical Center Dr, San Francisco, CA',
    phone: '+1 (555) 123-4567',
    distance: 0.8
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'Neurologist',
    rating: 4.9,
    experience: '12 years',
    image: '👨‍⚕️',
    available: true,
    nextAvailable: 'Tomorrow 10:00 AM',
    consultationFee: 200,
    latitude: 37.7849,
    longitude: -122.4094,
    address: '456 Health Plaza, San Francisco, CA',
    phone: '+1 (555) 234-5678',
    distance: 1.2
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrician',
    rating: 4.7,
    experience: '8 years',
    image: '👩‍⚕️',
    available: false,
    nextAvailable: 'Next Week',
    consultationFee: 120,
    latitude: 37.7649,
    longitude: -122.4294,
    address: '789 Children\'s Hospital, San Francisco, CA',
    phone: '+1 (555) 345-6789',
    distance: 0.5
  },
  {
    id: 4,
    name: 'Dr. David Wilson',
    specialty: 'Orthopedist',
    rating: 4.6,
    experience: '20 years',
    image: '👨‍⚕️',
    available: true,
    nextAvailable: 'Today 4:00 PM',
    consultationFee: 180,
    latitude: 37.7549,
    longitude: -122.4394,
    address: '321 Bone & Joint Clinic, San Francisco, CA',
    phone: '+1 (555) 456-7890',
    distance: 1.8
  },
  {
    id: 5,
    name: 'Dr. Lisa Park',
    specialty: 'Dermatologist',
    rating: 4.8,
    experience: '10 years',
    image: '👩‍⚕️',
    available: true,
    nextAvailable: 'Tomorrow 3:00 PM',
    consultationFee: 130,
    latitude: 37.7949,
    longitude: -122.3994,
    address: '654 Skin Care Center, San Francisco, CA',
    phone: '+1 (555) 567-8901',
    distance: 2.1
  },
  {
    id: 6,
    name: 'Dr. James Brown',
    specialty: 'Psychiatrist',
    rating: 4.9,
    experience: '18 years',
    image: '👨‍⚕️',
    available: false,
    nextAvailable: 'Next Week',
    consultationFee: 250,
    latitude: 37.7449,
    longitude: -122.4494,
    address: '987 Mental Health Center, San Francisco, CA',
    phone: '+1 (555) 678-9012',
    distance: 2.5
  },
];

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  image: string;
  available: boolean;
  nextAvailable: string;
  consultationFee: number;
  latitude: number;
  longitude: number;
  address: string;
  phone: string;
  distance: number;
}

type NearbyDoctorsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NearbyDoctors'>;

export default function NearbyDoctorsScreen() {
  const navigation = useNavigation<NearbyDoctorsScreenNavigationProp>();
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showList, setShowList] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to find nearby doctors.');
        return;
      }

      setLocationPermission(true);
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);

      // Fit map to show all doctors
      if (mapRef.current) {
        const coordinates = doctors.map(doctor => ({
          latitude: doctor.latitude,
          longitude: doctor.longitude,
        }));
        
        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Unable to get your current location.');
    }
  };

  const handleDoctorPress = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleBookAppointment = (doctor: Doctor) => {
    if (!doctor.available) {
      Alert.alert('Not Available', 'This doctor is not available for booking at the moment.');
      return;
    }
    Alert.alert(
      'Book Appointment',
      `Book appointment with ${doctor.name}?\n\nSpecialty: ${doctor.specialty}\nFee: $${doctor.consultationFee}\nNext Available: ${doctor.nextAvailable}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Book Now', onPress: () => Alert.alert('Success', 'Appointment booked successfully!') }
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

  const getRegion = () => {
    if (userLocation) {
      return {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }
    // Default to San Francisco if no location
    return {
      latitude: 37.7749,
      longitude: -122.4194,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nearby Doctors</Text>
        <TouchableOpacity 
          style={styles.listButton}
          onPress={() => setShowList(!showList)}
        >
          <Ionicons 
            name={showList ? "map" : "list"} 
            size={20} 
            color={theme.colors.primary[500]} 
          />
          <Text style={styles.listButtonText}>
            {showList ? 'Map View' : 'List View'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Map View */}
      {!showList && (
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={getRegion()}
            showsUserLocation={true}
            showsMyLocationButton={true}
            showsCompass={true}
            showsScale={true}
          >
            {/* User Location Marker */}
            {userLocation && (
              <Marker
                coordinate={{
                  latitude: userLocation.coords.latitude,
                  longitude: userLocation.coords.longitude,
                }}
                title="Your Location"
                description="You are here"
                pinColor="blue"
              />
            )}

            {/* Doctor Markers */}
            {doctors.map((doctor) => (
              <Marker
                key={doctor.id}
                coordinate={{
                  latitude: doctor.latitude,
                  longitude: doctor.longitude,
                }}
                title={doctor.name}
                description={doctor.specialty}
                onPress={() => handleDoctorPress(doctor)}
              >
                <View style={styles.customMarker}>
                  <Ionicons 
                    name="medical" 
                    size={24} 
                    color={doctor.available ? theme.colors.primary[500] : theme.colors.neutral[400]} 
                  />
                </View>
              </Marker>
            ))}
          </MapView>
        </View>
      )}

      {/* List View */}
      {showList && (
        <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
          {doctors.map((doctor) => (
            <TouchableOpacity
              key={doctor.id}
              style={styles.doctorCard}
              onPress={() => handleDoctorPress(doctor)}
            >
              <View style={styles.doctorImage}>
                <Text style={styles.doctorEmoji}>{doctor.image}</Text>
              </View>
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{doctor.name}</Text>
                <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                <View style={styles.doctorRating}>
                  <View style={styles.starsContainer}>
                    {renderStars(doctor.rating)}
                  </View>
                  <Text style={styles.ratingText}>{doctor.rating}</Text>
                </View>
                <Text style={styles.doctorAddress}>{doctor.address}</Text>
                <View style={styles.distanceContainer}>
                  <Ionicons name="location" size={14} color={theme.colors.primary[500]} />
                  <Text style={styles.distanceText}>{doctor.distance} miles away</Text>
                </View>
                <View style={styles.availabilityContainer}>
                  <View style={[
                    styles.availabilityDot,
                    { backgroundColor: doctor.available ? theme.colors.success[500] : theme.colors.error[500] }
                  ]} />
                  <Text style={styles.availabilityText}>
                    {doctor.available ? `Available ${doctor.nextAvailable}` : 'Not Available'}
                  </Text>
                </View>
              </View>
              <View style={styles.doctorActions}>
                <Text style={styles.consultationFee}>${doctor.consultationFee}</Text>
                <TouchableOpacity
                  style={[
                    styles.bookButton,
                    { backgroundColor: doctor.available ? theme.colors.primary[500] : theme.colors.neutral[300] }
                  ]}
                  onPress={() => handleBookAppointment(doctor)}
                  disabled={!doctor.available}
                >
                  <Text style={[
                    styles.bookButtonText,
                    { color: doctor.available ? theme.colors.text.inverse : theme.colors.text.secondary }
                  ]}>
                    {doctor.available ? 'Book Now' : 'Unavailable'}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Bottom Sheet Modal */}
      <Modal
        visible={selectedDoctor !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedDoctor(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            {selectedDoctor && (
              <>
                <View style={styles.bottomSheetHeader}>
                  <View style={styles.bottomSheetHandle} />
                  <Text style={styles.bottomSheetTitle}>Doctor Details</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setSelectedDoctor(null)}
                  >
                    <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.bottomSheetContent}>
                  <View style={styles.doctorHeader}>
                    <View style={styles.doctorImageLarge}>
                      <Text style={styles.doctorEmojiLarge}>{selectedDoctor.image}</Text>
                    </View>
                    <View style={styles.doctorHeaderInfo}>
                      <Text style={styles.doctorNameLarge}>{selectedDoctor.name}</Text>
                      <Text style={styles.doctorSpecialtyLarge}>{selectedDoctor.specialty}</Text>
                      <View style={styles.doctorRatingLarge}>
                        <View style={styles.starsContainer}>
                          {renderStars(selectedDoctor.rating)}
                        </View>
                        <Text style={styles.ratingTextLarge}>{selectedDoctor.rating}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.detailSection}>
                    <View style={styles.detailRow}>
                      <Ionicons name="location" size={20} color={theme.colors.primary[500]} />
                      <View style={styles.detailTextContainer}>
                        <Text style={styles.detailLabel}>Address</Text>
                        <Text style={styles.detailValue}>{selectedDoctor.address}</Text>
                      </View>
                    </View>

                    <View style={styles.detailRow}>
                      <Ionicons name="call" size={20} color={theme.colors.primary[500]} />
                      <View style={styles.detailTextContainer}>
                        <Text style={styles.detailLabel}>Phone</Text>
                        <Text style={styles.detailValue}>{selectedDoctor.phone}</Text>
                      </View>
                    </View>

                    <View style={styles.detailRow}>
                      <Ionicons name="time" size={20} color={theme.colors.primary[500]} />
                      <View style={styles.detailTextContainer}>
                        <Text style={styles.detailLabel}>Experience</Text>
                        <Text style={styles.detailValue}>{selectedDoctor.experience}</Text>
                      </View>
                    </View>

                    <View style={styles.detailRow}>
                      <Ionicons name="cash" size={20} color={theme.colors.primary[500]} />
                      <View style={styles.detailTextContainer}>
                        <Text style={styles.detailLabel}>Consultation Fee</Text>
                        <Text style={styles.detailValue}>${selectedDoctor.consultationFee}</Text>
                      </View>
                    </View>

                    <View style={styles.detailRow}>
                      <Ionicons name="location-outline" size={20} color={theme.colors.primary[500]} />
                      <View style={styles.detailTextContainer}>
                        <Text style={styles.detailLabel}>Distance</Text>
                        <Text style={styles.detailValue}>{selectedDoctor.distance} miles away</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.availabilitySection}>
                    <View style={styles.availabilityContainer}>
                      <View style={[
                        styles.availabilityDot,
                        { backgroundColor: selectedDoctor.available ? theme.colors.success[500] : theme.colors.error[500] }
                      ]} />
                      <Text style={styles.availabilityText}>
                        {selectedDoctor.available ? `Available ${selectedDoctor.nextAvailable}` : 'Not Available'}
                      </Text>
                    </View>
                  </View>
                </ScrollView>

                <View style={styles.bottomSheetFooter}>
                  <TouchableOpacity
                    style={[
                      styles.bookButtonLarge,
                      { backgroundColor: selectedDoctor.available ? theme.colors.primary[500] : theme.colors.neutral[300] }
                    ]}
                    onPress={() => handleBookAppointment(selectedDoctor)}
                    disabled={!selectedDoctor.available}
                  >
                    <Text style={[
                      styles.bookButtonTextLarge,
                      { color: selectedDoctor.available ? theme.colors.text.inverse : theme.colors.text.secondary }
                    ]}>
                      {selectedDoctor.available ? 'Book Appointment' : 'Not Available'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
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
  backButton: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  headerTitle: {
    ...theme.typography.textStyles.h3,
    color: theme.colors.text.primary,
  },
  listButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.primary[500],
  },
  listButtonText: {
    ...theme.typography.textStyles.label,
    color: theme.colors.primary[500],
    marginLeft: theme.spacing.sm,
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  customMarker: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: theme.colors.primary[500],
    shadowColor: theme.colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: theme.spacing.lg,
  },
  doctorCard: {
    ...theme.components.card,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.lg,
  },
  doctorEmoji: {
    fontSize: 30,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  doctorSpecialty: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.primary[500],
    marginBottom: theme.spacing.sm,
  },
  doctorRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: theme.spacing.sm,
  },
  ratingText: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
  doctorAddress: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  distanceText: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.primary[500],
    marginLeft: theme.spacing.xs,
    fontWeight: '600',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.sm,
  },
  availabilityText: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.secondary,
  },
  doctorActions: {
    alignItems: 'flex-end',
  },
  consultationFee: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.primary[500],
    marginBottom: theme.spacing.sm,
  },
  bookButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: 8,
  },
  bookButtonText: {
    ...theme.typography.textStyles.label,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: theme.colors.background.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.8,
    minHeight: height * 0.4,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.neutral[300],
    borderRadius: 2,
    position: 'absolute',
    top: 8,
    left: '50%',
    marginLeft: -20,
  },
  bottomSheetTitle: {
    ...theme.typography.textStyles.h4,
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  doctorImageLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.lg,
  },
  doctorEmojiLarge: {
    fontSize: 40,
  },
  doctorHeaderInfo: {
    flex: 1,
  },
  doctorNameLarge: {
    ...theme.typography.textStyles.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  doctorSpecialtyLarge: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.primary[500],
    marginBottom: theme.spacing.sm,
  },
  doctorRatingLarge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingTextLarge: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.secondary,
    fontWeight: '600',
    marginLeft: theme.spacing.sm,
  },
  detailSection: {
    paddingVertical: theme.spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  detailTextContainer: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  detailLabel: {
    ...theme.typography.textStyles.label,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  detailValue: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.primary,
  },
  availabilitySection: {
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  bottomSheetFooter: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  bookButtonLarge: {
    ...theme.components.button.primary,
    paddingVertical: theme.spacing.lg,
  },
  bookButtonTextLarge: {
    ...theme.components.button.text,
    fontSize: theme.typography.textStyles.h5.fontSize,
  },
});
