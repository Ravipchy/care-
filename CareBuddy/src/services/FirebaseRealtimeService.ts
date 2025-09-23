import { database } from '../config/firebase';
import { ref, set, get, onValue, update, push, remove, off } from 'firebase/database';

export class FirebaseRealtimeService {
  private db = database;

  // Write data to a specific path
  async writeData(path: string, data: any): Promise<void> {
    try {
      await set(ref(this.db, path), data);
      console.log('Data written successfully to:', path);
    } catch (error) {
      console.error('Error writing data:', error);
      throw error;
    }
  }

  // Read data from a specific path
  async readData(path: string): Promise<any> {
    try {
      const snapshot = await get(ref(this.db, path));
      return snapshot.val();
    } catch (error) {
      console.error('Error reading data:', error);
      throw error;
    }
  }

  // Listen to real-time changes
  listenToData(path: string, callback: (data: any) => void): () => void {
    const dbRef = ref(this.db, path);
    
    const onValueChange = onValue(dbRef, (snapshot) => {
      callback(snapshot.val());
    });

    // Return unsubscribe function
    return () => off(dbRef, 'value', onValueChange);
  }

  // Update specific fields
  async updateData(path: string, updates: any): Promise<void> {
    try {
      await update(ref(this.db, path), updates);
      console.log('Data updated successfully at:', path);
    } catch (error) {
      console.error('Error updating data:', error);
      throw error;
    }
  }

  // Push data to a list (generates unique key)
  async pushData(path: string, data: any): Promise<string> {
    try {
      const newRef = push(ref(this.db, path), data);
      console.log('Data pushed successfully to:', path);
      return newRef.key || '';
    } catch (error) {
      console.error('Error pushing data:', error);
      throw error;
    }
  }

  // Delete data
  async deleteData(path: string): Promise<void> {
    try {
      await remove(ref(this.db, path));
      console.log('Data deleted successfully from:', path);
    } catch (error) {
      console.error('Error deleting data:', error);
      throw error;
    }
  }

  // Example: User profile operations
  async saveUserProfile(userId: string, profileData: any): Promise<void> {
    return this.writeData(`users/${userId}`, profileData);
  }

  async getUserProfile(userId: string): Promise<any> {
    return this.readData(`users/${userId}`);
  }

  // Example: Chat messages
  async sendMessage(chatId: string, message: any): Promise<string> {
    return this.pushData(`chats/${chatId}/messages`, message);
  }

  getChatMessages(chatId: string, callback: (messages: any) => void): () => void {
    return this.listenToData(`chats/${chatId}/messages`, callback);
  }

  // Example: Appointments
  async createAppointment(appointmentData: any): Promise<string> {
    return this.pushData('appointments', appointmentData);
  }

  getUserAppointments(userId: string, callback: (appointments: any) => void): () => void {
    return this.listenToData(`appointments`, (data) => {
      if (data) {
        const userAppointments = Object.values(data).filter(
          (appointment: any) => appointment.userId === userId
        );
        callback(userAppointments);
      } else {
        callback([]);
      }
    });
  }
}

export default new FirebaseRealtimeService();
