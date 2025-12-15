import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { Page } from '../components/shared/Page'; // New import
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { SafeAreaView } from 'react-native-safe-area-context'; // Kept for SafeAreaView
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Kept for navigation type
import { RootStackParamList } from '../types/navigation'; // Kept for navigation type

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>; // Kept for navigation type

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>(); // Changed to <NavigationProp>
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields'); // Updated message
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      // AuthContext will detect change and App structure might redirect, 
      // but here we manually navigate if needed or rely on a Listener in RootNavigator.
      // For this scaffold, we manually navigate to Main.
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }}>
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-primary/20 rounded-full items-center justify-center mb-4">
            <Text className="text-4xl">🩺</Text>
          </View>
          <Text className="text-3xl font-bold text-text">Welcome Back</Text>
          <Text className="text-muted mt-2">Sign in to your account</Text>
        </View>

        <View className="w-full">
          <Input
            label="Email"
            placeholder="john@example.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Input
            label="Password"
            placeholder="********"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity onPress={() => { /* Forgot password */ }} className="self-end mb-6">
            <Text className="text-primary font-semibold">Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            title="Login"
            onPress={handleLogin}
            className="mb-6"
            isLoading={loading}
          />

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-500">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Auth', { screen: 'SignUp' } as any)}>
              <Text className="text-primary font-bold">Sign Up</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-500">Are you a doctor? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Auth', { screen: 'DoctorLogin' } as any)}>
              <Text className="text-secondary font-bold">Login Here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
