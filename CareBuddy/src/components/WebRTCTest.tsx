import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { WebRTCServiceFixed, defaultWebRTCConfigFixed } from '../services/WebRTCServiceFixed';

export default function WebRTCTest() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [webRTCService, setWebRTCService] = useState<WebRTCServiceFixed | null>(null);

  useEffect(() => {
    return () => {
      if (webRTCService) {
        webRTCService.destroy();
      }
    };
  }, [webRTCService]);

  const initializeWebRTC = async () => {
    try {
      setError(null);
      const service = new WebRTCServiceFixed(defaultWebRTCConfigFixed);
      
      service.setOnError((err) => {
        console.error('WebRTC Error:', err);
        setError(err);
      });

      service.setOnCallStateChange((state) => {
        console.log('Call State:', state);
      });

      await service.initialize();
      setWebRTCService(service);
      setIsInitialized(true);
      console.log('WebRTC Service initialized successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Failed to initialize WebRTC:', err);
      setError(errorMessage);
    }
  };

  const testGetUserMedia = async () => {
    if (!webRTCService) return;
    
    try {
      // This will trigger getUserMedia internally
      await webRTCService.startCall('test-doctor-id');
      console.log('getUserMedia test successful');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('getUserMedia test failed:', err);
      setError(errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WebRTC Test</Text>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      )}

      <TouchableOpacity 
        style={[styles.button, isInitialized && styles.buttonDisabled]} 
        onPress={initializeWebRTC}
        disabled={isInitialized}
      >
        <Text style={styles.buttonText}>
          {isInitialized ? 'WebRTC Initialized' : 'Initialize WebRTC'}
        </Text>
      </TouchableOpacity>

      {isInitialized && (
        <TouchableOpacity 
          style={styles.button} 
          onPress={testGetUserMedia}
        >
          <Text style={styles.buttonText}>Test getUserMedia</Text>
        </TouchableOpacity>
      )}
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
  buttonDisabled: {
    backgroundColor: '#ccc',
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
});
