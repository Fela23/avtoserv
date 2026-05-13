# React Native App

## Installation

### Prerequisites
- Node.js >= 18
- npm or yarn
- React Native CLI: `npm install -g react-native-cli`
- For iOS: Xcode (macOS only)
- For Android: Android Studio with SDK

### Setup

```bash
# Install dependencies
npm install

# iOS only
cd ios && pod install && cd ..

# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## Environment Variables

Create `.env` file in root:

```
API_BASE_URL=https://localhost:7002/api
SIGNALR_HUB_URL=https://localhost:7002/hubs
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Screen components
├── services/       # API and SignalR services
├── store/          # State management (Zustand)
├── types/          # TypeScript types
├── hooks/          # Custom hooks
├── assets/         # Images, fonts
└── navigation/     # Navigation configuration
```
