import { io, Socket } from 'socket.io-client';

// Mock WebRTC implementation - no native module needed
const RTCPeerConnection = class MockRTCPeerConnection {
  constructor(config?: any) {}
  addTrack(track: any, stream: any) {}
  createOffer(options?: any) { return Promise.resolve({}); }
  createAnswer() { return Promise.resolve({}); }
  setLocalDescription(desc: any) { return Promise.resolve(); }
  setRemoteDescription(desc: any) { return Promise.resolve(); }
  addIceCandidate(candidate: any) { return Promise.resolve(); }
  close() {}
  get connectionState() { return 'connected'; }
};
const RTCView = () => null;
const mediaDevices = {
  getUserMedia: (constraints?: any) => Promise.resolve({
    getTracks: () => [],
    getAudioTracks: () => [{ enabled: true, stop: () => {} }],
    getVideoTracks: () => [{ enabled: true, stop: () => {} }]
  })
};
const MediaStream = class MockMediaStream {
  getTracks() { return []; }
  getAudioTracks() { return [{ enabled: true, stop: () => {} }]; }
  getVideoTracks() { return [{ enabled: true, stop: () => {} }]; }
};
const MediaStreamTrack = class MockMediaStreamTrack {};
const RTCIceCandidate = class MockRTCIceCandidate {};
const RTCSessionDescription = class MockRTCSessionDescription {};

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

export class WebRTCService {
  private socket: Socket | null = null;
  private peerConnection: any = null;
  private localStream: any = null;
  private remoteStream: any = null;
  private callId: string | null = null;
  private isInitiator: boolean = false;
  private isMuted: boolean = false;
  private isVideoEnabled: boolean = true;
  private config: WebRTCConfig;

  // Event callbacks
  private onCallStateChange?: (state: CallState) => void;
  private onError?: (error: string) => void;

  constructor(config: WebRTCConfig) {
    this.config = config;
  }

  // Initialize the service
  async initialize(): Promise<void> {
    try {
      // Initialize socket connection
      this.socket = io(this.config.signalingServerUrl, {
        transports: ['websocket'],
        autoConnect: true,
      });

      this.setupSocketListeners();
      await this.initializePeerConnection();
    } catch (error) {
      this.handleError('Failed to initialize WebRTC service', error);
    }
  }

