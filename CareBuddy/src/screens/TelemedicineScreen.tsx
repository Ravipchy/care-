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

// Sample doctors available for telemedicine
const availableDoctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'General Medicine',
    rating: 4.8,
    experience: '15 years',
    image: '👩‍⚕️',
    available: true,
    nextAvailable: 'Now',
    consultationFee: 150,
    languages: ['English', 'Spanish'],
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'Cardiologist',
    rating: 4.9,
    experience: '12 years',
    image: '👨‍⚕️',
    available: true,
    nextAvailable: 'In 10 mins',
    consultationFee: 200,
    languages: ['English', 'Mandarin'],
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrician',
    rating: 4.7,
    experience: '8 years',
    image: '👩‍⚕️',
    available: false,
    nextAvailable: 'Tomorrow 2 PM',
    consultationFee: 120,
    languages: ['English', 'Spanish'],
  },
  {
    id: 4,
    name: 'Dr. David Wilson',
    specialty: 'Psychiatrist',
    rating: 4.6,
    experience: '20 years',
    image: '👨‍⚕️',
    available: true,
    nextAvailable: 'Now',
    consultationFee: 180,
    languages: ['English'],
  },
];

const chatMessages = [
  { id: 1, sender: 'patient', message: 'Hello Doctor, I have been experiencing chest pain for the past 2 days.', time: '10:30 AM' },
  { id: 2, sender: 'doctor', message: 'Hello! I understand your concern. Can you describe the type of pain and when it occurs?', time: '10:31 AM' },
  { id: 3, sender: 'patient', message: 'It\'s a sharp pain that comes and goes, mostly when I take deep breaths.', time: '10:32 AM' },
  { id: 4, sender: 'doctor', message: 'Thank you for the details. Have you had any recent physical activity or stress?', time: '10:33 AM' },
];

