import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const DoctorLogin = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Check if user is a doctor
      try {
        const doctorDoc = await getDoc(doc(db, 'doctors', userCredential.user.uid));

        if (!doctorDoc.exists()) {
          // User is not a doctor
          await auth.signOut();
          Alert.alert('Access Denied', 'This account is not registered as a doctor.');
        }
        // If doctor exists, AuthContext will auto-route to DoctorPanel
      } catch (error) {
        console.log('Firestore check failed:', error);
        Alert.alert('Error', 'Failed to verify doctor status. Please try again.');
        await auth.signOut();
      }
    } catch (error: any) {
      console.error('Login error:', error);
      let message = 'Failed to login';
      if (error.code === 'auth/invalid-credential') {
        message = 'Invalid email or password';
      } else if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email';
      }
      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }}>
        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-secondary/20 rounded-full items-center justify-center mb-4">
            <Text className="text-3xl">👨‍⚕️</Text>
          </View>
          <Text className="text-3xl font-bold text-secondary">Doctor Portal</Text>
          <Text className="text-muted mt-2">Manage your patients and schedule</Text>
        </View>

        <Input
          label="Doctor Email"
          placeholder="dr.smith@example.com"
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

        <Button
          title="Login to Dashboard"
          onPress={handleLogin}
          variant="secondary"
          className="mt-4"
          isLoading={loading}
        />

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-500">New Doctor? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('DoctorRegistration')}>
            <Text className="text-secondary font-bold">Apply Here</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center mt-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-gray-400">Back to Patient Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DoctorLogin;
