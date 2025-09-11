import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../types/navigation';

type HomeScreenNavigationProp = DrawerNavigationProp<DrawerParamList, 'MainTabs'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [fadeAnim] = useState(new Animated.Value(0));

  // Sample user data
  const userName = "Ravi";
  
  // Sample upcoming appointment data
  const upcomingAppointment = {
    id: 1,
    doctorName: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    date: "Today, 2:30 PM",
    type: "Follow-up"
  };

  const quickActions = [
    {
      id: 1,
      title: 'Book Doctor',
      icon: 'medical',
      color: '#2196f3',
      onPress: () => Alert.alert('Book Doctor', 'Opening Doctors page...'),
    },
    {
      id: 2,
      title: 'Pharmacy',
      icon: 'storefront',
      color: '#4caf50',
      onPress: () => navigation.navigate('Pharmacy'),
    },
    {
      id: 3,
      title: 'Appointments',
      icon: 'calendar',
      color: '#9c27b0',
      onPress: () => Alert.alert('Appointments', 'Opening Appointments page...'),
    },
    {
      id: 4,
      title: 'Lab Tests',
      icon: 'flask',
      color: '#ff9800',
      onPress: () => navigation.navigate('LabTest'),
    },
    {
      id: 5,
      title: 'Ambulance',
      icon: 'car',
      color: '#f44336',
      onPress: () => navigation.navigate('Ambulance'),
    },
    {
      id: 6,
      title: 'Health Reports',
      icon: 'document-text',
      color: '#2196f3',
      onPress: () => Alert.alert('Reports', 'Opening Reports page...'),
    },
    {
      id: 7,
      title: 'Telemedicine',
      icon: 'videocam',
      color: '#4caf50',
      onPress: () => navigation.navigate('Telemedicine'),
    },
    {
      id: 8,
      title: 'Home Care',
      icon: 'home',
      color: '#9c27b0',
      onPress: () => navigation.navigate('HomeCare'),
    },
  ];

  useEffect(() => {
    // Simple fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleEmergencyCall = () => {
    Alert.alert(
      'Emergency Call',
      'Calling emergency services...',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', style: 'destructive', onPress: () => console.log('Emergency call initiated') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>CareBuddy</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="notifications-outline" size={24} color="#212121" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="settings-outline" size={24} color="#212121" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <Animated.View style={[styles.heroSection, { opacity: fadeAnim }]}>
          <Image 
            source={require('../../assets/images/carebuddy-logo.png')} 
            style={styles.heroLogo}
            resizeMode="contain"
          />
          <Text style={styles.heroTitle}>Welcome back, {userName}!</Text>
          <Text style={styles.heroSubtitle}>How can we help you today?</Text>
        </Animated.View>

        {/* Upcoming Appointment Banner */}
        {upcomingAppointment && (
          <Animated.View style={[styles.appointmentBanner, { opacity: fadeAnim }]}>
            <View style={styles.bannerContent}>
              <View style={styles.bannerIcon}>
                <Ionicons name="calendar" size={20} color="#2196f3" />
              </View>
              <View style={styles.bannerText}>
                <Text style={styles.bannerTitle}>Upcoming Appointment</Text>
                <Text style={styles.bannerSubtitle}>
                  {upcomingAppointment.doctorName} - {upcomingAppointment.date}
                </Text>
              </View>
              <TouchableOpacity style={styles.bannerButton}>
                <Ionicons name="chevron-forward" size={16} color="#2196f3" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* Quick Actions Grid */}
        <Animated.View style={[styles.quickActionsContainer, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionCard, { borderLeftColor: action.color }]}
                onPress={action.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <Ionicons name={action.icon as any} size={24} color="#ffffff" />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Emergency Call Button */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={handleEmergencyCall}
            activeOpacity={0.8}
          >
            <Ionicons name="call" size={24} color="#ffffff" />
            <Text style={styles.emergencyButtonText}>Emergency Call</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    padding: 8,
    marginLeft: 8,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heroLogo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212121',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
  appointmentBanner: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  bannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#bbdefb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#757575',
  },
  bannerButton: {
    padding: 8,
  },
  quickActionsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    alignItems: 'center',
    marginBottom: 20,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    textAlign: 'center',
  },
  emergencyButton: {
    backgroundColor: '#f44336',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emergencyButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 16,
  },
});