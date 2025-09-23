import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

import WelcomeScreen from '../screens/WelcomeScreen';
import TabNavigator from './TabNavigator';
import CartScreen from '../screens/CartScreen';
import NearbyDoctorsScreen from '../screens/NearbyDoctorsScreen';
import ReportsScreen from '../screens/ReportsScreen';
import MessagesScreen from '../screens/MessagesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import UploadPrescriptionScreen from '../screens/UploadPrescriptionScreen';
import RescheduleAppointmentScreen from '../screens/RescheduleAppointmentScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FamilyScreen from '../screens/FamilyScreen';
import MedicalHistoryScreen from '../screens/MedicalHistoryScreen';
import LabTestScreen from '../screens/LabTestScreen';
import AmbulanceScreen from '../screens/AmbulanceScreen';
import HomeCareScreen from '../screens/HomeCareScreen';
import AboutUsScreen from '../screens/AboutUsScreen';
import TelemedicineScreen from '../screens/TelemedicineScreen';
import PharmacyScreen from '../screens/PharmacyScreen';
import DoctorProfileScreen from '../screens/DoctorProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="Welcome" 
        component={WelcomeScreen}
      />
      <Stack.Screen 
        name="Main" 
        component={TabNavigator}
      />
      <Stack.Screen 
        name="Cart" 
        component={CartScreen}
      />
      <Stack.Screen 
        name="NearbyDoctors" 
        component={NearbyDoctorsScreen}
      />
      <Stack.Screen 
        name="Reports" 
        component={ReportsScreen}
      />
      <Stack.Screen 
        name="Messages" 
        component={MessagesScreen}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
      />
      <Stack.Screen 
        name="UploadPrescription" 
        component={UploadPrescriptionScreen}
      />
      <Stack.Screen 
        name="RescheduleAppointment" 
        component={RescheduleAppointmentScreen}
      />
      <Stack.Screen 
        name="Appointments" 
        component={AppointmentsScreen}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
      />
      <Stack.Screen 
        name="Family" 
        component={FamilyScreen}
      />
      <Stack.Screen 
        name="MedicalHistory" 
        component={MedicalHistoryScreen}
      />
      <Stack.Screen 
        name="LabTest" 
        component={LabTestScreen}
      />
      <Stack.Screen 
        name="Ambulance" 
        component={AmbulanceScreen}
      />
      <Stack.Screen 
        name="HomeCare" 
        component={HomeCareScreen}
      />
      <Stack.Screen 
        name="AboutUs" 
        component={AboutUsScreen}
      />
      <Stack.Screen 
        name="Telemedicine" 
        component={TelemedicineScreen}
      />
      <Stack.Screen 
        name="Pharmacy" 
        component={PharmacyScreen}
      />
      <Stack.Screen 
        name="DoctorProfile" 
        component={DoctorProfileScreen}
      />
    </Stack.Navigator>
  );
}
