import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ScrollView,
  Dimensions,
  Platform,
  Animated,
  PanResponder,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { RootStackParamList } from '../types/navigation';
import { theme } from '../theme';
import { useFamily, FamilyMember } from '../contexts/FamilyContext';
import FamilyMemberSelector from '../components/FamilyMemberSelector';

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
    address: '456 Neurology Center, San Francisco, CA',
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
    nextAvailable: 'Next Monday 9:00 AM',
    consultationFee: 120,
    latitude: 37.7649,
    longitude: -122.4294,
    address: '789 Children\'s Hospital, San Francisco, CA',
    phone: '+1 (555) 345-6789',
    distance: 1.5
  },
  {
    id: 4,
    name: 'Dr. James Wilson',
    specialty: 'Dermatologist',
    rating: 4.6,
    experience: '10 years',
    image: '👨‍⚕️',
    available: true,
    nextAvailable: 'Today 4:00 PM',
    consultationFee: 180,
    latitude: 37.7549,
    longitude: -122.4394,
    address: '321 Skin Care Clinic, San Francisco, CA',
    phone: '+1 (555) 456-7890',
    distance: 2.1
  },
  {
    id: 5,
    name: 'Dr. Lisa Park',
    specialty: 'Orthopedist',
    rating: 4.9,
    experience: '14 years',
    image: '👩‍⚕️',
    available: true,
    nextAvailable: 'Tomorrow 2:30 PM',
    consultationFee: 220,
    latitude: 37.7949,
    longitude: -122.3994,
    address: '654 Sports Medicine Center, San Francisco, CA',
    phone: '+1 (555) 567-8901',
    distance: 0.5
  }
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
  const { familyMembers, addFamilyMember } = useFamily();
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [mapRegion, setMapRegion] = useState<Region | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const mapRef = useRef<MapView>(null);
  const cardAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      const region: Region = {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      setMapRegion(region);
      setIsLoading(false);
    }
  }, [userLocation]);

  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required', 
          'Location permission is required to find nearby doctors. Please enable location access in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => Location.requestForegroundPermissionsAsync() }
          ]
        );
        setIsLoading(false);
        return;
      }

      setLocationPermission(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setUserLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Unable to get your current location. Please check your GPS settings.');
      setIsLoading(false);
    }
  };

  const refreshLocation = async () => {
    await getCurrentLocation();
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const updateDoctorDistances = () => {
    if (!userLocation) {
      // If no location, show "Location required" instead of hardcoded distances
      doctors.forEach(doctor => {
        doctor.distance = -1; // Use -1 to indicate no location
      });
      return;
    }

    doctors.forEach(doctor => {
      const distance = calculateDistance(
        userLocation.coords.latitude,
        userLocation.coords.longitude,
        doctor.latitude,
        doctor.longitude
      );
      doctor.distance = Math.round(distance * 10) / 10;
    });
  };

  useEffect(() => {
    updateDoctorDistances();
  }, [userLocation]);

  const handleDoctorPress = (doctor: Doctor) => {
    navigation.navigate('DoctorProfile', { doctorId: doctor.id.toString() });
  };

  const handleMarkerPress = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    // Animate the card in
    Animated.spring(cardAnimation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();

    // Center map on selected doctor
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: doctor.latitude,
        longitude: doctor.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  const closeDoctorCard = () => {
    Animated.timing(cardAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSelectedDoctor(null);
    });
  };

  const handleBookAppointment = (doctor: Doctor) => {
    if (!doctor.available) {
      Alert.alert('Not Available', 'This doctor is not available for booking at the moment.');
      return;
    }
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedMember) {
      Alert.alert('Select Patient', 'Please select a family member for the appointment.');
      return;
    }
    
    Alert.alert(
      'Appointment Booked!',
      `Appointment with ${selectedDoctor?.name} has been booked successfully for ${selectedMember.name}.\n\nPatient: ${selectedMember.name} (${selectedMember.relation})\nAge: ${selectedMember.age} years\nContact: ${selectedMember.contactNumber}\n\nYou will receive a confirmation call shortly.`,
      [
        { text: 'OK', onPress: () => {
          setShowBookingModal(false);
          setSelectedMember(null);
          navigation.navigate('Appointments');
        }}
      ]
    );
  };

  const handleAddNewMember = () => {
    navigation.navigate('Family' as any);
  };

  const fitToMarkers = () => {
    if (mapRef.current && userLocation) {
      const coordinates = [
        {
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
        },
        ...doctors.map(doctor => ({
          latitude: doctor.latitude,
          longitude: doctor.longitude,
        }))
      ];

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Nearby Doctors</Text>
          <Text style={styles.headerSubtitle}>Find doctors near your location</Text>
        </View>
        <TouchableOpacity 
          style={styles.locationButton}
          onPress={refreshLocation}
        >
          <Ionicons name="refresh" size={20} color={theme.colors.primary[500]} />
        </TouchableOpacity>
      </View>

      {/* Map View */}
      <View style={styles.mapContainer}>
        {isLoading ? (
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map" size={60} color={theme.colors.primary[500]} />
            <Text style={styles.mapPlaceholderTitle}>Loading Map...</Text>
            <Text style={styles.mapPlaceholderText}>
              Getting your location and nearby doctors...
            </Text>
          </View>
        ) : mapRegion ? (
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={mapRegion}
            showsUserLocation={true}
            showsMyLocationButton={false}
            showsCompass={true}
            showsScale={true}
            mapType="standard"
            onRegionChangeComplete={setMapRegion}
            loadingEnabled={true}
            loadingIndicatorColor={theme.colors.primary[500]}
            loadingBackgroundColor={theme.colors.background.primary}
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
                description={`${doctor.specialty} • ${doctor.distance === -1 ? 'Location required' : `${doctor.distance}km away`}`}
                onPress={() => handleMarkerPress(doctor)}
                pinColor={doctor.available ? "green" : "red"}
              />
            ))}
          </MapView>
        ) : (
          <View style={styles.mapPlaceholder}>
            <Ionicons name="location-outline" size={60} color={theme.colors.error[500]} />
            <Text style={styles.mapPlaceholderTitle}>Location Required</Text>
            <Text style={styles.mapPlaceholderText}>
              Please enable location access to see nearby doctors on the map
            </Text>
            <TouchableOpacity 
              style={styles.enableLocationButton}
              onPress={getCurrentLocation}
            >
              <Text style={styles.enableLocationButtonText}>Enable Location</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Map Controls */}
        {mapRegion && (
          <View style={styles.mapControls}>
            <TouchableOpacity 
              style={styles.mapControlButton}
              onPress={fitToMarkers}
            >
              <Ionicons name="locate" size={20} color={theme.colors.primary[500]} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.mapControlButton}
              onPress={refreshLocation}
            >
              <Ionicons name="refresh" size={20} color={theme.colors.primary[500]} />
            </TouchableOpacity>
          </View>
        )}
        
        {/* Map overlay with stats */}
        {mapRegion && (
        <View style={styles.mapOverlay}>
          <View style={styles.mapStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{doctors.length}</Text>
              <Text style={styles.statLabel}>Doctors Found</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {doctors.filter(d => d.available).length}
              </Text>
              <Text style={styles.statLabel}>Available Now</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {Math.round(doctors.reduce((acc, d) => acc + d.distance, 0) / doctors.length * 10) / 10}km
              </Text>
              <Text style={styles.statLabel}>Avg Distance</Text>
            </View>
          </View>
        </View>
        )}
      </View>

      {/* Doctor Cards List */}
      <ScrollView 
        style={styles.listContainer} 
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.listTitle}>Nearby Doctors ({doctors.length})</Text>
        
        {doctors.map((doctor) => (
          <TouchableOpacity
            key={doctor.id}
            style={[
              styles.doctorCard,
              selectedDoctor?.id === doctor.id && styles.selectedDoctorCard
            ]}
            onPress={() => handleDoctorPress(doctor)}
            activeOpacity={0.7}
          >
            <View style={styles.doctorImage}>
              <Text style={styles.doctorEmoji}>{doctor.image}</Text>
            </View>
            
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{doctor.name}</Text>
              <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
              <Text style={styles.doctorExperience}>{doctor.experience}</Text>
              
              <View style={styles.doctorRating}>
                <View style={styles.starsContainer}>
                  {renderStars(doctor.rating)}
                </View>
                <Text style={styles.ratingText}>{doctor.rating}</Text>
              </View>
              
              <View style={styles.distanceContainer}>
                <Ionicons name="location" size={14} color={theme.colors.primary[500]} />
                <Text style={styles.distanceText}>
                  {doctor.distance === -1 ? 'Location required' : `${doctor.distance} km away`}
                </Text>
              </View>
              
              <View style={styles.availabilityContainer}>
                <View style={[
                  styles.availabilityDot,
                  { backgroundColor: doctor.available ? theme.colors.success[500] : theme.colors.error[500] }
                ]} />
                <Text style={styles.availabilityText}>
                  {doctor.available ? 'Online' : 'Offline'}
                </Text>
              </View>
            </View>
            
            <View style={styles.doctorActions}>
              <View style={styles.priceContainer}>
                <Text style={styles.consultationFee}>${doctor.consultationFee}</Text>
                <Text style={styles.perVisitText}>per visit</Text>
              </View>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.viewProfileButton}
                  onPress={() => handleDoctorPress(doctor)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.viewProfileButtonText}>View Profile</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.bookButton,
                    { backgroundColor: doctor.available ? theme.colors.primary[500] : theme.colors.neutral[300] }
                  ]}
                  onPress={() => handleBookAppointment(doctor)}
                  disabled={!doctor.available}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.bookButtonText,
                    { color: doctor.available ? theme.colors.text.inverse : theme.colors.text.secondary }
                  ]}>
                    {doctor.available ? 'Book Now' : 'Unavailable'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Doctor Detail Card - Animated Bottom Sheet */}
      {selectedDoctor && (
        <Animated.View 
          style={[
            styles.doctorDetailCard,
            {
              transform: [{
                translateY: cardAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 0],
                })
              }]
            }
          ]}
        >
          <View style={styles.doctorDetailHeader}>
            <View style={styles.doctorDetailInfo}>
              <View style={styles.doctorDetailImage}>
                <Text style={styles.doctorDetailEmoji}>{selectedDoctor.image}</Text>
              </View>
              <View style={styles.doctorDetailText}>
                <Text style={styles.doctorDetailName}>{selectedDoctor.name}</Text>
                <Text style={styles.doctorDetailSpecialty}>{selectedDoctor.specialty}</Text>
                <View style={styles.doctorDetailRating}>
                  <View style={styles.starsContainer}>
                    {renderStars(selectedDoctor.rating)}
                  </View>
                  <Text style={styles.ratingText}>{selectedDoctor.rating}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={closeDoctorCard}
            >
              <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.doctorDetailContent}>
            <View style={styles.doctorDetailRow}>
              <Ionicons name="location" size={16} color={theme.colors.primary[500]} />
              <Text style={styles.doctorDetailText}>
                {selectedDoctor.distance === -1 ? 'Location required' : `${selectedDoctor.distance} km away`}
              </Text>
            </View>
            
            <View style={styles.doctorDetailRow}>
              <Ionicons name="time" size={16} color={theme.colors.primary[500]} />
              <Text style={styles.doctorDetailText}>
                {selectedDoctor.available ? 'Available now' : `Next available: ${selectedDoctor.nextAvailable}`}
              </Text>
            </View>
            
            <View style={styles.doctorDetailRow}>
              <Ionicons name="call" size={16} color={theme.colors.primary[500]} />
              <Text style={styles.doctorDetailText}>{selectedDoctor.phone}</Text>
            </View>
            
            <View style={styles.doctorDetailRow}>
              <Ionicons name="business" size={16} color={theme.colors.primary[500]} />
              <Text style={styles.doctorDetailText}>{selectedDoctor.address}</Text>
            </View>
          </View>

          <View style={styles.doctorDetailActions}>
            <TouchableOpacity
              style={styles.viewProfileDetailButton}
              onPress={() => {
                closeDoctorCard();
                handleDoctorPress(selectedDoctor);
              }}
            >
              <Text style={styles.viewProfileDetailButtonText}>View Full Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.bookDetailButton,
                { backgroundColor: selectedDoctor.available ? theme.colors.primary[500] : theme.colors.neutral[300] }
              ]}
              onPress={() => handleBookAppointment(selectedDoctor)}
              disabled={!selectedDoctor.available}
            >
              <Text style={[
                styles.bookDetailButtonText,
                { color: selectedDoctor.available ? theme.colors.text.inverse : theme.colors.text.secondary }
              ]}>
                {selectedDoctor.available ? 'Book Appointment' : 'Not Available'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

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
              <Text style={styles.bookingModalTitle}>Book Appointment</Text>
              <TouchableOpacity
                style={styles.bookingCloseButton}
                onPress={() => setShowBookingModal(false)}
              >
                <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            </View>

            {selectedDoctor && (
              <View style={styles.doctorInfoCard}>
                <Text style={styles.doctorInfoName}>{selectedDoctor.name}</Text>
                <Text style={styles.doctorInfoSpecialty}>{selectedDoctor.specialty}</Text>
                <Text style={styles.doctorInfoFee}>Consultation Fee: ${selectedDoctor.consultationFee}</Text>
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
                <Text style={styles.bookingConfirmButtonText}>Confirm Booking</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    ...theme.typography.textStyles.h3,
    color: theme.colors.text.primary,
    fontWeight: '700',
  },
  headerSubtitle: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  locationButton: {
    padding: theme.spacing.sm,
  },
  mapContainer: {
    height: height * 0.45,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.tertiary,
    paddingHorizontal: theme.spacing.lg,
  },
  mapPlaceholderTitle: {
    ...theme.typography.textStyles.h4,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  mapPlaceholderText: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  enableLocationButton: {
    backgroundColor: theme.colors.primary[500],
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 8,
  },
  enableLocationButtonText: {
    ...theme.typography.textStyles.label,
    color: theme.colors.text.inverse,
    fontWeight: '600',
  },
  mapControls: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    flexDirection: 'column',
    gap: theme.spacing.sm,
  },
  mapControlButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.primary,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapOverlay: {
    position: 'absolute',
    top: theme.spacing.md,
    left: theme.spacing.md,
    right: theme.spacing.md,
  },
  mapStats: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.primary,
    borderRadius: 12,
    padding: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...theme.typography.textStyles.h4,
    color: theme.colors.primary[500],
    fontWeight: '700',
  },
  statLabel: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  listContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  listContent: {
    padding: theme.spacing.lg,
    paddingBottom: 320, // Add space for doctor card
  },
  listTitle: {
    ...theme.typography.textStyles.h4,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    fontWeight: '600',
  },
  doctorCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: 16,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedDoctorCard: {
    borderColor: theme.colors.primary[500],
    backgroundColor: theme.colors.primary[50],
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  doctorEmoji: {
    fontSize: 30,
  },
  doctorInfo: {
    flex: 1,
    marginBottom: theme.spacing.md,
  },
  doctorName: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
  },
  doctorSpecialty: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.primary[500],
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },
  doctorExperience: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  doctorRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
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
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  distanceText: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
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
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  doctorActions: {
    alignItems: 'center',
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  consultationFee: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.primary[500],
    fontWeight: '700',
  },
  perVisitText: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.secondary,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    width: '100%',
  },
  viewProfileButton: {
    flex: 1,
    backgroundColor: theme.colors.background.tertiary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary[500],
  },
  viewProfileButtonText: {
    ...theme.typography.textStyles.label,
    color: theme.colors.primary[500],
    fontWeight: '600',
    textAlign: 'center',
  },
  bookButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 8,
  },
  bookButtonText: {
    ...theme.typography.textStyles.label,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Doctor Detail Card Styles
  doctorDetailCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    maxHeight: height * 0.6,
  },
  doctorDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  doctorDetailInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  doctorDetailImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  doctorDetailEmoji: {
    fontSize: 24,
  },
  doctorDetailText: {
    flex: 1,
  },
  doctorDetailName: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.primary,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  doctorDetailSpecialty: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.primary[500],
    fontWeight: '500',
    marginBottom: theme.spacing.xs,
  },
  doctorDetailRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  doctorDetailContent: {
    marginBottom: theme.spacing.lg,
  },
  doctorDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  doctorDetailActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  viewProfileDetailButton: {
    flex: 1,
    backgroundColor: theme.colors.background.tertiary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary[500],
  },
  viewProfileDetailButtonText: {
    ...theme.typography.textStyles.label,
    color: theme.colors.primary[500],
    fontWeight: '600',
    textAlign: 'center',
  },
  bookDetailButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 8,
  },
  bookDetailButtonText: {
    ...theme.typography.textStyles.label,
    fontWeight: '600',
    textAlign: 'center',
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
  doctorInfoCard: {
    backgroundColor: theme.colors.primary[50],
    margin: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary[500],
  },
  doctorInfoName: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.primary,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  doctorInfoSpecialty: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.primary[500],
    fontWeight: '500',
    marginBottom: theme.spacing.xs,
  },
  doctorInfoFee: {
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