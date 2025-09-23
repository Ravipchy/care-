# Video Call Setup Guide

This guide will help you set up the WebRTC video calling feature in your CareBuddy app.

## Prerequisites

1. **Firebase Project**: You need a Firebase project with Firestore enabled
2. **Signaling Server**: A WebSocket server for signaling (optional - can use Firebase)
3. **TURN Servers**: For better connectivity through NATs (recommended for production)

## Setup Steps

### 1. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use existing one
3. Enable Firestore Database
4. Get your Firebase config
5. Update `src/services/FirebaseSignalingService.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 2. WebRTC Configuration

Update the signaling server URL in `src/services/WebRTCService.ts`:

```typescript
export const defaultWebRTCConfig: WebRTCConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    // Add your TURN servers here for better connectivity
    { 
      urls: 'turn:your-turn-server.com:3478', 
      username: 'your-username', 
      credential: 'your-password' 
    }
  ],
  signalingServerUrl: 'https://your-signaling-server.com', // Replace with your server
};
```

### 3. Optional: Signaling Server Setup

If you want to use a custom signaling server instead of Firebase:

#### Using Socket.io (Node.js)

```bash
npm install socket.io express cors
```

```javascript
// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('start-call', (data) => {
    socket.broadcast.emit('call-offer', data);
  });

  socket.on('call-answer', (data) => {
    socket.broadcast.emit('call-answer', data);
  });

  socket.on('ice-candidate', (data) => {
    socket.broadcast.emit('ice-candidate', data);
  });

  socket.on('end-call', (data) => {
    socket.broadcast.emit('call-ended', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});
```

### 4. TURN Server Setup (Recommended)

For production, set up TURN servers for better connectivity:

#### Using Coturn (Open Source)

```bash
# Install coturn
sudo apt-get install coturn

# Configure /etc/turnserver.conf
listening-port=3478
tls-listening-port=5349
listening-ip=0.0.0.0
external-ip=YOUR_SERVER_IP
realm=your-domain.com
server-name=your-domain.com
user=username:password
```

#### Using Cloud Services

- **Twilio STUN/TURN**: https://www.twilio.com/stun-turn
- **Xirsys**: https://xirsys.com/
- **AWS Kinesis Video Streams**: https://aws.amazon.com/kinesis/video-streams/

### 5. Testing the Video Call Feature

1. **Build and run the app**:
   ```bash
   npm start
   ```

2. **Test on two devices**:
   - Install the app on two different devices
   - Set one as patient (`isDoctor: false`) and one as doctor (`isDoctor: true`)
   - Start a video call from patient device
   - Accept the call on doctor device

3. **Test features**:
   - Camera on/off
   - Microphone mute/unmute
   - Call duration timer
   - Call end functionality
   - Error handling

### 6. Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **TURN Authentication**: Use proper authentication for TURN servers
3. **Firebase Security Rules**: Set up proper Firestore security rules
4. **Input Validation**: Validate all signaling messages
5. **Rate Limiting**: Implement rate limiting on signaling server

### 7. Troubleshooting

#### Common Issues:

1. **Camera/Mic not working**:
   - Check permissions in device settings
   - Ensure HTTPS is used
   - Test on physical device (not simulator)

2. **Connection failed**:
   - Check ICE server configuration
   - Verify TURN server credentials
   - Check network connectivity

3. **Firebase errors**:
   - Verify Firebase configuration
   - Check Firestore security rules
   - Ensure proper authentication

#### Debug Mode:

Enable debug logging in `WebRTCService.ts`:

```typescript
// Add this to see detailed logs
console.log('WebRTC Debug:', {
  connectionState: this.peerConnection?.connectionState,
  iceConnectionState: this.peerConnection?.iceConnectionState,
  localStream: !!this.localStream,
  remoteStream: !!this.remoteStream
});
```

### 8. Production Deployment

1. **Update URLs**: Replace all placeholder URLs with production URLs
2. **Configure TURN servers**: Set up production TURN servers
3. **Set up monitoring**: Monitor call quality and connection success rates
4. **Load testing**: Test with multiple concurrent calls
5. **Security audit**: Review all security configurations

## Features Implemented

✅ **WebRTC Peer-to-Peer Connection**
✅ **Camera and Microphone Controls**
✅ **Call Duration Timer**
✅ **Error Handling**
✅ **Responsive UI Design**
✅ **Firebase Signaling**
✅ **Permission Management**
✅ **Call State Management**
✅ **Secure ICE Servers**
✅ **Real-time Communication**

## Next Steps

1. Set up your Firebase project
2. Configure the signaling server URL
3. Test the video calling feature
4. Deploy to production with proper TURN servers
5. Monitor and optimize call quality

For any issues or questions, refer to the WebRTC documentation or create an issue in the repository.
