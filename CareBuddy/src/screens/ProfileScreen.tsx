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

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

// Sample user data
const userData = {
  name: 'John Doe',
  email: 'john.doe@email.com',
  phone: '+1 (555) 123-4567',
  dateOfBirth: '15/03/1985',
  gender: 'Male',
  bloodType: 'O+',
  emergencyContact: 'Jane Doe - +1 (555) 987-6543',
  address: '123 Health Street, Medical City, MC 12345',
  profileImage: '👤',
};

const medicalInfo = [
  { label: 'Blood Type', value: 'O+', icon: 'water' },
  { label: 'Allergies', value: 'Penicillin, Shellfish', icon: 'warning' },
  { label: 'Medications', value: 'Metformin, Lisinopril', icon: 'medical' },
  { label: 'Chronic Conditions', value: 'Diabetes, Hypertension', icon: 'heart' },
  { label: 'Emergency Contact', value: 'Jane Doe - +1 (555) 987-6543', icon: 'call' },
];

const recentActivity = [
  { id: 1, type: 'Appointment', title: 'Cardiology Consultation', date: 'Dec 10, 2024', status: 'Completed' },
  { id: 2, type: 'Lab Test', title: 'Blood Test - CBC', date: 'Dec 8, 2024', status: 'Results Available' },
  { id: 3, type: 'Prescription', title: 'Metformin Refill', date: 'Dec 5, 2024', status: 'Ready for Pickup' },
  { id: 4, type: 'Telemedicine', title: 'General Consultation', date: 'Dec 3, 2024', status: 'Completed' },
];

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [isEditing, setIsEditing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedData, setEditedData] = useState(userData);

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleSaveProfile = () => {
    Alert.alert('Success', 'Profile updated successfully!');
    setShowEditModal(false);
    setIsEditing(false);
  };

  const handleChangePhoto = () => {
    Alert.alert(
      'Change Profile Photo',
      'Choose how you want to update your profile photo',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Take Photo', 
          onPress: () => {
            // In a real app, you would use expo-image-picker here
            Alert.alert('Success', 'Photo taken successfully! Profile updated.');
          }
        },
        { 
          text: 'Choose from Gallery', 
          onPress: () => {
            // In a real app, you would use expo-image-picker here
            Alert.alert('Success', 'Photo selected successfully! Profile updated.');
          }
        }
      ]
    );
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'Appointment': return 'calendar';
      case 'Lab Test': return 'flask';
      case 'Prescription': return 'medical';
      case 'Telemedicine': return 'videocam';
      default: return 'document';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'Appointment': return theme.colors.primary[500];
      case 'Lab Test': return theme.colors.warning[500];
      case 'Prescription': return theme.colors.secondary[500];
      case 'Telemedicine': return theme.colors.info[500];
      default: return theme.colors.neutral[500];
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return theme.colors.success[500];
      case 'Results Available': return theme.colors.info[500];
      case 'Ready for Pickup': return theme.colors.warning[500];
      default: return theme.colors.neutral[500];
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Ionicons name="create" size={20} color={theme.colors.primary[500]} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileEmoji}>{userData.profileImage}</Text>
            </View>
            <TouchableOpacity style={styles.changePhotoButton} onPress={handleChangePhoto}>
              <Ionicons name="camera" size={16} color={theme.colors.text.inverse} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
          <Text style={styles.userPhone}>{userData.phone}</Text>
        </View>

        {/* Medical Information */}
        <View style={styles.medicalSection}>
          <Text style={styles.sectionTitle}>Medical Information</Text>
          <View style={styles.medicalCard}>
            {medicalInfo.map((info, index) => (
              <View key={index} style={styles.medicalItem}>
                <View style={styles.medicalItemLeft}>
                  <View style={styles.medicalIcon}>
                    <Ionicons name={info.icon as any} size={20} color={theme.colors.primary[500]} />
                  </View>
                  <Text style={styles.medicalLabel}>{info.label}</Text>
                </View>
                <Text style={styles.medicalValue}>{info.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={styles.activityLeft}>
                <View style={[
                  styles.activityIcon,
                  { backgroundColor: getActivityColor(activity.type) + '20' }
                ]}>
                  <Ionicons 
                    name={getActivityIcon(activity.type) as any} 
                    size={20} 
                    color={getActivityColor(activity.type)} 
                  />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDate}>{activity.date}</Text>
                </View>
              </View>
              <View style={styles.activityRight}>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(activity.status) }
                ]}>
                  <Text style={styles.statusText}>{activity.status}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('MedicalHistory')}
              activeOpacity={0.7}
            >
              <Ionicons name="document" size={24} color={theme.colors.primary[500]} />
              <Text style={styles.actionText}>Medical Records</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('Appointments')}
              activeOpacity={0.7}
            >
              <Ionicons name="calendar" size={24} color={theme.colors.secondary[500]} />
              <Text style={styles.actionText}>Appointments</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('LabTest')}
              activeOpacity={0.7}
            >
              <Ionicons name="flask" size={24} color={theme.colors.warning[500]} />
              <Text style={styles.actionText}>Lab Results</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('Pharmacy')}
              activeOpacity={0.7}
            >
              <Ionicons name="medical" size={24} color={theme.colors.error[500]} />
              <Text style={styles.actionText}>Prescriptions</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            
            <ScrollView style={styles.editForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={editedData.name}
                  onChangeText={(text) => setEditedData({...editedData, name: text})}
                  placeholder="Enter full name"
                  placeholderTextColor={theme.colors.text.secondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={editedData.email}
                  onChangeText={(text) => setEditedData({...editedData, email: text})}
                  placeholder="Enter email"
                  keyboardType="email-address"
                  placeholderTextColor={theme.colors.text.secondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={editedData.phone}
                  onChangeText={(text) => setEditedData({...editedData, phone: text})}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                  placeholderTextColor={theme.colors.text.secondary}
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: theme.spacing.sm }]}>
                  <Text style={styles.inputLabel}>Date of Birth</Text>
                  <TextInput
                    style={styles.input}
                    value={editedData.dateOfBirth}
                    onChangeText={(text) => setEditedData({...editedData, dateOfBirth: text})}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor={theme.colors.text.secondary}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: theme.spacing.sm }]}>
                  <Text style={styles.inputLabel}>Gender</Text>
                  <TextInput
                    style={styles.input}
                    value={editedData.gender}
                    onChangeText={(text) => setEditedData({...editedData, gender: text})}
                    placeholder="Male/Female"
                    placeholderTextColor={theme.colors.text.secondary}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Blood Type</Text>
                <TextInput
                  style={styles.input}
                  value={editedData.bloodType}
                  onChangeText={(text) => setEditedData({...editedData, bloodType: text})}
                  placeholder="e.g., O+, A-, B+"
                  placeholderTextColor={theme.colors.text.secondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Address</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={editedData.address}
                  onChangeText={(text) => setEditedData({...editedData, address: text})}
                  placeholder="Enter address"
                  multiline
                  numberOfLines={3}
                  placeholderTextColor={theme.colors.text.secondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Emergency Contact</Text>
                <TextInput
                  style={styles.input}
                  value={editedData.emergencyContact}
                  onChangeText={(text) => setEditedData({...editedData, emergencyContact: text})}
                  placeholder="Name - Phone Number"
                  placeholderTextColor={theme.colors.text.secondary}
                />
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  headerTitle: {
    ...theme.typography.textStyles.h2,
    color: theme.colors.text.primary,
  },
  editButton: {
    padding: theme.spacing.sm,
  },
  profileCard: {
    ...theme.components.card,
    alignItems: 'center',
    marginBottom: theme.spacing['3xl'],
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: theme.spacing.lg,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileEmoji: {
    fontSize: 50,
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary[500],
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    ...theme.typography.textStyles.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  userPhone: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.secondary,
  },
  medicalSection: {
    marginBottom: theme.spacing['3xl'],
  },
  sectionTitle: {
    ...theme.typography.textStyles.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  medicalCard: {
    ...theme.components.card,
  },
  medicalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  medicalItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  medicalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.lg,
  },
  medicalLabel: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  medicalValue: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.secondary,
    textAlign: 'right',
    flex: 1,
  },
  activitySection: {
    marginBottom: theme.spacing['3xl'],
  },
  activityCard: {
    ...theme.components.card,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.lg,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.primary,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  activityDate: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.secondary,
  },
  activityRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.inverse,
    fontWeight: '600',
  },
  actionsSection: {
    marginBottom: theme.spacing.xl,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    ...theme.components.card,
  },
  actionText: {
    ...theme.typography.textStyles.label,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
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
    maxHeight: '80%',
  },
  modalTitle: {
    ...theme.typography.textStyles.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  editForm: {
    maxHeight: 400,
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
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
  saveButton: {
    flex: 1,
    backgroundColor: theme.colors.primary[500],
    padding: theme.spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    ...theme.typography.textStyles.label,
    color: theme.colors.text.inverse,
    fontWeight: '600',
  },
});