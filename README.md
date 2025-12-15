# Doctor App Rebuild

This is a complete rebuild of the Doctor Appointment App using modern React Native + Expo technologies.

## Tech Stack
- **Framework**: Expo SDK 50+ (Managed Workflow)
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS v3/v4)
- **Navigation**: React Navigation 7
- **Auth**: Firebase Auth (Context API)
- **Payment**: Stripe
- **Data**: React Query + Firestore

## Getting Started

### Prerequisites
- Node.js (v18+)
- Expo CLI (`npm install -g expo-cli`)

### Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm ci
    ```
3.  Setup Environment Variables:
    Copy `.env.example` to `.env` and fill in your Firebase and Stripe keys.
    ```bash
    cp .env.example .env
    ```

### Running the App

- **Start Development Server**:
    ```bash
    npx expo start
    ```
    Press `a` for Android, `i` for iOS (simulator required).

- **Run Tests**:
    ```bash
    npm test
    ```

- **Type Check**:
    ```bash
    npx tsc --noEmit
    ```

## Building for Production (EAS)

1.  Install EAS CLI: `npm install -g eas-cli`
2.  Login: `eas login`
3.  Configure Build: `eas build:configure`
4.  Run Build:
    ```bash
    eas build --platform android --profile preview
    ```

## Project Structure

- `src/components`: Reusable UI tokens (Card, Button, Input)
- `src/screens`: All app screens
- `src/navigation`: Navigators (Auth, Tab, Root)
- `src/services`: Firebase and Stripe helpers
- `src/context`: React Contexts (Auth)

## Migration Notes

- **Styling**: Replaced StyleSheet with NativeWind (Tailwind).
- **Navigation**: Replicated Stack/Tab structure but used modern React Navigation 7 APIs.
- **Components**: Created atomic components for consistency.
- **Assets**: Used placeholder icons (Ionicons) where images were missing.

## License
MIT
