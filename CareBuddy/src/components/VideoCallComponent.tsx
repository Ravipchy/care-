import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// Mock RTCView - no native module needed
const RTCView = ({ style, streamURL, mirror, objectFit, ...props }: any) => (
  <View style={[style, { backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }]}>
    <Text style={{ color: 'white', fontSize: 16 }}>Video Stream</Text>
  </View>
);
import { WebRTCService, WebRTCConfig, CallState } from '../services/WebRTCService';
import { theme } from '../theme';

const { width, height } = Dimensions.get('window');

interface VideoCallComponentProps {
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  isPatient: boolean; // true for patient, false for doctor
  callId?: string; // Required for doctors joining existing calls
  onCallEnd: () => void;
  onError?: (error: string) => void;
}

export default function VideoCallComponent({
  doctorId,
  doctorName,
  doctorSpecialty,
  isPatient,
  callId,
  onCallEnd,
  onError,
}: VideoCallComponentProps) {
  const [callState, setCallState] = useState<CallState>({
    isConnected: false,
    isConnecting: false,
    isMuted: false,
    isVideoEnabled: true,
    localStream: null,
    remoteStream: null,
    callId: null,
    error: null,
  });

  const [callDuration, setCallDuration] = useState(0);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const webRTCService = useRef<WebRTCService | null>(null);
  const durationInterval = useRef<NodeJS.Timeout | null>(null);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    initializeCall();
    return () => cleanup();
  }, []);

  useEffect(() => {
    if (callState.isConnected && !durationInterval.current) {
      startCallTimer();
    } else if (!callState.isConnected && durationInterval.current) {
      stopCallTimer();
    }
  }, [callState.isConnected]);

  useEffect(() => {
    if (callState.error) {
      Alert.alert('Call Error', callState.error, [
        { text: 'OK', onPress: onCallEnd }
      ]);
    }
  }, [callState.error]);

  const initializeCall = async () => {
    try {
      // WebRTC configuration with secure ICE servers
      const config: WebRTCConfig = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          // Add your TURN servers here for better connectivity
          // { urls: 'turn:your-turn-server.com:3478', username: 'user', credential: 'pass' }
        ],
        signalingServerUrl: 'https://your-signaling-server.com', // Replace with your server
      };

      webRTCService.current = new WebRTCService(config);
      
      // Set up event listeners
      webRTCService.current.setOnCallStateChange(setCallState);
      webRTCService.current.setOnError((error) => {
        console.error('WebRTC Error:', error);
        onError?.(error);
      });

      // Initialize the service
      await webRTCService.current.initialize();

      // Start or join call
      if (isPatient) {
        await webRTCService.current.startCall(doctorId);
      } else if (callId) {
        await webRTCService.current.joinCall(callId);
      } else {
        throw new Error('Call ID required for doctors');
      }
    } catch (error) {
      console.error('Failed to initialize call:', error);
      onError?.(error instanceof Error ? error.message : 'Failed to initialize call');
    }
  };

  const cleanup = () => {
    if (webRTCService.current) {
      webRTCService.current.destroy();
      webRTCService.current = null;
    }
    stopCallTimer();
    clearControlsTimeout();
  };

  const startCallTimer = () => {
    durationInterval.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const stopCallTimer = () => {
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
      durationInterval.current = null;
    }
  };

  const clearControlsTimeout = () => {
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
      controlsTimeout.current = null;
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleControls = () => {
    if (isControlsVisible) {
      // Hide controls
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setIsControlsVisible(false);
    } else {
      // Show controls
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setIsControlsVisible(true);
      
      // Auto-hide after 3 seconds
      clearControlsTimeout();
      controlsTimeout.current = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
        setIsControlsVisible(false);
      }, 3000);
    }
  };

  const toggleMicrophone = () => {
    webRTCService.current?.toggleMicrophone();
  };

  const toggleCamera = () => {
    webRTCService.current?.toggleCamera();
  };

  const endCall = () => {
    webRTCService.current?.endCall();
    onCallEnd();
  };

  const renderVideoStream = (stream: any, isLocal: boolean) => {
    if (!stream) {
      return (
        <View style={[styles.videoPlaceholder, isLocal ? styles.localVideoPlaceholder : styles.remoteVideoPlaceholder]}>
          <Ionicons 
            name={isLocal ? "person" : "person-outline"} 
            size={isLocal ? 40 : 60} 
            color={theme.colors.text.inverse} 
          />
          <Text style={styles.videoPlaceholderText}>
            {isLocal ? 'Your Video' : `${doctorName}'s Video`}
          </Text>
          {!isLocal && callState.isConnecting && (
            <ActivityIndicator size="small" color={theme.colors.primary[500]} style={{ marginTop: 10 }} />
          )}
        </View>
      );
    }

    return (
      <RTCView
        style={isLocal ? styles.localVideo : styles.remoteVideo}
        streamURL={stream.toURL()}
        mirror={isLocal}
        objectFit="cover"
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.neutral[900]} />
      
      {/* Main video area */}
      <TouchableOpacity 
        style={styles.videoContainer} 
        activeOpacity={1}
        onPress={toggleControls}
      >
        {/* Remote video (doctor's video) */}
        <View style={styles.remoteVideoContainer}>
          {renderVideoStream(callState.remoteStream, false)}
        </View>

        {/* Local video (patient's video) */}
        <View style={styles.localVideoContainer}>
          {renderVideoStream(callState.localStream, true)}
        </View>

        {/* Connection status */}
        {callState.isConnecting && (
          <View style={styles.connectingOverlay}>
            <ActivityIndicator size="large" color={theme.colors.primary[500]} />
            <Text style={styles.connectingText}>
              {isPatient ? 'Connecting to doctor...' : 'Connecting to patient...'}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Controls overlay */}
      <Animated.View style={[styles.controlsOverlay, { opacity: fadeAnim }]}>
        {/* Top bar with call info */}
        <View style={styles.topBar}>
          <View style={styles.callInfo}>
            <Text style={styles.doctorName}>{doctorName}</Text>
            <Text style={styles.doctorSpecialty}>{doctorSpecialty}</Text>
            <Text style={styles.callDuration}>
              {callState.isConnected ? formatDuration(callDuration) : 'Connecting...'}
            </Text>
          </View>
          <View style={styles.statusIndicator}>
            <View style={[
              styles.statusDot,
              { backgroundColor: callState.isConnected ? theme.colors.success[500] : theme.colors.warning[500] }
            ]} />
            <Text style={styles.statusText}>
              {callState.isConnected ? 'Connected' : 'Connecting'}
            </Text>
          </View>
        </View>

        {/* Bottom controls */}
        <View style={styles.bottomControls}>
          <TouchableOpacity
            style={[styles.controlButton, callState.isMuted && styles.controlButtonActive]}
            onPress={toggleMicrophone}
          >
            <Ionicons 
              name={callState.isMuted ? "mic-off" : "mic"} 
              size={24} 
              color={theme.colors.text.inverse} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, !callState.isVideoEnabled && styles.controlButtonActive]}
            onPress={toggleCamera}
          >
            <Ionicons 
              name={callState.isVideoEnabled ? "videocam" : "videocam-off"} 
              size={24} 
              color={theme.colors.text.inverse} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.endCallButton]}
            onPress={endCall}
          >
            <Ionicons name="call" size={24} color={theme.colors.text.inverse} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral[900],
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  remoteVideoContainer: {
    flex: 1,
    backgroundColor: theme.colors.neutral[800],
  },
  localVideoContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: theme.colors.primary[500],
  },
  remoteVideo: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  localVideo: {
    width: '100%',
    height: '100%',
  },
  videoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.neutral[700],
  },
  remoteVideoPlaceholder: {
    backgroundColor: theme.colors.neutral[800],
  },
  localVideoPlaceholder: {
    backgroundColor: theme.colors.neutral[600],
  },
  videoPlaceholderText: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.text.inverse,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  connectingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectingText: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.text.inverse,
    marginTop: theme.spacing.lg,
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  callInfo: {
    flex: 1,
  },
  doctorName: {
    ...theme.typography.textStyles.h4,
    color: theme.colors.text.inverse,
    fontWeight: '600',
  },
  doctorSpecialty: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.text.inverse,
    opacity: 0.8,
    marginTop: theme.spacing.xs,
  },
  callDuration: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.text.inverse,
    opacity: 0.7,
    marginTop: theme.spacing.xs,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.sm,
  },
  statusText: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.text.inverse,
    opacity: 0.8,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    gap: theme.spacing.xl,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  controlButtonActive: {
    backgroundColor: theme.colors.error[500],
    borderColor: theme.colors.error[500],
  },
  endCallButton: {
    backgroundColor: theme.colors.error[500],
    borderColor: theme.colors.error[500],
    width: 64,
    height: 64,
    borderRadius: 32,
  },
});