export default function TelemedicineScreen() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isChatMode, setIsChatMode] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [symptoms, setSymptoms] = useState('');

  const handleBookConsultation = (doctor: any) => {
    if (!doctor.available) {
      Alert.alert('Not Available', 'This doctor is not available for consultation at the moment.');
      return;
    }
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const handleStartConsultation = (type: 'video' | 'chat') => {
    if (type === 'video') {
      setIsVideoCall(true);
      setIsChatMode(false);
    } else {
      setIsChatMode(true);
      setIsVideoCall(false);
    }
    setShowBookingModal(false);
  };

  const handleEndCall = () => {
    setIsVideoCall(false);
    setIsChatMode(false);
    setSelectedDoctor(null);
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // In a real app, this would send the message to the doctor
      setChatMessage('');
    }
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

  // Video Call Interface
  if (isVideoCall) {
    return (
      <SafeAreaView style={styles.videoCallContainer}>
        <View style={styles.videoCallHeader}>
          <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
            <Ionicons name="call" size={24} color={theme.colors.text.inverse} />
          </TouchableOpacity>
          <View style={styles.callInfo}>
            <Text style={styles.callTitle}>Video Call with {selectedDoctor?.name}</Text>
            <Text style={styles.callSubtitle}>{selectedDoctor?.specialty}</Text>
          </View>
          <View style={styles.callActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="mic" size={20} color={theme.colors.text.inverse} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="videocam" size={20} color={theme.colors.text.inverse} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.videoContainer}>
          <View style={styles.doctorVideo}>
            <Text style={styles.videoPlaceholder}>Doctor's Video</Text>
          </View>
          <View style={styles.patientVideo}>
            <Text style={styles.videoPlaceholder}>Your Video</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Chat Interface
  if (isChatMode) {
    return (
      <SafeAreaView style={styles.chatContainer}>
        <View style={styles.chatHeader}>
          <TouchableOpacity style={styles.backButton} onPress={handleEndCall}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.chatDoctorInfo}>
            <Text style={styles.chatDoctorName}>{selectedDoctor?.name}</Text>
            <Text style={styles.chatDoctorSpecialty}>{selectedDoctor?.specialty}</Text>
          </View>
          <TouchableOpacity style={styles.videoCallButton}>
            <Ionicons name="videocam" size={20} color={theme.colors.primary[500]} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.chatMessages}>
          {chatMessages.map((message) => (
            <View key={message.id} style={[
              styles.messageContainer,
              message.sender === 'patient' ? styles.patientMessage : styles.doctorMessage
            ]}>
              <Text style={[
                styles.messageText,
                message.sender === 'patient' ? styles.patientMessageText : styles.doctorMessageText
              ]}>
                {message.message}
              </Text>
              <Text style={styles.messageTime}>{message.time}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.chatInput}>
          <TextInput
            style={styles.messageInput}
            value={chatMessage}
            onChangeText={setChatMessage}
            placeholder="Type your message..."
            placeholderTextColor={theme.colors.text.secondary}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Ionicons name="send" size={20} color={theme.colors.text.inverse} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Main Telemedicine Interface
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Telemedicine</Text>
          <Text style={styles.headerSubtitle}>Consult with doctors online via video or chat</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="videocam" size={24} color={theme.colors.primary[500]} />
            <Text style={styles.quickActionText}>Video Consultation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="chatbubbles" size={24} color={theme.colors.secondary[500]} />
            <Text style={styles.quickActionText}>Chat with Doctor</Text>
          </TouchableOpacity>
        </View>

        {/* Available Doctors */}
        <View style={styles.doctorsSection}>
          <Text style={styles.sectionTitle}>Available Doctors</Text>
          {availableDoctors.map((doctor) => (
            <View key={doctor.id} style={styles.doctorCard}>
              <View style={styles.doctorHeader}>
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
                  <View style={styles.languagesContainer}>
                    {doctor.languages.map((lang, index) => (
                      <View key={index} style={styles.languageTag}>
                        <Text style={styles.languageText}>{lang}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.doctorActions}>
                  <View style={styles.availabilityContainer}>
                    <View style={[
                      styles.availabilityDot,
                      { backgroundColor: doctor.available ? theme.colors.success : theme.colors.error }
                    ]} />
                    <Text style={styles.availabilityText}>
                      {doctor.available ? `Available ${doctor.nextAvailable}` : 'Not Available'}
                    </Text>
                  </View>
                  <Text style={styles.consultationFee}>${doctor.consultationFee}</Text>
                  <TouchableOpacity
                    style={[
                      styles.bookButton,
                      { backgroundColor: doctor.available ? theme.colors.primary[500] : theme.colors.neutral[300] }
                    ]}
                    onPress={() => handleBookConsultation(doctor)}
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
            </View>
          ))}
        </View>
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
            <Text style={styles.modalTitle}>Book Consultation</Text>
            <Text style={styles.modalDescription}>
              Choose consultation type with {selectedDoctor?.name}
            </Text>
            
            <View style={styles.consultationOptions}>
              <TouchableOpacity 
                style={styles.consultationOption}
                onPress={() => handleStartConsultation('video')}
              >
                <Ionicons name="videocam" size={30} color={theme.colors.primary[500]} />
                <Text style={styles.consultationOptionText}>Video Call</Text>
                <Text style={styles.consultationOptionSubtext}>Face-to-face consultation</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.consultationOption}
                onPress={() => handleStartConsultation('chat')}
              >
                <Ionicons name="chatbubbles" size={30} color={theme.colors.secondary[500]} />
                <Text style={styles.consultationOptionText}>Chat</Text>
                <Text style={styles.consultationOptionSubtext}>Text-based consultation</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowBookingModal(false)}
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
  quickActions: {
    flexDirection: 'row',
    marginBottom: theme.spacing['3xl'],
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.xs,
    borderRadius: 12,
    ...theme.components.card,
  },
  quickActionText: {
    ...theme.typography.textStyles.label,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  doctorsSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.textStyles.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  doctorCard: {
    ...theme.components.card,
    marginBottom: theme.spacing.lg,
  },
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  languageTag: {
    backgroundColor: theme.colors.primary[100],
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: 8,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  languageText: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.primary[700],
    fontWeight: '600',
  },
  doctorActions: {
    alignItems: 'flex-end',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
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
  // Video Call Styles
  videoCallContainer: {
    flex: 1,
    backgroundColor: theme.colors.neutral[900],
  },
  videoCallHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.neutral[800],
  },
  endCallButton: {
    backgroundColor: theme.colors.error,
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callInfo: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: theme.spacing.lg,
  },
  callTitle: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.inverse,
  },
  callSubtitle: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.text.inverse,
    opacity: 0.8,
  },
  callActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  actionButton: {
    backgroundColor: theme.colors.neutral[600],
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  doctorVideo: {
    flex: 1,
    backgroundColor: theme.colors.neutral[700],
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientVideo: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 120,
    height: 160,
    backgroundColor: theme.colors.neutral[600],
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlaceholder: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.inverse,
    opacity: 0.7,
  },
  // Chat Styles
  chatContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  backButton: {
    marginRight: theme.spacing.lg,
  },
  chatDoctorInfo: {
    flex: 1,
  },
  chatDoctorName: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.primary,
  },
  chatDoctorSpecialty: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.text.secondary,
  },
  videoCallButton: {
    padding: theme.spacing.sm,
  },
  chatMessages: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  messageContainer: {
    marginBottom: theme.spacing.lg,
  },
  patientMessage: {
    alignItems: 'flex-end',
  },
  doctorMessage: {
    alignItems: 'flex-start',
  },
  messageText: {
    ...theme.typography.textStyles.body1,
    padding: theme.spacing.md,
    borderRadius: 12,
    maxWidth: '80%',
  },
  patientMessageText: {
    backgroundColor: theme.colors.primary[500],
    color: theme.colors.text.inverse,
  },
  doctorMessageText: {
    backgroundColor: theme.colors.background.primary,
    color: theme.colors.text.primary,
  },
  messageTime: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  chatInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  messageInput: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 20,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    marginRight: theme.spacing.md,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: theme.colors.primary[500],
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Modal Styles
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
  consultationOptions: {
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  consultationOption: {
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  consultationOptionText: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  consultationOptionSubtext: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.secondary,
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