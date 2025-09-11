# CareBuddy - Complete Healthcare App

A comprehensive healthcare companion app built with React Native and Expo, featuring all the functionality you requested.

## 🚀 Features

### Core Pages
- **Home** - Hero section with service shortcuts
- **Reports** - Upload and view health reports
- **Appointments** - Book, view, and reschedule appointments
- **Messages** - Chat with healthcare providers
- **Settings** - Account management and preferences

### Additional Services
- **Profile** - Edit personal information and profile photo
- **Medical History** - Complete health records management
- **Lab Tests** - Book medical tests online
- **Ambulance** - Emergency medical transportation
- **Home Care** - Professional healthcare at home
- **Telemedicine** - Video calls and chat with doctors
- **About Us** - App information and contact details

### Navigation
- **Bottom Tabs** - Home, Reports, Appointments, Messages, Settings
- **Drawer Menu** - Access to all services with logout option
- **Auto-routing** - Welcome screen → Dashboard after 2 seconds

## 📱 Project Configuration

### App Details
- **Name**: CareBuddy
- **Android Package**: com.ravipchy.carebuddy
- **iOS Bundle ID**: com.ravipchy.carebuddy
- **Logo**: ./assets/images/carebuddy-logo.png
- **Splash Screen**: Auto-routes to dashboard

### Dependencies Installed
- React Navigation (Bottom Tabs + Drawer + Stack)
- Firebase (Authentication & Firestore)
- Google Maps integration
- Expo Vector Icons
- Safe Area Context
- Gesture Handler
- Reanimated

## 🛠 Setup Instructions

### 1. Install Dependencies
```bash
cd CareBuddy
npm install
```

### 2. Configure Firebase
1. Create Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication and Firestore
3. Get your Firebase config
4. Update `src/config/firebase.ts` with your configuration

### 3. Configure Google Maps
1. Get Google Maps API key from [Google Cloud Console](https://console.cloud.google.com)
2. Enable required APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API
   - Geocoding API
3. Update `app.json` with your API key:
   - Replace `YOUR_GOOGLE_MAPS_API_KEY` in both iOS and Android config

### 4. Run the App
```bash
# Development server
npm start

# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## 🏗 Build for Production

### Android APK (Preview)
```bash
npm run build:android:preview
# or
npx eas build -p android --profile preview
```

### Android AAB (Play Store)
```bash
npm run build:android:production
# or
npx eas build -p android --profile production
```

### iOS (App Store)
```bash
npm run build:ios:production
# or
npx eas build -p ios --profile production
```

## 📁 Project Structure

```
src/
├── config/
│   └── firebase.ts          # Firebase configuration
├── navigation/
│   ├── AppNavigator.tsx     # Main stack navigator
│   ├── DrawerNavigator.tsx  # Drawer navigation
│   └── TabNavigator.tsx     # Bottom tab navigation
├── screens/
│   ├── WelcomeScreen.tsx    # Splash screen with auto-routing
│   ├── HomeScreen.tsx       # Main dashboard
│   ├── ReportsScreen.tsx    # Health reports
│   ├── AppointmentsScreen.tsx # Appointment management
│   ├── MessagesScreen.tsx   # Chat with doctors
│   ├── SettingsScreen.tsx   # Account settings
│   ├── ProfileScreen.tsx    # User profile
│   ├── MedicalHistoryScreen.tsx # Health records
│   ├── LabTestScreen.tsx    # Lab test booking
│   ├── AmbulanceScreen.tsx  # Emergency services
│   ├── HomeCareScreen.tsx   # Home care services
│   ├── TelemedicineScreen.tsx # Video consultations
│   └── AboutUsScreen.tsx    # App information
├── types/
│   └── navigation.ts        # TypeScript navigation types
└── utils/                   # Utility functions
```

## 🎨 Design Features

### UI/UX
- **Clean Design** - Professional healthcare app appearance
- **Consistent Styling** - Unified design system across all pages
- **Hero Sections** - Fixed design on all main pages
- **Large Buttons** - Easy-to-tap interface elements
- **High Contrast** - Readable text and clear visual hierarchy
- **Icons** - Intuitive Ionicons throughout the app

### Navigation
- **Bottom Tabs** - Always visible main navigation
- **Drawer Menu** - Access to all services
- **Clean Headers** - No duplicate or annoying UI elements
- **Proper Routing** - Stack + Tabs + Drawer navigation

## 🔧 Configuration Files

### app.json
- Android package and iOS bundle identifier
- Google Maps API key configuration
- App icon and splash screen setup
- EAS project ID

### eas.json
- Preview profile for APK builds
- Production profile for Play Store AAB builds
- Development profile for testing

## 🚀 Ready to Build

The app is completely configured and ready for production:

1. **All pages created** with consistent design
2. **Navigation working** with bottom tabs and drawer
3. **EAS configured** for APK/AAB builds
4. **Firebase ready** for authentication
5. **Google Maps ready** for location services
6. **TypeScript configured** for type safety

## 📞 Support

For issues and questions, please check the Expo documentation or create an issue in this repository.

---

**CareBuddy** - Your comprehensive health companion! 🏥💙
