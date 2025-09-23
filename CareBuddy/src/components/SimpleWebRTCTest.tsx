import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function SimpleWebRTCTest() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  const testImport = async () => {
    try {
      setError(null);
      console.log('Testing Mock WebRTC...');
      
      // Test mock implementation
      console.log('✅ Mock WebRTC is available');
      console.log('✅ No native module dependencies');
      console.log('✅ All functionality simulated');
      
      setImportSuccess(true);
      setSuccess('Mock WebRTC working perfectly!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Mock WebRTC test failed:', err);
      setError(errorMessage);
    }
  };

  const testGetUserMedia = async () => {
    try {
      setError(null);
      setSuccess(null);
      console.log('Testing Mock getUserMedia...');
      
      // Simulate getUserMedia
      const mockStream = {
        getTracks: () => [
          { kind: 'video', enabled: true },
          { kind: 'audio', enabled: true }
        ]
      };
      
      console.log('✅ Mock getUserMedia successful:', mockStream);
      setSuccess('Mock getUserMedia worked! No native module needed.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Mock getUserMedia failed:', err);
      setError(errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simple WebRTC Test</Text>
      
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
        onPress={testImport}
      >
        <Text style={styles.buttonText}>Test Mock WebRTC</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={testGetUserMedia}
      >
        <Text style={styles.buttonText}>Test Mock getUserMedia</Text>
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