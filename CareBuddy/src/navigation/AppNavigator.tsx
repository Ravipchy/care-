import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

import WelcomeScreen from '../screens/WelcomeScreen';
import DrawerNavigator from './DrawerNavigator';
import CartScreen from '../screens/CartScreen';
import NearbyDoctorsScreen from '../screens/NearbyDoctorsScreen';
import ReportsScreen from '../screens/ReportsScreen';
import MessagesScreen from '../screens/MessagesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import UploadPrescriptionScreen from '../screens/UploadPrescriptionScreen';
import BookAppointmentScreen from '../screens/BookAppointmentScreen';
import RescheduleAppointmentScreen from '../screens/RescheduleAppointmentScreen';

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
        component={DrawerNavigator}
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
        name="BookAppointment" 
        component={BookAppointmentScreen}
      />
      <Stack.Screen 
        name="RescheduleAppointment" 
        component={RescheduleAppointmentScreen}
      />
    </Stack.Navigator>
  );
}
