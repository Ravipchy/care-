import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AboutUsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image 
            source={require('../../assets/images/carebuddy-logo.png')} 
            style={styles.heroLogo}
            resizeMode="contain"
          />
          <Text style={styles.heroTitle}>About CareBuddy</Text>
          <Text style={styles.heroSubtitle}>Your trusted health companion</Text>
        </View>

        {/* About Content */}
        <View style={styles.contentSection}>
          <Text style={styles.contentTitle}>Our Mission</Text>
          <Text style={styles.contentText}>
            CareBuddy is dedicated to making healthcare accessible, convenient, and reliable for everyone. 
            We believe that quality healthcare should be available at your fingertips, whether you're at home, 
            at work, or on the go.
          </Text>

          <Text style={styles.contentTitle}>What We Offer</Text>
          <Text style={styles.contentText}>
            • Doctor consultations and appointments{'\n'}
            • Lab test bookings and report management{'\n'}
            • Emergency ambulance services{'\n'}
            • Home care services{'\n'}
            • Telemedicine and video consultations{'\n'}
            • Health report storage and management
          </Text>

          <Text style={styles.contentTitle}>Contact Information</Text>
          <Text style={styles.contentText}>
            Email: support@carebuddy.com{'\n'}
            Phone: +1 (555) 123-4567{'\n'}
            Address: 123 Health Street, Medical City, MC 12345
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heroLogo: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  contentSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
    marginBottom: 10,
  },
  contentText: {
    fontSize: 16,
    color: '#7f8c8d',
    lineHeight: 24,
  },
});
