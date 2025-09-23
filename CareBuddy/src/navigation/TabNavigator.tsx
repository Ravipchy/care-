import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList } from '../types/navigation';
import { theme } from '../theme';

import HomeScreen from '../screens/HomeScreen';
import NearbyDoctorsScreen from '../screens/NearbyDoctorsScreen';
import PharmacyScreen from '../screens/PharmacyScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import ReportsScreen from '../screens/ReportsScreen';
import MessagesScreen from '../screens/MessagesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MedicalHistoryScreen from '../screens/MedicalHistoryScreen';
import LabTestScreen from '../screens/LabTestScreen';
import AmbulanceScreen from '../screens/AmbulanceScreen';
import HomeCareScreen from '../screens/HomeCareScreen';
import AboutUsScreen from '../screens/AboutUsScreen';
import TelemedicineScreen from '../screens/TelemedicineScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Doctors') {
            iconName = focused ? 'location' : 'location-outline';
          } else if (route.name === 'Pharmacy') {
            iconName = focused ? 'storefront' : 'storefront-outline';
          } else if (route.name === 'Appointments') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Reports') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Messages') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'MedicalHistory') {
            iconName = focused ? 'medical' : 'medical-outline';
          } else if (route.name === 'LabTest') {
            iconName = focused ? 'flask' : 'flask-outline';
          } else if (route.name === 'Ambulance') {
            iconName = focused ? 'car' : 'car-outline';
          } else if (route.name === 'HomeCare') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'AboutUs') {
            iconName = focused ? 'information-circle' : 'information-circle-outline';
          } else if (route.name === 'Telemedicine') {
            iconName = focused ? 'videocam' : 'videocam-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary[500],
        tabBarInactiveTintColor: theme.colors.text.secondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background.primary,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border.light,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Doctors" 
        component={NearbyDoctorsScreen}
        options={{ title: 'Nearby Doctors' }}
      />
      <Tab.Screen 
        name="Pharmacy" 
        component={PharmacyScreen}
        options={{ title: 'Pharmacy' }}
      />
      <Tab.Screen 
        name="Appointments" 
        component={AppointmentsScreen}
        options={{ title: 'Appointments' }}
      />
      <Tab.Screen 
        name="Reports" 
        component={ReportsScreen}
        options={{ title: 'Reports' }}
      />
      <Tab.Screen 
        name="Messages" 
        component={MessagesScreen}
        options={{ title: 'Messages' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
}