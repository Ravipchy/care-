import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { useFamily, FamilyMember } from '../contexts/FamilyContext';
import { theme } from '../theme';

type FamilyScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Family'>;

const relations = ['Self', 'Spouse', 'Child', 'Parent', 'Sibling', 'Grandparent', 'Other'];
const genders = ['Male', 'Female', 'Other'];

export default function FamilyScreen() {
  const navigation = useNavigation<FamilyScreenNavigationProp>();
  const { familyMembers, addFamilyMember, updateFamilyMember, deleteFamilyMember } = useFamily();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    relation: 'Self',
    age: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    contactNumber: '',
    email: '',
    dateOfBirth: '',
    medicalHistory: '',
    allergies: '',
    emergencyContact: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      relation: 'Self',
      age: '',
      gender: 'Male',
      contactNumber: '',
      email: '',
      dateOfBirth: '',
      medicalHistory: '',
      allergies: '',
      emergencyContact: '',
    });
    setEditingMember(null);
  };

  const handleAddMember = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEditMember = (member: FamilyMember) => {
    setFormData({
      name: member.name,
      relation: member.relation,
      age: member.age.toString(),
      gender: member.gender,
      contactNumber: member.contactNumber,
      email: member.email || '',
      dateOfBirth: member.dateOfBirth,
      medicalHistory: member.medicalHistory || '',
      allergies: member.allergies || '',
      emergencyContact: member.emergencyContact || '',
    });
    setEditingMember(member);
    setShowAddModal(true);
  };

  const handleSaveMember = () => {
    if (!formData.name.trim() || !formData.contactNumber.trim()) {
      Alert.alert('Validation Error', 'Name and contact number are required.');
      return;
    }

    if (isNaN(Number(formData.age)) || Number(formData.age) < 0 || Number(formData.age) > 150) {
      Alert.alert('Validation Error', 'Please enter a valid age (0-150).');
      return;
    }

    const memberData = {
      name: formData.name.trim(),
      relation: formData.relation,
      age: Number(formData.age),
      gender: formData.gender,
      contactNumber: formData.contactNumber.trim(),
      email: formData.email.trim() || undefined,
      dateOfBirth: formData.dateOfBirth || new Date().toISOString().split('T')[0],
      medicalHistory: formData.medicalHistory.trim() || undefined,
      allergies: formData.allergies.trim() || undefined,
      emergencyContact: formData.emergencyContact.trim() || undefined,
    };

    if (editingMember) {
      updateFamilyMember(editingMember.id, memberData);
      Alert.alert('Success', 'Family member updated successfully!');
    } else {
      addFamilyMember(memberData);
      Alert.alert('Success', 'Family member added successfully!');
    }

    setShowAddModal(false);
    resetForm();
  };

  const handleDeleteMember = (member: FamilyMember) => {
    Alert.alert(
      'Delete Family Member',
      `Are you sure you want to delete ${member.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteFamilyMember(member.id);
            Alert.alert('Success', 'Family member deleted successfully!');
          },
        },
      ]
    );
  };

  const renderFamilyMember = ({ item }: { item: FamilyMember }) => (
    <View style={styles.memberCard}>
      <View style={styles.memberHeader}>
        <View style={styles.memberAvatar}>
          <Ionicons 
            name={item.gender === 'Female' ? 'woman' : item.gender === 'Male' ? 'man' : 'person'} 
            size={24} 
            color={theme.colors.primary[500]} 
          />
        </View>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{item.name}</Text>
          <Text style={styles.memberRelation}>{item.relation}</Text>
          <Text style={styles.memberDetails}>
            {item.age} years • {item.gender}
          </Text>
          <Text style={styles.memberContact}>{item.contactNumber}</Text>
        </View>
        <View style={styles.memberActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditMember(item)}
          >
            <Ionicons name="pencil" size={20} color={theme.colors.primary[500]} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteMember(item)}
          >
            <Ionicons name="trash" size={20} color={theme.colors.error[500]} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

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
        <Text style={styles.headerTitle}>Family Members</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddMember}
        >
          <Ionicons name="add" size={24} color={theme.colors.primary[500]} />
        </TouchableOpacity>
      </View>

      {/* Family Members List */}
      <FlatList
        data={familyMembers}
        keyExtractor={(item) => item.id}
        renderItem={renderFamilyMember}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={80} color={theme.colors.neutral[300]} />
            <Text style={styles.emptyTitle}>No Family Members</Text>
            <Text style={styles.emptyDescription}>
              Add family members to easily book appointments for them
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={handleAddMember}>
              <Text style={styles.emptyButtonText}>Add First Member</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Add/Edit Member Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingMember ? 'Edit Family Member' : 'Add Family Member'}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowAddModal(false)}
              >
                <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder="Enter full name"
                  placeholderTextColor={theme.colors.text.secondary}
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: theme.spacing.sm }]}>
                  <Text style={styles.inputLabel}>Age *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.age}
                    onChangeText={(text) => setFormData({ ...formData, age: text })}
                    placeholder="Age"
                    keyboardType="numeric"
                    placeholderTextColor={theme.colors.text.secondary}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: theme.spacing.sm }]}>
                  <Text style={styles.inputLabel}>Gender</Text>
                  <View style={styles.genderContainer}>
                    {genders.map((gender) => (
                      <TouchableOpacity
                        key={gender}
                        style={[
                          styles.genderOption,
                          formData.gender === gender && styles.genderOptionSelected
                        ]}
                        onPress={() => setFormData({ ...formData, gender: gender as any })}
                      >
                        <Text style={[
                          styles.genderText,
                          formData.gender === gender && styles.genderTextSelected
                        ]}>
                          {gender}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Relation</Text>
                <View style={styles.relationContainer}>
                  {relations.map((relation) => (
                    <TouchableOpacity
                      key={relation}
                      style={[
                        styles.relationOption,
                        formData.relation === relation && styles.relationOptionSelected
                      ]}
                      onPress={() => setFormData({ ...formData, relation })}
                    >
                      <Text style={[
                        styles.relationText,
                        formData.relation === relation && styles.relationTextSelected
                      ]}>
                        {relation}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Contact Number *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.contactNumber}
                  onChangeText={(text) => setFormData({ ...formData, contactNumber: text })}
                  placeholder="Phone number"
                  keyboardType="phone-pad"
                  placeholderTextColor={theme.colors.text.secondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  placeholder="Email address"
                  keyboardType="email-address"
                  placeholderTextColor={theme.colors.text.secondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Date of Birth</Text>
                <TextInput
                  style={styles.input}
                  value={formData.dateOfBirth}
                  onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={theme.colors.text.secondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Medical History</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.medicalHistory}
                  onChangeText={(text) => setFormData({ ...formData, medicalHistory: text })}
                  placeholder="Any medical conditions or history"
                  multiline
                  numberOfLines={3}
                  placeholderTextColor={theme.colors.text.secondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Allergies</Text>
                <TextInput
                  style={styles.input}
                  value={formData.allergies}
                  onChangeText={(text) => setFormData({ ...formData, allergies: text })}
                  placeholder="Known allergies"
                  placeholderTextColor={theme.colors.text.secondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Emergency Contact</Text>
                <TextInput
                  style={styles.input}
                  value={formData.emergencyContact}
                  onChangeText={(text) => setFormData({ ...formData, emergencyContact: text })}
                  placeholder="Emergency contact number"
                  keyboardType="phone-pad"
                  placeholderTextColor={theme.colors.text.secondary}
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveMember}
              >
                <Text style={styles.saveButtonText}>
                  {editingMember ? 'Update' : 'Add Member'}
                </Text>
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
  headerTitle: {
    ...theme.typography.textStyles.h3,
    color: theme.colors.text.primary,
    fontWeight: '700',
  },
  addButton: {
    padding: theme.spacing.sm,
  },
  listContainer: {
    padding: theme.spacing.lg,
  },
  memberCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: 16,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    shadowColor: theme.colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.primary,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  memberRelation: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.primary[500],
    fontWeight: '500',
    marginBottom: theme.spacing.xs,
  },
  memberDetails: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  memberContact: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.secondary,
  },
  memberActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    padding: theme.spacing.sm,
    borderRadius: 8,
    backgroundColor: theme.colors.background.tertiary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing['6xl'],
  },
  emptyTitle: {
    ...theme.typography.textStyles.h4,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  emptyDescription: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  emptyButton: {
    backgroundColor: theme.colors.primary[500],
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderRadius: 8,
  },
  emptyButtonText: {
    ...theme.typography.textStyles.label,
    color: theme.colors.text.inverse,
    fontWeight: '600',
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
    width: '90%',
    maxHeight: '90%',
    shadowColor: theme.colors.shadow.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  modalTitle: {
    ...theme.typography.textStyles.h4,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  formContainer: {
    maxHeight: 400,
    padding: theme.spacing.lg,
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
    fontWeight: '600',
  },
  input: {
    ...theme.components.input,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    backgroundColor: theme.colors.background.primary,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  genderOption: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    alignItems: 'center',
  },
  genderOptionSelected: {
    backgroundColor: theme.colors.primary[500],
    borderColor: theme.colors.primary[500],
  },
  genderText: {
    ...theme.typography.textStyles.label,
    color: theme.colors.text.secondary,
  },
  genderTextSelected: {
    color: theme.colors.text.inverse,
  },
  relationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  relationOption: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    backgroundColor: theme.colors.background.secondary,
  },
  relationOptionSelected: {
    backgroundColor: theme.colors.primary[500],
    borderColor: theme.colors.primary[500],
  },
  relationText: {
    ...theme.typography.textStyles.label,
    color: theme.colors.text.secondary,
  },
  relationTextSelected: {
    color: theme.colors.text.inverse,
  },
  modalActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.colors.background.tertiary,
    paddingVertical: theme.spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...theme.typography.textStyles.h6,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: theme.colors.primary[500],
    paddingVertical: theme.spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    ...theme.typography.textStyles.h6,
    color: theme.colors.text.inverse,
    fontWeight: '600',
  },
});
