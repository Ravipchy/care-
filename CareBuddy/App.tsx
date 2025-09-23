import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-gesture-handler';

import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext';
import { FamilyProvider } from './src/contexts/FamilyContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <FamilyProvider>
          <NavigationContainer>
            <AppNavigator />
            <StatusBar style="dark" />
          </NavigationContainer>
        </FamilyProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
