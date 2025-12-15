import 'react-native-gesture-handler';
import './global.css';
import React, { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_600SemiBold,
  OpenSans_700Bold,
} from '@expo-google-fonts/open-sans';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StripeProvider } from '@stripe/stripe-react-native';

const queryClient = new QueryClient();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
  });

  console.log("App: Rendering. fontsLoaded:", fontsLoaded);

  const onLayoutRootView = useCallback(async () => {
    console.log("App: onLayoutRootView called. fontsLoaded:", fontsLoaded);
    if (fontsLoaded) {
      console.log("App: Hiding splash screen...");
      try {
        await SplashScreen.hideAsync();
        console.log("App: Splash screen hidden.");
      } catch (e) {
        console.error("App: Error hiding splash screen:", e);
      }
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''}>
            <NavigationContainer>
              <RootNavigator />
              <StatusBar style="auto" />
            </NavigationContainer>
          </StripeProvider>
        </QueryClientProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
