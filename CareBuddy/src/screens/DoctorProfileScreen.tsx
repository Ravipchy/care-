import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Alert,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { theme } from '../theme';

type DoctorProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DoctorProfile'>;
type DoctorProfileScreenRouteProp = RouteProp<RootStackParamList, 'DoctorProfile'>;

// Sample detailed doctor data
const doctorDetails = {
  '1': {
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
    address: '123 Medical Center Dr, San Francisco, CA 94102',
    phone: '+1 (555) 123-4567',
    email: 'sarah.johnson@medicalcenter.com',
    distance: 0.8,
    education: 'MD, Harvard Medical School',
    languages: ['English', 'Spanish'],
    specialties: ['Heart Disease', 'Hypertension', 'Arrhythmia'],
    workingHours: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 3:00 PM',
      saturday: 'Closed',
      sunday: 'Closed'
    },
    about: 'Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in treating heart conditions. She specializes in preventive cardiology and has helped thousands of patients maintain heart health.',
    reviews: [
      { id: 1, patient: 'John D.', rating: 5, comment: 'Excellent doctor, very thorough and caring.', date: '2 days ago' },
      { id: 2, patient: 'Maria S.', rating: 5, comment: 'Dr. Johnson explained everything clearly and made me feel comfortable.', date: '1 week ago' },
      { id: 3, patient: 'Robert K.', rating: 4, comment: 'Great experience, would definitely recommend.', date: '2 weeks ago' }
    ]
  },
  '2': {
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
    address: '456 Neurology Center, San Francisco, CA 94103',
    phone: '+1 (555) 234-5678',
    email: 'michael.chen@neurocenter.com',
    distance: 1.2,
    education: 'MD, Stanford Medical School',
    languages: ['English', 'Mandarin'],
    specialties: ['Epilepsy', 'Migraine', 'Parkinson\'s Disease'],
    workingHours: {
      monday: '8:00 AM - 6:00 PM',
      tuesday: '8:00 AM - 6:00 PM',
      wednesday: '8:00 AM - 6:00 PM',
      thursday: '8:00 AM - 6:00 PM',
      friday: '8:00 AM - 4:00 PM',
      saturday: '9:00 AM - 1:00 PM',
      sunday: 'Closed'
    },
    about: 'Dr. Michael Chen is a renowned neurologist specializing in epilepsy and movement disorders. He has published numerous research papers and is known for his innovative treatment approaches.',
    reviews: [
      { id: 1, patient: 'Lisa M.', rating: 5, comment: 'Dr. Chen is amazing! He helped me manage my migraines effectively.', date: '3 days ago' },
      { id: 2, patient: 'David L.', rating: 5, comment: 'Very knowledgeable and patient. Highly recommend!', date: '1 week ago' }
    ]
  }
};

