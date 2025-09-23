import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

export default function HomeCareScreen() {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    { 
      id: 1, 
      name: 'Nursing Care', 
      price: '$50/hour', 
      icon: 'medical',
      description: 'Professional nursing care at home for patients with chronic conditions',
      duration: '4-8 hours',
      available: true
    },
    { 
      id: 2, 
      name: 'Physiotherapy', 
      price: '$75/hour', 
      icon: 'fitness',
      description: 'Physical therapy and rehabilitation services in the comfort of your home',
      duration: '1-2 hours',
      available: true
    },
    { 
      id: 3, 
      name: 'Elderly Care', 
      price: '$40/hour', 
      icon: 'person',
      description: 'Comprehensive care for elderly patients including daily activities',
      duration: '8-12 hours',
      available: true
    },
    { 
      id: 4, 
      name: 'Post-Surgery Care', 
      price: '$60/hour', 
      icon: 'medical',
      description: 'Specialized care for post-operative recovery and wound management',
      duration: '6-10 hours',
      available: true
    },
    { 
      id: 5, 
      name: 'Baby Care', 
      price: '$45/hour', 
      icon: 'heart-circle',
      description: 'Newborn and infant care services with experienced caregivers',
      duration: '4-8 hours',
      available: true
    },
    { 
      id: 6, 
      name: 'Mental Health Support', 
      price: '$80/hour', 
      icon: 'heart',
      description: 'Counseling and mental health support services at home',
      duration: '1-2 hours',
      available: false
    },
  ];

  const handleBookService = (service: any) => {
    if (!service.available) {
      Alert.alert('Service Unavailable', 'This service is currently not available. Please try again later.');
      return;
    }
    
    setSelectedService(service);
    Alert.alert(
      'Book Service',
      `Book ${service.name}?\n\nPrice: ${service.price}\nDuration: ${service.duration}\n\n${service.description}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Book Now', onPress: () => Alert.alert('Success', `${service.name} booked successfully! Our team will contact you shortly.`) }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Home Care Services</Text>
          <Text style={styles.headerSubtitle}>Professional healthcare at your home</Text>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroImageContainer}>
            <Ionicons name="home" size={60} color={theme.colors.primary[500]} />
          </View>
          <Text style={styles.heroTitle}>Quality Care at Home</Text>
          <Text style={styles.heroSubtitle}>Experienced healthcare professionals providing personalized care in the comfort of your home</Text>
          <View style={styles.heroFeatures}>
            <View style={styles.heroFeature}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.success[500]} />
              <Text style={styles.heroFeatureText}>Licensed Professionals</Text>
            </View>
            <View style={styles.heroFeature}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.success[500]} />
              <Text style={styles.heroFeatureText}>24/7 Support</Text>
            </View>
            <View style={styles.heroFeature}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.success[500]} />
              <Text style={styles.heroFeatureText}>Flexible Scheduling</Text>
            </View>
          </View>
        </View>

        {/* Services Grid */}
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Available Services</Text>
          <View style={styles.servicesGrid}>
            {services.map((service) => (
              <View key={service.id} style={styles.serviceCard}>
                <View style={styles.serviceHeader}>
                  <View style={styles.serviceIconContainer}>
                    <Ionicons 
                      name={service.icon as any} 
                      size={28} 
                      color={service.available ? theme.colors.primary[500] : theme.colors.neutral[400]} 
                    />
                  </View>
                  <View style={styles.serviceInfo}>
                    <Text style={[
                      styles.serviceName,
                      !service.available && styles.unavailableText
                    ]}>
                      {service.name}
                    </Text>
                    <Text style={styles.servicePrice}>{service.price}</Text>
                    <Text style={styles.serviceDuration}>{service.duration}</Text>
                  </View>
                </View>
                
                <Text style={[
                  styles.serviceDescription,
                  !service.available && styles.unavailableText
                ]}>
                  {service.description}
                </Text>
                
                <View style={styles.serviceFooter}>
                  <View style={styles.serviceStatus}>
                    {service.available ? (
                      <View style={styles.availableBadge}>
                        <Ionicons name="checkmark" size={12} color={theme.colors.text.inverse} />
                        <Text style={styles.availableText}>Available</Text>
                      </View>
                    ) : (
                      <View style={styles.unavailableBadge}>
                        <Ionicons name="close" size={12} color={theme.colors.text.secondary} />
                        <Text style={styles.unavailableBadgeText}>Unavailable</Text>
                      </View>
                    )}
                  </View>
                  
                  <TouchableOpacity 
                    style={[
                      styles.bookButton,
                      !service.available && styles.disabledButton
                    ]}
                    onPress={() => handleBookService(service)}
                    disabled={!service.available}
                  >
                    <Text style={[
                      styles.bookButtonText,
                      !service.available && styles.disabledText
                    ]}>
                      {service.available ? 'Book Now' : 'Unavailable'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Need Help?</Text>
          <Text style={styles.contactSubtitle}>Our support team is here to help you 24/7</Text>
          <View style={styles.contactButtons}>
            <TouchableOpacity style={styles.contactButton}>
              <Ionicons name="call" size={20} color={theme.colors.text.inverse} />
              <Text style={styles.contactButtonText}>Call Support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButtonSecondary}>
              <Ionicons name="chatbubble" size={20} color={theme.colors.primary[500]} />
              <Text style={styles.contactButtonSecondaryText}>Live Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  headerTitle: {
    ...theme.typography.textStyles.h2,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  headerSubtitle: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.secondary,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: theme.spacing['3xl'],
    ...theme.components.card,
  },
  heroImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  heroTitle: {
    ...theme.typography.textStyles.h3,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
    fontWeight: '700',
  },
  heroSubtitle: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    lineHeight: 24,
  },
  heroFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing.lg,
  },
  heroFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  heroFeatureText: {
    ...theme.typography.textStyles.label,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  servicesSection: {
    marginBottom: theme.spacing['3xl'],
  },
  sectionTitle: {
    ...theme.typography.textStyles.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  servicesGrid: {
    gap: theme.spacing.lg,
  },
  serviceCard: {
    ...theme.components.card,
    padding: theme.spacing.lg,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  serviceIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.lg,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
  },
  servicePrice: {
    ...theme.typography.textStyles.h6,
    color: theme.colors.primary[500],
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  serviceDuration: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.secondary,
  },
  serviceDescription: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceStatus: {
    flex: 1,
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.success[500],
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: theme.spacing.xs,
  },
  availableText: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.inverse,
    fontWeight: '600',
  },
  unavailableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral[300],
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: theme.spacing.xs,
  },
  unavailableBadgeText: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
  unavailableText: {
    color: theme.colors.neutral[400],
  },
  bookButton: {
    backgroundColor: theme.colors.primary[500],
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: 20,
  },
  bookButtonText: {
    ...theme.typography.textStyles.label,
    color: theme.colors.text.inverse,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: theme.colors.neutral[300],
  },
  disabledText: {
    color: theme.colors.text.secondary,
  },
  contactSection: {
    marginBottom: theme.spacing.xl,
  },
  contactSubtitle: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  contactButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    ...theme.components.card,
  },
  contactButtonText: {
    ...theme.typography.textStyles.h6,
    color: theme.colors.text.inverse,
    fontWeight: '600',
  },
  contactButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.primary[500],
    ...theme.components.card,
  },
  contactButtonSecondaryText: {
    ...theme.typography.textStyles.h6,
    color: theme.colors.primary[500],
    fontWeight: '600',
  },
});
