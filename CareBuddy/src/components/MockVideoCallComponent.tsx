import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { SimpleWebRTCService, defaultSimpleWebRTCConfig, CallState } from '../services/SimpleWebRTCService';

const { width, height } = Dimensions.get('window');

interface MockVideoCallComponentProps {
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  isPatient: boolean;
  callId?: string;
  onCallEnd: () => void;
  onError?: (error: string) => void;
}

export default function MockVideoCallComponent({
  doctorId,
  doctorName,
  doctorSpecialty,
  isPatient,
  callId,
  onCallEnd,
  onError,
}: MockVideoCallComponentProps) {
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
  const [showControls, setShowControls] = useState(true);
  
  const webRTCService = useRef<SimpleWebRTCService | null>(null);
  const durationInterval = useRef<NodeJS.Timeout | null>(null);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeCall();
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (callState.error) {
      Alert.alert('Call Error', callState.error, [
        { text: 'OK', onPress: onCallEnd }
      ]);
    }
  }, [callState.error]);

  const initializeCall = async () => {
    try {
      webRTCService.current = new SimpleWebRTCService(defaultSimpleWebRTCConfig);
      
      webRTCService.current.setOnCallStateChange(setCallState);
      webRTCService.current.setOnError((error) => {
        console.error('Mock WebRTC Error:', error);
        onError?.(error);
      });

      await webRTCService.current.initialize();

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

  const handleEndCall = () => {
    cleanup();
    onCallEnd();
  };

  const handleToggleMute = () => {
    webRTCService.current?.toggleMicrophone();
  };

  const handleToggleVideo = () => {
    webRTCService.current?.toggleCamera();
  };

  const handleScreenTouch = () => {
    setShowControls(true);
    clearControlsTimeout();
    
    controlsTimeout.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start timer when connected
  useEffect(() => {
    if (callState.isConnected) {
      startCallTimer();
    } else {
      stopCallTimer();
    }
  }, [callState.isConnected]);

  return (
    <View style={styles.container} onTouchStart={handleScreenTouch}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{doctorName}</Text>
          <Text style={styles.doctorSpecialty}>{doctorSpecialty}</Text>
          {callState.isConnected && (
            <Text style={styles.callDuration}>{formatDuration(callDuration)}</Text>
          )}
        </View>
        <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
          <Ionicons name="call" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Video Areas */}
      <View style={styles.videoContainer}>
        {/* Remote Video (Doctor) */}
        <View style={styles.remoteVideoContainer}>
          <View style={styles.remoteVideoPlaceholder}>
            <Ionicons name="person" size={80} color={theme.colors.gray[400]} />
            <Text style={styles.placeholderText}>
              {callState.isConnecting ? 'Connecting...' : 'Doctor Video'}
            </Text>
          </View>
        </View>

        {/* Local Video (Patient) */}
        <View style={styles.localVideoContainer}>
          <View style={styles.localVideoPlaceholder}>
            <Ionicons name="videocam" size={40} color={theme.colors.gray[400]} />
            <Text style={styles.localVideoText}>
              {callState.isVideoEnabled ? 'You' : 'Camera Off'}
            </Text>
          </View>
        </View>
      </View>

      {/* Controls */}
      {showControls && (
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, callState.isMuted && styles.controlButtonActive]}
            onPress={handleToggleMute}
          >
            <Ionicons 
              name={callState.isMuted ? "mic-off" : "mic"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, !callState.isVideoEnabled && styles.controlButtonActive]}
            onPress={handleToggleVideo}
          >
            <Ionicons 
              name={callState.isVideoEnabled ? "videocam" : "videocam-off"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.endCallControlButton]}
            onPress={handleEndCall}
          >
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* Status */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          {callState.isConnecting && 'Connecting...'}
          {callState.isConnected && 'Connected'}
          {callState.error && `Error: ${callState.error}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    ...theme.typography.textStyles.h5,
    color: theme.colors.white,
    fontWeight: '600',
  },
  doctorSpecialty: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.gray[300],
    marginTop: theme.spacing.xs,
  },
  callDuration: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.gray[400],
    marginTop: theme.spacing.xs,
  },
  endCallButton: {
    backgroundColor: theme.colors.error[500],
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  remoteVideoContainer: {
    flex: 1,
    backgroundColor: theme.colors.gray[900],
  },
  remoteVideoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    ...theme.typography.textStyles.body1,
    color: theme.colors.gray[400],
    marginTop: theme.spacing.md,
  },
  localVideoContainer: {
    position: 'absolute',
    top: theme.spacing.lg,
    right: theme.spacing.lg,
    width: 120,
    height: 90,
    backgroundColor: theme.colors.gray[800],
    borderRadius: 8,
    overflow: 'hidden',
  },
  localVideoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  localVideoText: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.gray[400],
    marginTop: theme.spacing.xs,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  controlButton: {
    backgroundColor: theme.colors.gray[600],
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: theme.spacing.md,
  },
  controlButtonActive: {
    backgroundColor: theme.colors.error[500],
  },
  endCallControlButton: {
    backgroundColor: theme.colors.error[500],
  },
  statusContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  statusText: {
    ...theme.typography.textStyles.body2,
    color: theme.colors.gray[300],
  },
});
