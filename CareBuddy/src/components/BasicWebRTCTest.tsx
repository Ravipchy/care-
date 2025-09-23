import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SimpleWebRTCService, defaultSimpleWebRTCConfig } from '../services/SimpleWebRTCService';

export default function BasicWebRTCTest() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const testMockWebRTC = async () => {
    try {
      setError(null);
      setSuccess(null);
      
      console.log('Testing Mock WebRTC service...');
      
      // Test 1: Create mock service
      const mockService = new SimpleWebRTCService(defaultSimpleWebRTCConfig);
      console.log('✅ Mock WebRTC service created');
      
      // Test 2: Initialize service
      await mockService.initialize();
      console.log('✅ Mock WebRTC service initialized');
      
      // Test 3: Test start call
      await mockService.startCall('test-doctor');
      console.log('✅ Mock call started');
      
      // Test 4: Test controls
      mockService.toggleMicrophone();
      mockService.toggleCamera();
      console.log('✅ Mock controls working');
      
      setSuccess('Mock WebRTC service working perfectly! No native module issues.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Mock WebRTC test failed:', err);
      setError(errorMessage);
    }
  };

  const testVideoCall = async () => {
    try {
      setError(null);
      setSuccess(null);
      
      console.log('Testing video call simulation...');
      
      const mockService = new SimpleWebRTCService(defaultSimpleWebRTCConfig);
      await mockService.initialize();
      
      // Simulate a full call
      await mockService.startCall('test-doctor');
      
      // Simulate call duration
      setTimeout(() => {
        mockService.toggleMicrophone();
        mockService.toggleCamera();
      }, 1000);
      
      setTimeout(() => {
        mockService.endCall();
        setSuccess('Video call simulation completed successfully!');
      }, 3000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Video call test failed:', err);
      setError(errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Basic WebRTC Test</Text>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ Error: {error}</Text>
        </View>
      )}

      {success && (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>✅ {success}</Text>
        </View>
      )}

      <TouchableOpacity 
        style={styles.button} 
        onPress={testMockWebRTC}
      >
        <Text style={styles.buttonText}>Test Mock WebRTC</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={testVideoCall}
      >
        <Text style={styles.buttonText}>Test Video Call</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 10,
    minWidth: 200,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    fontWeight: '500',
  },
  successContainer: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  successText: {
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: '500',
  },
});
