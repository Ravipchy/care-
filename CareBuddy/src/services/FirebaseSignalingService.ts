import { collection, doc, addDoc, onSnapshot, deleteDoc, query, where, orderBy, limit, updateDoc, getDoc, getDocs, writeBatch } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { db, auth } from '../config/firebase';

export interface SignalingMessage {
  id?: string;
  type: 'offer' | 'answer' | 'ice-candidate' | 'call-start' | 'call-end' | 'call-join';
  from: string;
  to: string;
  callId: string;
  data: any;
  timestamp: Date;
}

export interface CallSession {
  id: string;
  doctorId: string;
  patientId: string;
  status: 'waiting' | 'active' | 'ended';
  createdAt: Date;
  endedAt?: Date;
}

export class FirebaseSignalingService {
  private currentUser: User | null = null;
  private callListeners: Map<string, () => void> = new Map();

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
    });
  }

  // Get current user ID
  private getCurrentUserId(): string {
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }
    return this.currentUser.uid;
  }

  // Create a new call session
  async createCallSession(doctorId: string): Promise<string> {
    try {
      const patientId = this.getCurrentUserId();
      
      const callSession: Omit<CallSession, 'id'> = {
        doctorId,
        patientId,
        status: 'waiting',
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'callSessions'), callSession);
      return docRef.id;
    } catch (error) {
      console.error('Error creating call session:', error);
      throw new Error('Failed to create call session');
    }
  }

  // Join an existing call session
  async joinCallSession(callId: string): Promise<CallSession> {
    try {
      const callDoc = doc(db, 'callSessions', callId);
      
      // Update status to active
      await updateDoc(callDoc, {
        status: 'active',
      });

      // Return the call session
      const callSnapshot = await getDoc(callDoc);
      if (callSnapshot.exists()) {
        return { id: callSnapshot.id, ...callSnapshot.data() } as CallSession;
      } else {
        throw new Error('Call session not found');
      }
    } catch (error) {
      console.error('Error joining call session:', error);
      throw new Error('Failed to join call session');
    }
  }

  // Send signaling message
  async sendSignalingMessage(message: Omit<SignalingMessage, 'id' | 'timestamp'>): Promise<void> {
    try {
      const signalingMessage: Omit<SignalingMessage, 'id'> = {
        ...message,
        timestamp: new Date(),
      };

      await addDoc(collection(db, 'signalingMessages'), signalingMessage);
    } catch (error) {
      console.error('Error sending signaling message:', error);
      throw new Error('Failed to send signaling message');
    }
  }

  // Listen for signaling messages
  listenForSignalingMessages(
    callId: string,
    onMessage: (message: SignalingMessage) => void
  ): () => void {
    const q = query(
      collection(db, 'signalingMessages'),
      where('callId', '==', callId),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const message = { id: change.doc.id, ...change.doc.data() } as SignalingMessage;
          onMessage(message);
        }
      });
    });

    // Store unsubscribe function
    this.callListeners.set(callId, unsubscribe);

    return unsubscribe;
  }

  // Listen for incoming calls (for doctors)
  listenForIncomingCalls(
    doctorId: string,
    onIncomingCall: (callSession: CallSession) => void
  ): () => void {
    const q = query(
      collection(db, 'callSessions'),
      where('doctorId', '==', doctorId),
      where('status', '==', 'waiting'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const callSession = { id: change.doc.id, ...change.doc.data() } as CallSession;
          onIncomingCall(callSession);
        }
      });
    });

    return unsubscribe;
  }

  // End call session
  async endCallSession(callId: string): Promise<void> {
    try {
      const callDoc = doc(db, 'callSessions', callId);
      
      await updateDoc(callDoc, {
        status: 'ended',
        endedAt: new Date(),
      });

      // Clean up signaling messages
      await this.cleanupSignalingMessages(callId);
    } catch (error) {
      console.error('Error ending call session:', error);
      throw new Error('Failed to end call session');
    }
  }

  // Clean up signaling messages for a call
  private async cleanupSignalingMessages(callId: string): Promise<void> {
    try {
      const q = query(
        collection(db, 'signalingMessages'),
        where('callId', '==', callId)
      );

      const snapshot = await getDocs(q);
      const batch = writeBatch(db);

      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    } catch (error) {
      console.error('Error cleaning up signaling messages:', error);
    }
  }

  // Stop listening for a specific call
  stopListening(callId: string): void {
    const unsubscribe = this.callListeners.get(callId);
    if (unsubscribe) {
      unsubscribe();
      this.callListeners.delete(callId);
    }
  }

  // Cleanup all listeners
  cleanup(): void {
    this.callListeners.forEach((unsubscribe) => unsubscribe());
    this.callListeners.clear();
  }
}

// Export singleton instance
export const firebaseSignalingService = new FirebaseSignalingService();