export default function DoctorProfileScreen() {
  const navigation = useNavigation<DoctorProfileScreenNavigationProp>();
  const route = useRoute<DoctorProfileScreenRouteProp>();
  const { doctorId } = route.params;
  
  const doctor = doctorDetails[doctorId as keyof typeof doctorDetails];
  const [selectedTab, setSelectedTab] = useState('overview');

  if (!doctor) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Doctor not found</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleBookAppointment = () => {
    Alert.alert(
      'Book Appointment',
      `Book appointment with ${doctor.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Book Now', onPress: () => {
          Alert.alert(
            'Appointment Booked!',
            `Your appointment with ${doctor.name} has been booked successfully. You will receive a confirmation call shortly.`,
            [
              { text: 'OK', onPress: () => navigation.navigate('Appointments') }
            ]
          );
        }}
      ]
    );
  };

  const handleCall = () => {
    Alert.alert(
      'Call Doctor',
      `Call ${doctor.name} at ${doctor.phone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => {
          // In a real app, you would use Linking.openURL(`tel:${doctor.phone}`)
          Alert.alert('Calling', `Calling ${doctor.phone}...`);
        }}
      ]
    );
  };

  const handleDirections = () => {
    Alert.alert(
      'Get Directions',
      `Get directions to ${doctor.address}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Maps', onPress: () => {
          // In a real app, you would use Linking.openURL with Google Maps URL
          Alert.alert('Directions', 'Opening Google Maps...');
        }}
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

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'schedule', label: 'Schedule' }
  ];

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
        <Text style={styles.headerTitle}>Doctor Profile</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Doctor Info Card */}
        <View style={styles.doctorCard}>
          <View style={styles.doctorImageContainer}>
            <View style={styles.doctorImage}>
              <Text style={styles.doctorEmoji}>{doctor.image}</Text>
            </View>
            <View style={styles.availabilityBadge}>
              <View style={[
                styles.availabilityDot,
                { backgroundColor: doctor.available ? theme.colors.success[500] : theme.colors.error[500] }
              ]} />
              <Text style={styles.availabilityText}>
                {doctor.available ? 'Available' : 'Offline'}
              </Text>
            </View>
          </View>
          
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
            <Text style={styles.doctorEducation}>{doctor.education}</Text>
            
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {renderStars(doctor.rating)}
              </View>
              <Text style={styles.ratingText}>{doctor.rating}</Text>
              <Text style={styles.experienceText}>• {doctor.experience}</Text>
            </View>
            
            <View style={styles.distanceContainer}>
              <Ionicons name="location" size={16} color={theme.colors.text.secondary} />
              <Text style={styles.distanceText}>{doctor.distance} km away</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleBookAppointment}
            activeOpacity={0.7}
          >
            <Ionicons name="calendar" size={20} color={theme.colors.text.inverse} />
            <Text style={styles.primaryButtonText}>Book Appointment</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleCall}
            activeOpacity={0.7}
          >
            <Ionicons name="call" size={20} color={theme.colors.primary[500]} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleDirections}
            activeOpacity={0.7}
          >
            <Ionicons name="navigate" size={20} color={theme.colors.primary[500]} />
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                selectedTab === tab.id && styles.tabActive
              ]}
              onPress={() => setSelectedTab(tab.id)}
            >
              <Text style={[
                styles.tabText,
                selectedTab === tab.id && styles.tabTextActive
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.aboutText}>{doctor.about}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Specialties</Text>
              <View style={styles.specialtiesContainer}>
                {doctor.specialties.map((specialty, index) => (
                  <View key={index} style={styles.specialtyTag}>
                    <Text style={styles.specialtyText}>{specialty}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Languages</Text>
              <Text style={styles.languagesText}>{doctor.languages.join(', ')}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <View style={styles.contactItem}>
                <Ionicons name="call" size={20} color={theme.colors.primary[500]} />
                <Text style={styles.contactText}>{doctor.phone}</Text>
              </View>
              <View style={styles.contactItem}>
                <Ionicons name="mail" size={20} color={theme.colors.primary[500]} />
                <Text style={styles.contactText}>{doctor.email}</Text>
              </View>
              <View style={styles.contactItem}>
                <Ionicons name="location" size={20} color={theme.colors.primary[500]} />
                <Text style={styles.contactText}>{doctor.address}</Text>
              </View>
            </View>
          </View>
        )}

        {selectedTab === 'reviews' && (
          <View style={styles.tabContent}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Patient Reviews</Text>
              <View style={styles.overallRating}>
                <Text style={styles.overallRatingNumber}>{doctor.rating}</Text>
                <View style={styles.overallRatingStars}>
                  {renderStars(doctor.rating)}
                </View>
                <Text style={styles.overallRatingText}>Based on {doctor.reviews.length} reviews</Text>
              </View>
            </View>

            {doctor.reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewPatient}>{review.patient}</Text>
                  <View style={styles.reviewRating}>
                    {renderStars(review.rating)}
                  </View>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
            ))}
          </View>
        )}

        {selectedTab === 'schedule' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Working Hours</Text>
            <View style={styles.scheduleContainer}>
              {Object.entries(doctor.workingHours).map(([day, hours]) => (
                <View key={day} style={styles.scheduleItem}>
                  <Text style={styles.scheduleDay}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
                  <Text style={[
                    styles.scheduleHours,
                    hours === 'Closed' && styles.scheduleClosed
                  ]}>
                    {hours}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
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
  headerTitle: {
    ...theme.typography.textStyles.h3,
    color: theme.colors.text.primary,
  },
  shareButton: {
    padding: theme.spacing.sm,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorText: {
    ...theme.typography.textStyles.h4,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  backButtonText: {
    ...theme.typography.textStyles.label,
    color: theme.colors.primary[500],
  },
  doctorCard: {
    marginBottom: theme.spacing.lg,
    ...theme.components.card,
  },
  doctorImageContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  doctorImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  doctorEmoji: {
    fontSize: 48,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.tertiary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 20,
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
  doctorInfo: {
    alignItems: 'center',
  },
  doctorName: {
    ...theme.typography.textStyles.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  doctorSpecialty: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.primary[500],
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  doctorEducation: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: theme.spacing.sm,
  },
  ratingText: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.primary,
    fontWeight: '600',
    marginRight: theme.spacing.sm,
  },
  experienceText: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.text.secondary,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: theme.colors.primary[500],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
    borderRadius: 12,
  },
  primaryButtonText: {
    ...theme.typography.textStyles.label,
    color: theme.colors.text.inverse,
    fontWeight: '600',
    marginLeft: theme.spacing.sm,
  },
  secondaryButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.components.card,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 4,
    marginBottom: theme.spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: theme.colors.primary[500],
  },
  tabText: {
    ...theme.typography.textStyles.label,
    color: theme.colors.text.secondary,
  },
  tabTextActive: {
    color: theme.colors.text.inverse,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.textStyles.h4,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  aboutText: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  specialtyTag: {
    backgroundColor: theme.colors.primary[50],
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 20,
  },
  specialtyText: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.primary[700],
    fontWeight: '600',
  },
  languagesText: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.secondary,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  contactText: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
  },
  reviewsHeader: {
    marginBottom: theme.spacing.lg,
  },
  overallRating: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  overallRatingNumber: {
    ...theme.typography.textStyles.h2,
    color: theme.colors.text.primary,
    fontWeight: '700',
  },
  overallRatingStars: {
    flexDirection: 'row',
    marginVertical: theme.spacing.sm,
  },
  overallRatingText: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.text.secondary,
  },
  reviewCard: {
    marginBottom: theme.spacing.md,
    ...theme.components.card,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  reviewPatient: {
    ...theme.typography.textStyles.h6,
    color: theme.colors.text.primary,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewComment: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  reviewDate: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.tertiary,
  },
  scheduleContainer: {
    ...theme.components.card,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  scheduleDay: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  scheduleHours: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.secondary,
  },
  scheduleClosed: {
    color: theme.colors.text.tertiary,
  },
});
