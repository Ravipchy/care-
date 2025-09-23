# Firebase Realtime Database Setup Guide for CareBuddy

## Current Setup: Expo Managed Workflow

Since you don't have an `android` folder, you're using Expo's managed workflow. This means we'll use the **Firebase Web SDK** instead of React Native Firebase.

## Step 1: Get Your Firebase Configuration

You have a `google-services.json` file. We need to extract the configuration from it.

### Open your `google-services.json` file and look for this structure:

```json
{
  "project_info": {
    "project_id": "your-project-id",
    "project_number": "123456789",
    "firebase_url": "https://your-project-default-rtdb.firebaseio.com"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "your-app-id"
      },
      "oauth_client": [
        {
          "client_id": "your-client-id",
          "client_type": 3
        }
      ],
      "api_key": [
        {
          "current_key": "your-api-key"
        }
      ],
      "services": {
        "appinvite_service": {
          "other_platform_oauth_client": [
            {
              "client_id": "your-web-client-id",
              "client_type": 3
            }
          ]
        }
      }
    }
  ]
}
```

## Step 2: Update Firebase Configuration

Replace the values in `src/config/firebase.ts` with your actual values:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key", // from current_key
  authDomain: "your-project-id.firebaseapp.com", // project_id + .firebaseapp.com
  databaseURL: "https://your-project-default-rtdb.firebaseio.com", // from firebase_url
  projectId: "your-project-id", // from project_id
  storageBucket: "your-project-id.appspot.com", // project_id + .appspot.com
  messagingSenderId: "123456789", // from project_number
  appId: "your-app-id" // from mobilesdk_app_id
};
```

## Step 3: Test Your Setup

1. Run your app: `npm start`
2. Add the `FirebaseRealtimeExample` component to any screen
3. Test sending messages and saving profiles

## Step 4: Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Realtime Database** in the left sidebar
4. Click **Create Database**
5. Choose your security rules (start with test mode for development)
6. Select a location for your database

## Step 5: Security Rules (Optional but Recommended)

In Firebase Console > Realtime Database > Rules, set up basic security:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    }
  }
}
```

## Available Features

✅ **Real-time Data Sync** - Changes appear instantly
✅ **User Profiles** - Store user information
✅ **Chat Messages** - Real-time messaging
✅ **Appointments** - Medical appointments
✅ **Offline Support** - Works offline and syncs when online

## Usage Examples

```typescript
import FirebaseRealtimeService from '../services/FirebaseRealtimeService';

// Save user profile
await FirebaseRealtimeService.saveUserProfile('user123', {
  name: 'John Doe',
  email: 'john@example.com'
});

// Listen to real-time data
const unsubscribe = FirebaseRealtimeService.getChatMessages('chat123', (messages) => {
  console.log('New messages:', messages);
});
```

## Next Steps

1. Update the Firebase configuration with your actual values
2. Test the setup with the example component
3. Integrate into your existing screens
4. Set up proper security rules

## If You Want to Use React Native Firebase Later

If you want to use the native React Native Firebase SDK (better performance, offline support), you'll need to:

1. Create a development build: `eas build --profile development --platform android`
2. This will create the `android` folder
3. Place your `google-services.json` in `android/app/google-services.json`
4. Switch back to React Native Firebase SDK

But for now, the web SDK will work perfectly for your needs!
