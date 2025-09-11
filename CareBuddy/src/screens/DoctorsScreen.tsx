import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { theme } from '../theme';

// Sample doctor data
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
  },
];

type DoctorsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

export default function DoctorsScreen() {
  const navigation = useNavigation<DoctorsScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const specialties = ['All', 'Cardiologist', 'Neurologist', 'Pediatrician', 'Orthopedist', 'Dermatologist', 'Psychiatrist'];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleBookAppointment = (doctor: any) => {
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
      stars.push(<Ionicons key={i} name="star" size={16} color="#ffd700" />);
    }
    if (hasHalfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={16} color="#ffd700" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#ffd700" />);
    }
    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Find a Doctor</Text>
          <Text style={styles.headerSubtitle}>Book consultation with our expert doctors</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={theme.colors.text.secondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search doctors or specialties..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={theme.colors.text.secondary}
            />
          </View>
        </View>

        {/* Specialty Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Specialty</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {specialties.map((specialty) => (
              <TouchableOpacity
                key={specialty}
                style={[
                  styles.filterChip,
                  selectedSpecialty === specialty && styles.filterChipActive
                ]}
                onPress={() => setSelectedSpecialty(specialty)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedSpecialty === specialty && styles.filterChipTextActive
                ]}>
                  {specialty}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Doctors List */}
        <View style={styles.doctorsSection}>
          <Text style={styles.sectionTitle}>Available Doctors ({filteredDoctors.length})</Text>
          {filteredDoctors.map((doctor) => (
            <View key={doctor.id} style={styles.doctorCard}>
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
                <Text style={styles.doctorExperience}>{doctor.experience} experience</Text>
                <View style={styles.availabilityContainer}>
                  <View style={[
                    styles.availabilityDot,
                    { backgroundColor: doctor.available ? theme.colors.success : theme.colors.error }
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
            </View>
          ))}
        </View>

        {/* Nearby Doctors Section */}
        <View style={styles.nearbySection}>
          <View style={styles.nearbyHeader}>
            <Ionicons name="location" size={20} color={theme.colors.primary[500]} />
            <Text style={styles.nearbyTitle}>Nearby Doctors</Text>
          </View>
          <TouchableOpacity 
            style={styles.nearbyButton}
            onPress={() => navigation.navigate('NearbyDoctors')}
          >
            <Text style={styles.nearbyButtonText}>View on Map</Text>
            <Ionicons name="arrow-forward" size={16} color={theme.colors.primary[500]} />
          </TouchableOpacity>
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
  filterSection: {
    marginBottom: theme.spacing.xl,
  },
  filterTitle: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterChip: {
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: 20,
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary[500],
    borderColor: theme.colors.primary[500],
  },
  filterChipText: {
    ...theme.typography.textStyles.label,
    color: theme.colors.text.secondary,
  },
  filterChipTextActive: {
    color: theme.colors.text.inverse,
  },
  doctorsSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.textStyles.h4,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
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
  doctorExperience: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
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
  nearbySection: {
    ...theme.components.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nearbyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nearbyTitle: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  nearbyButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nearbyButtonText: {
    ...theme.typography.textStyles.label,
    color: theme.colors.primary[500],
    marginRight: theme.spacing.sm,
  },
});
