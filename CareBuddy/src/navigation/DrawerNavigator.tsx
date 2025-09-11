import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { DrawerParamList } from '../types/navigation';

import TabNavigator from './TabNavigator';
import ProfileScreen from '../screens/ProfileScreen';
import MedicalHistoryScreen from '../screens/MedicalHistoryScreen';
import LabTestScreen from '../screens/LabTestScreen';
import AmbulanceScreen from '../screens/AmbulanceScreen';
import HomeCareScreen from '../screens/HomeCareScreen';
import AboutUsScreen from '../screens/AboutUsScreen';
import TelemedicineScreen from '../screens/TelemedicineScreen';
import PharmacyScreen from '../screens/PharmacyScreen';

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={({ route }) => ({
        drawerIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'MainTabs') {
            iconName = 'home';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          } else if (route.name === 'MedicalHistory') {
            iconName = 'medical';
          } else if (route.name === 'LabTest') {
            iconName = 'flask';
          } else if (route.name === 'Ambulance') {
            iconName = 'car';
          } else if (route.name === 'HomeCare') {
            iconName = 'home';
          } else if (route.name === 'AboutUs') {
            iconName = 'information-circle';
          } else if (route.name === 'Telemedicine') {
            iconName = 'videocam';
          } else if (route.name === 'Pharmacy') {
            iconName = 'storefront';
          } else if (route.name === 'Logout') {
            iconName = 'log-out';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        drawerActiveTintColor: '#2c3e50',
        drawerInactiveTintColor: '#7f8c8d',
        drawerStyle: {
          backgroundColor: '#ffffff',
          width: 280,
        },
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#2c3e50',
          height: 80,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
      })}
    >
      <Drawer.Screen 
        name="MainTabs" 
        component={TabNavigator}
        options={{ 
          title: 'Home',
          headerShown: false,
        }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Drawer.Screen 
        name="MedicalHistory" 
        component={MedicalHistoryScreen}
        options={{ title: 'Medical History' }}
      />
      <Drawer.Screen 
        name="LabTest" 
        component={LabTestScreen}
        options={{ title: 'Lab Tests' }}
      />
      <Drawer.Screen 
        name="Ambulance" 
        component={AmbulanceScreen}
        options={{ title: 'Ambulance' }}
      />
      <Drawer.Screen 
        name="HomeCare" 
        component={HomeCareScreen}
        options={{ title: 'Home Care' }}
      />
      <Drawer.Screen 
        name="Telemedicine" 
        component={TelemedicineScreen}
        options={{ title: 'Telemedicine' }}
      />
      <Drawer.Screen 
        name="AboutUs" 
        component={AboutUsScreen}
        options={{ title: 'About Us' }}
      />
      <Drawer.Screen 
        name="Pharmacy" 
        component={PharmacyScreen}
        options={{ title: 'Pharmacy' }}
      />
      <Drawer.Screen 
        name="Logout" 
        component={AboutUsScreen} // Placeholder
        options={{ title: 'Logout' }}
      />
    </Drawer.Navigator>
  );
}
