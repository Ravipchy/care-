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
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  callId: string | null;
  error: string | null;
}

export class WebRTCServiceFixed {
  private socket: Socket | null = null;
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
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

  // Initialize peer connection with minimal configuration
  private async initializePeerConnection(): Promise<void> {
    try {
      // Use minimal configuration to avoid compatibility issues
      const config = {
        iceServers: this.config.iceServers,
      };

      this.peerConnection = new RTCPeerConnection(config) as any;
      this.setupPeerConnectionListeners();
    } catch (error) {
      this.handleError('Failed to create peer connection', error);
    }
  }

  // Set up peer connection event listeners
  private setupPeerConnectionListeners(): void {
    if (!this.peerConnection) return;

    // Use type assertion to avoid TypeScript errors
    const pc = this.peerConnection as any;

    pc.onicecandidate = (event: any) => {
      if (event.candidate && this.socket) {
        this.socket.emit('ice-candidate', {
          candidate: event.candidate,
          callId: this.callId,
        });
      }
    };

    // Use onaddstream for better compatibility
    pc.onaddstream = (event: any) => {
      console.log('Remote stream added');
      this.remoteStream = event.stream;
      this.updateCallState();
    };

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
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

      // Get user media first
      await this.getUserMedia();

      // Create offer
      if (this.peerConnection && this.localStream) {
        // Use addStream for better compatibility
        const pc = this.peerConnection as any;
        if (pc.addStream) {
          pc.addStream(this.localStream);
        }
        
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);

        // Send offer to doctor
        if (this.socket) {
          this.socket.emit('start-call', {
            offer,
            callId: this.callId,
            doctorId,
          });
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
        // Use addStream for better compatibility
        const pc = this.peerConnection as any;
        if (pc.addStream) {
          pc.addStream(this.localStream);
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

  // Get user media with minimal constraints
  private async getUserMedia(): Promise<void> {
    try {
      // Use the most basic constraints possible
      const stream = await mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (stream) {
        this.localStream = stream as any;
        // Initialize track states safely
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
      audioTracks.forEach(track => {
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
      videoTracks.forEach(track => {
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
        this.localStream.getTracks().forEach(track => track.stop());
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
export const defaultWebRTCConfigFixed: WebRTCConfig = {
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

// Export RTCView for use in components
export { RTCView };
