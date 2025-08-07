# FinalPoint Mobile App

A React Native mobile application for the F1 Prediction Game.

## Features

- **User Authentication**: Sign up and login functionality
- **League Management**: Create and join F1 prediction game
- **P10 Predictions**: Make weekly predictions for which driver will finish in 10th place
- **Real-time Updates**: View league standings and pick status
- **Modern UI**: Clean, intuitive mobile interface

## Tech Stack

- **React Native**: Cross-platform mobile development
- **TypeScript**: Type-safe development
- **React Navigation**: Navigation between screens
- **Axios**: HTTP client for API communication
- **AsyncStorage**: Local data persistence
- **React Native Elements**: UI component library

## Project Structure

```
src/
├── components/          # Reusable UI components
├── context/            # React Context providers
├── screens/            # Screen components
├── services/           # API services
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Install iOS dependencies (macOS only):
```bash
cd ios && pod install && cd ..
```

3. Start the Metro bundler:
```bash
npm start
```

4. Run on Android:
```bash
npm run android
```

5. Run on iOS (macOS only):
```bash
npm run ios
```

## API Configuration

Update the API base URL in `src/services/apiService.ts`:

```typescript
const API_BASE_URL = 'http://your-api-url:6075/api';
```

## Development

### Available Scripts

- `npm start`: Start Metro bundler
- `npm run android`: Run on Android device/emulator
- `npm run ios`: Run on iOS simulator (macOS only)
- `npm test`: Run tests
- `npm run lint`: Run ESLint

### Code Style

This project uses:
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting

## Building for Production

### Android

1. Generate a signed APK:
```bash
cd android && ./gradlew assembleRelease
```

2. Or build an AAB for Google Play:
```bash
cd android && ./gradlew bundleRelease
```

### iOS

1. Open the project in Xcode
2. Select your target device
3. Product → Archive
4. Distribute App

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 