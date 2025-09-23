import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFamily, FamilyMember } from '../contexts/FamilyContext';
import { theme } from '../theme';

interface FamilyMemberSelectorProps {
  selectedMember: FamilyMember | null;
  onSelectMember: (member: FamilyMember | null) => void;
  onAddNewMember: () => void;
  title?: string;
}

export default function FamilyMemberSelector({
  selectedMember,
  onSelectMember,
  onAddNewMember,
  title = 'Select Family Member',
}: FamilyMemberSelectorProps) {
  const { familyMembers } = useFamily();
  const [showModal, setShowModal] = useState(false);

  const handleSelectMember = (member: FamilyMember) => {
    onSelectMember(member);
    setShowModal(false);
  };

  const handleAddNewMember = () => {
    setShowModal(false);
    onAddNewMember();
  };

  const renderMemberItem = ({ item }: { item: FamilyMember }) => (
    <TouchableOpacity
      style={[
        styles.memberItem,
        selectedMember?.id === item.id && styles.selectedMemberItem
      ]}
      onPress={() => handleSelectMember(item)}
    >
      <View style={styles.memberAvatar}>
        <Ionicons 
          name={item.gender === 'Female' ? 'woman' : item.gender === 'Male' ? 'man' : 'person'} 
          size={20} 
          color={theme.colors.primary[500]} 
        />
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberDetails}>
          {item.relation} • {item.age} years • {item.gender}
        </Text>
        <Text style={styles.memberContact}>{item.contactNumber}</Text>
      </View>
      {selectedMember?.id === item.id && (
        <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary[500]} />
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setShowModal(true)}
      >
        <View style={styles.selectorContent}>
          <Ionicons name="people" size={20} color={theme.colors.primary[500]} />
          <View style={styles.selectorText}>
            <Text style={styles.selectorLabel}>Patient</Text>
            <Text style={styles.selectorValue}>
              {selectedMember ? selectedMember.name : 'Select family member'}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowModal(false)}
              >
                <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={familyMembers}
              keyExtractor={(item) => item.id}
              renderItem={renderMemberItem}
              contentContainerStyle={styles.membersList}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Ionicons name="people-outline" size={60} color={theme.colors.neutral[300]} />
                  <Text style={styles.emptyTitle}>No Family Members</Text>
                  <Text style={styles.emptyDescription}>
                    Add family members to easily book appointments for them
                  </Text>
                </View>
              }
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.addMemberButton}
                onPress={handleAddNewMember}
              >
                <Ionicons name="add" size={20} color={theme.colors.text.inverse} />
                <Text style={styles.addMemberButtonText}>Add New Member</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background.primary,
    borderRadius: 12,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    shadowColor: theme.colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectorText: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  selectorLabel: {
    ...theme.typography.textStyles.label,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  selectorValue: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    shadowColor: theme.colors.shadow.dark,
    shadowOffset: { width: 0, height: -2 },
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
  membersList: {
    padding: theme.spacing.lg,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedMemberItem: {
    backgroundColor: theme.colors.primary[50],
    borderColor: theme.colors.primary[500],
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    ...theme.typography.textStyles.h6,
    color: theme.colors.text.primary,
    fontWeight: '600',
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing['4xl'],
  },
  emptyTitle: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  emptyDescription: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  modalActions: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  addMemberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary[500],
    paddingVertical: theme.spacing.lg,
    borderRadius: 12,
  },
  addMemberButtonText: {
    ...theme.typography.textStyles.h6,
    color: theme.colors.text.inverse,
    fontWeight: '600',
    marginLeft: theme.spacing.sm,
  },
});
