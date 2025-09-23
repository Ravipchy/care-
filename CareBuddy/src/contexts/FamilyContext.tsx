import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  contactNumber: string;
  email?: string;
  dateOfBirth: string;
  medicalHistory?: string;
  allergies?: string;
  emergencyContact?: string;
  createdAt: string;
  updatedAt: string;
}

interface FamilyContextType {
  familyMembers: FamilyMember[];
  addFamilyMember: (member: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFamilyMember: (id: string, member: Partial<FamilyMember>) => void;
  deleteFamilyMember: (id: string) => void;
  getFamilyMember: (id: string) => FamilyMember | undefined;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
};

interface FamilyProviderProps {
  children: ReactNode;
}

export const FamilyProvider: React.FC<FamilyProviderProps> = ({ children }) => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    // Sample data
    {
      id: '1',
      name: 'John Smith',
      relation: 'Self',
      age: 35,
      gender: 'Male',
      contactNumber: '+1 (555) 123-4567',
      email: 'john.smith@email.com',
      dateOfBirth: '1989-03-15',
      medicalHistory: 'No significant medical history',
      allergies: 'None',
      emergencyContact: '+1 (555) 987-6543',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Sarah Smith',
      relation: 'Spouse',
      age: 32,
      gender: 'Female',
      contactNumber: '+1 (555) 234-5678',
      email: 'sarah.smith@email.com',
      dateOfBirth: '1992-07-22',
      medicalHistory: 'Diabetes Type 2',
      allergies: 'Penicillin',
      emergencyContact: '+1 (555) 123-4567',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const addFamilyMember = (memberData: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newMember: FamilyMember = {
      ...memberData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setFamilyMembers(prev => [...prev, newMember]);
  };

  const updateFamilyMember = (id: string, memberData: Partial<FamilyMember>) => {
    setFamilyMembers(prev =>
      prev.map(member =>
        member.id === id
          ? { ...member, ...memberData, updatedAt: new Date().toISOString() }
          : member
      )
    );
  };

  const deleteFamilyMember = (id: string) => {
    setFamilyMembers(prev => prev.filter(member => member.id !== id));
  };

  const getFamilyMember = (id: string) => {
    return familyMembers.find(member => member.id === id);
  };

  const value: FamilyContextType = {
    familyMembers,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    getFamilyMember,
  };

  return (
    <FamilyContext.Provider value={value}>
      {children}
    </FamilyContext.Provider>
  );
};
