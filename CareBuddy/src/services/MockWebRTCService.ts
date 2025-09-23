// Mock WebRTC Service to avoid native module issues
// This provides a simulation of WebRTC functionality for testing

export interface WebRTCConfig {
  iceServers: RTCIceServer[];
  signalingServerUrl: string;
}

export interface CallState {
  isConnected: boolean;
  isConnecting: boolean;
  isMuted: boolean;
  isVideoEnabled: boolean;
  localStream: any | null;
  remoteStream: any | null;
  callId: string | null;
  error: string | null;
}

export class MockWebRTCService {
  private callId: string | null = null;
  private isInitiator: boolean = false;
  private isMuted: boolean = false;
  private isVideoEnabled: boolean = true;
  private config: WebRTCConfig;
  private localStream: any = null;
  private remoteStream: any = null;

  // Event callbacks
  private onCallStateChange?: (state: CallState) => void;
  private onError?: (error: string) => void;

  constructor(config: WebRTCConfig) {
    this.config = config;
  }

  // Initialize the service
  async initialize(): Promise<void> {
    try {
      console.log('Mock WebRTC Service initialized');
      // Simulate initialization delay
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      this.handleError('Failed to initialize Mock WebRTC service', error);
    }
  }

  // Start a new call (for patients)
  async startCall(doctorId: string): Promise<void> {
    try {
      this.isInitiator = true;
      this.callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      this.updateCallState({ isConnecting: true, callId: this.callId });

      // Simulate getting user media
      await this.getUserMedia();

      // Simulate creating offer
      console.log('Mock: Creating offer for call', this.callId);
      
      // Simulate connection after delay
      setTimeout(() => {
        this.updateCallState({ isConnected: true, isConnecting: false });
      }, 2000);

    } catch (error) {
      this.handleError('Failed to start call', error);
    }
  }

  // Join an existing call (for doctors)
  async joinCall(callId: string): Promise<void> {
    try {
      this.isInitiator = false;
      this.callId = callId;
      
      this.updateCallState({ isConnecting: true, callId: this.callId });

      // Simulate getting user media
      await this.getUserMedia();

      // Simulate connection after delay
      setTimeout(() => {
        this.updateCallState({ isConnected: true, isConnecting: false });
      }, 2000);

    } catch (error) {
      this.handleError('Failed to join call', error);
    }
  }

  // Mock getUserMedia
  private async getUserMedia(): Promise<void> {
    try {
      console.log('Mock: Getting user media...');
      
      // Simulate media access delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create mock stream object
      this.localStream = {
        getTracks: () => [
          { 
            kind: 'video', 
            enabled: true, 
            stop: () => console.log('Mock: Video track stopped') 
          },
          { 
            kind: 'audio', 
            enabled: true, 
            stop: () => console.log('Mock: Audio track stopped') 
          }
        ],
        getVideoTracks: () => [{ enabled: true, stop: () => {} }],
        getAudioTracks: () => [{ enabled: true, stop: () => {} }]
      };
      
      this.updateCallState();
    } catch (error) {
      this.handleError('Failed to access camera/microphone. Please check permissions.', error);
    }
  }

  // Toggle microphone
  toggleMicrophone(): void {
    this.isMuted = !this.isMuted;
    console.log('Mock: Microphone', this.isMuted ? 'muted' : 'unmuted');
    this.updateCallState({ isMuted: this.isMuted });
  }

  // Toggle camera
  toggleCamera(): void {
    this.isVideoEnabled = !this.isVideoEnabled;
    console.log('Mock: Camera', this.isVideoEnabled ? 'enabled' : 'disabled');
    this.updateCallState({ isVideoEnabled: this.isVideoEnabled });
  }

  // End the call
  endCall(): void {
    try {
      console.log('Mock: Ending call');
      
      // Stop local stream
      if (this.localStream) {
        this.localStream.getTracks().forEach((track: any) => track.stop());
        this.localStream = null;
      }

      // Reset state
      this.callId = null;
      this.remoteStream = null;
      this.isInitiator = false;

      this.updateCallState({
        isConnected: false,
        isConnecting: false,
        isMuted: false,
        isVideoEnabled: true,
        localStream: null,
        remoteStream: null,
        callId: null,
        error: null,
      });
    } catch (error) {
      this.handleError('Failed to end call', error);
    }
  }

  // Update call state and notify listeners
  private updateCallState(updates: Partial<CallState> = {}): void {
    const currentState: CallState = {
      isConnected: false,
      isConnecting: this.callId !== null,
      isMuted: this.isMuted,
      isVideoEnabled: this.isVideoEnabled,
      localStream: this.localStream,
      remoteStream: this.remoteStream,
      callId: this.callId,
      error: null,
      ...updates,
    };

    this.onCallStateChange?.(currentState);
  }

  // Handle errors
  private handleError(message: string, error?: any): void {
    console.error('Mock WebRTC Error:', message, error);
    
    const errorMessage = error?.message ? `${message}: ${error.message}` : message;
    
    this.updateCallState({ error: errorMessage });
    this.onError?.(errorMessage);
  }

  // Set event callbacks
  setOnCallStateChange(callback: (state: CallState) => void): void {
    this.onCallStateChange = callback;
  }

  setOnError(callback: (error: string) => void): void {
    this.onError = callback;
  }

  // Cleanup
  destroy(): void {
    this.endCall();
  }

  // Get current call state
  getCallState(): CallState {
    return {
      isConnected: false,
      isConnecting: this.callId !== null,
      isMuted: this.isMuted,
      isVideoEnabled: this.isVideoEnabled,
      localStream: this.localStream,
      remoteStream: this.remoteStream,
      callId: this.callId,
      error: null,
    };
  }
}

// Mock RTCView component
export const RTCView = ({ stream, style, ...props }: any) => {
  // This would be replaced with a real video component in a real implementation
  return null;
};

// Default configuration
export const defaultMockWebRTCConfig: WebRTCConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
  signalingServerUrl: 'https://mock-signaling-server.com',
};

