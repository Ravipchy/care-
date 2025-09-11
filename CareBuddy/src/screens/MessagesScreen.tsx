import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function MessagesScreen() {
  const conversations = [
    { id: 1, doctor: 'Dr. Smith', specialty: 'General Medicine', lastMessage: 'How are you feeling today?', time: '2:30 PM', unread: 2 },
    { id: 2, doctor: 'Dr. Johnson', specialty: 'Cardiology', lastMessage: 'Please take your medication as prescribed', time: '1:15 PM', unread: 0 },
    { id: 3, doctor: 'Dr. Brown', specialty: 'Dermatology', lastMessage: 'Your test results look good', time: 'Yesterday', unread: 1 },
  ];

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
          <Text style={styles.heroTitle}>Messages</Text>
          <Text style={styles.heroSubtitle}>Chat with your healthcare providers</Text>
        </View>

        {/* Telemedicine Button */}
        <View style={styles.telemedicineSection}>
          <TouchableOpacity style={styles.telemedicineButton}>
            <Ionicons name="videocam" size={30} color="#ffffff" />
            <Text style={styles.telemedicineButtonText}>Start Video Call</Text>
          </TouchableOpacity>
        </View>

        {/* Conversations List */}
        <View style={styles.conversationsSection}>
          <Text style={styles.sectionTitle}>Recent Conversations</Text>
          {conversations.map((conversation) => (
            <TouchableOpacity key={conversation.id} style={styles.conversationCard}>
              <View style={styles.conversationHeader}>
                <View style={styles.doctorAvatar}>
                  <Ionicons name="person" size={25} color="#3498db" />
                </View>
                <View style={styles.conversationInfo}>
                  <Text style={styles.doctorName}>{conversation.doctor}</Text>
                  <Text style={styles.specialty}>{conversation.specialty}</Text>
                  <Text style={styles.lastMessage}>{conversation.lastMessage}</Text>
                </View>
                <View style={styles.conversationMeta}>
                  <Text style={styles.time}>{conversation.time}</Text>
                  {conversation.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{conversation.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
  telemedicineSection: {
    marginBottom: 30,
  },
  telemedicineButton: {
    backgroundColor: '#1abc9c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  telemedicineButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  conversationsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  conversationCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  conversationInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 3,
  },
  specialty: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  lastMessage: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  conversationMeta: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  unreadBadge: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