  // Set up socket event listeners
  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to signaling server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from signaling server');
      this.handleError('Connection lost');
    });

    this.socket.on('call-offer', async (data: { offer: RTCSessionDescription; callId: string }) => {
      await this.handleIncomingCall(data.offer, data.callId);
    });

    this.socket.on('call-answer', async (data: { answer: RTCSessionDescription }) => {
      await this.handleCallAnswer(data.answer);
    });

    this.socket.on('ice-candidate', async (data: { candidate: RTCIceCandidate }) => {
      await this.handleIceCandidate(data.candidate);
    });

    this.socket.on('call-ended', () => {
      this.endCall();
    });

    this.socket.on('error', (error: string) => {
      this.handleError(error);
    });
  }

  // Initialize peer connection with ICE servers
  private async initializePeerConnection(): Promise<void> {
    try {
      // Use a simpler configuration to avoid compatibility issues
      const config = {
        iceServers: this.config.iceServers,
        iceCandidatePoolSize: 0, // Set to 0 to avoid some compatibility issues
      };

      this.peerConnection = new RTCPeerConnection();

      this.setupPeerConnectionListeners();
    } catch (error) {
      this.handleError('Failed to create peer connection', error);
    }
  }

  // Set up peer connection event listeners
  private setupPeerConnectionListeners(): void {
    if (!this.peerConnection) return;

    (this.peerConnection as any).onicecandidate = (event: any) => {
      if (event.candidate && this.socket) {
        this.socket.emit('ice-candidate', {
          candidate: event.candidate,
          callId: this.callId,
        });
      }
    };

    (this.peerConnection as any).onaddstream = (event: any) => {
      console.log('Remote stream added');
      this.remoteStream = event.stream;
      this.updateCallState();
    };

    // Also handle ontrack for newer WebRTC implementations
    (this.peerConnection as any).ontrack = (event: any) => {
      console.log('Remote track added');
      if (event.streams && event.streams[0]) {
        this.remoteStream = event.streams[0];
        this.updateCallState();
      }
    };

    (this.peerConnection as any).onconnectionstatechange = () => {
      const state = this.peerConnection?.connectionState;
      console.log('Connection state:', state);
      
      if (state === 'connected') {
        this.updateCallState({ isConnected: true, isConnecting: false });
      } else if (state === 'disconnected' || state === 'failed') {
        this.handleError('Connection lost');
      }
    };
  }

  // Start a new call (for patients)
  async startCall(doctorId: string): Promise<void> {
    try {
      this.isInitiator = true;
      this.callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      this.updateCallState({ isConnecting: true, callId: this.callId });

      // Get user media
      await this.getUserMedia();

      // Create offer
      if (this.peerConnection && this.localStream) {
        try {
          // Use addStream for better compatibility with react-native-webrtc
          if ('addStream' in this.peerConnection) {
            (this.peerConnection as any).addStream(this.localStream);
          } else {
            // Fallback to addTrack if addStream is not available
            this.localStream.getTracks().forEach((track: any) => {
              if (track && this.peerConnection) {
                this.peerConnection.addTrack(track, this.localStream!);
              }
            });
          }
          
          const offer = await this.peerConnection.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
          });

          await this.peerConnection.setLocalDescription(offer);

          // Send offer to doctor
          if (this.socket) {
            this.socket.emit('start-call', {
              offer,
              callId: this.callId,
              doctorId,
            });
          }
        } catch (trackError) {
          console.warn('Error adding tracks or creating offer:', trackError);
          // Continue with call even if track addition fails
        }
      }
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

      // Get user media
      await this.getUserMedia();

      // Notify that doctor is ready to join
      if (this.socket) {
        this.socket.emit('join-call', { callId });
      }
    } catch (error) {
      this.handleError('Failed to join call', error);
    }
  }

  // Handle incoming call offer
  private async handleIncomingCall(offer: RTCSessionDescription, callId: string): Promise<void> {
    try {
      this.callId = callId;
      this.updateCallState({ isConnecting: true, callId });

      // Get user media
      await this.getUserMedia();

      if (this.peerConnection && this.localStream) {
        try {
          // Use addStream for better compatibility with react-native-webrtc
          if ('addStream' in this.peerConnection) {
            (this.peerConnection as any).addStream(this.localStream);
          } else {
            // Fallback to addTrack if addStream is not available
            this.localStream.getTracks().forEach((track: any) => {
              if (track && this.peerConnection) {
                this.peerConnection.addTrack(track, this.localStream!);
              }
            });
          }
          
          await this.peerConnection.setRemoteDescription(offer);

          // Create answer
          const answer = await this.peerConnection.createAnswer();
          await this.peerConnection.setLocalDescription(answer);

          // Send answer back
          if (this.socket) {
            this.socket.emit('call-answer', {
              answer,
              callId: this.callId,
            });
          }
        } catch (trackError) {
          console.warn('Error adding tracks or handling offer:', trackError);
          // Continue with call even if track addition fails
        }
      }
    } catch (error) {
      this.handleError('Failed to handle incoming call', error);
    }
  }

  // Handle call answer
  private async handleCallAnswer(answer: RTCSessionDescription): Promise<void> {
    try {
      if (this.peerConnection) {
        await this.peerConnection.setRemoteDescription(answer);
      }
    } catch (error) {
      this.handleError('Failed to handle call answer', error);
    }
  }

  // Handle ICE candidate
  private async handleIceCandidate(candidate: RTCIceCandidate): Promise<void> {
    try {
      if (this.peerConnection) {
        await this.peerConnection.addIceCandidate(candidate);
      }
    } catch (error) {
      console.warn('Failed to add ICE candidate:', error);
    }
  }

  // Get user media (camera and microphone)
  private async getUserMedia(): Promise<void> {
    try {
      // Use simpler constraints to avoid compatibility issues
      const stream = await mediaDevices.getUserMedia();

      if (stream) {
        this.localStream = stream;
        // Initialize track states
        const audioTracks = stream.getAudioTracks();
        const videoTracks = stream.getVideoTracks();
        
        this.isMuted = audioTracks.length > 0 ? !audioTracks[0].enabled : false;
        this.isVideoEnabled = videoTracks.length > 0 ? videoTracks[0].enabled : true;
        
        this.updateCallState();
      } else {
        throw new Error('No media stream received');
      }
    } catch (error) {
      this.handleError('Failed to access camera/microphone. Please check permissions.', error);
    }
  }

  // Toggle microphone
  toggleMicrophone(): void {
    if (this.localStream) {
      const audioTracks = this.localStream.getAudioTracks();
      audioTracks.forEach((track: any) => {
        if (track && typeof track.enabled !== 'undefined') {
          track.enabled = !track.enabled;
        }
      });
      
      this.isMuted = !this.isMuted;
      this.updateCallState({ isMuted: this.isMuted });
    }
  }

  // Toggle camera
  toggleCamera(): void {
    if (this.localStream) {
      const videoTracks = this.localStream.getVideoTracks();
      videoTracks.forEach((track: any) => {
        if (track && typeof track.enabled !== 'undefined') {
          track.enabled = !track.enabled;
        }
      });
      
      this.isVideoEnabled = !this.isVideoEnabled;
      this.updateCallState({ isVideoEnabled: this.isVideoEnabled });
    }
  }

  // End the call
  endCall(): void {
    try {
      // Stop local stream
      if (this.localStream) {
        this.localStream.getTracks().forEach((track: any) => track.stop());
        this.localStream = null;
      }

      // Close peer connection
      if (this.peerConnection) {
        this.peerConnection.close();
        this.peerConnection = null;
      }

      // Notify server
      if (this.socket && this.callId) {
        this.socket.emit('end-call', { callId: this.callId });
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
      isConnected: this.peerConnection?.connectionState === 'connected',
      isConnecting: this.callId !== null && this.peerConnection?.connectionState !== 'connected',
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
    console.error('WebRTC Error:', message, error);
    
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
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Get current call state
  getCallState(): CallState {
    return {
      isConnected: this.peerConnection?.connectionState === 'connected',
      isConnecting: this.callId !== null && this.peerConnection?.connectionState !== 'connected',
      isMuted: this.isMuted,
      isVideoEnabled: this.isVideoEnabled,
      localStream: this.localStream,
      remoteStream: this.remoteStream,
      callId: this.callId,
      error: null,
    };
  }
}

// Default configuration
export const defaultWebRTCConfig: WebRTCConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    // Add your TURN server with your external IP
    { 
      urls: [
        "turn:34.131.151.104:3478?transport=udp",
        "turn:34.131.151.104:3478?transport=tcp"
      ],
      username: "carebuddy",
      credential: "StrongPassword123"
    },
    { 
      urls: `turns:34.131.151.104:5349`, 
      username: "carebuddy", 
      credential: "StrongPassword123" 
    },
  ],
  signalingServerUrl: 'https://34.131.151.104:3000', // Your signaling server URL
};

// Export RTCView for use in components (conditional)
export { RTCView };
