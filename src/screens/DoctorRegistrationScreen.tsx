import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const DoctorRegistrationScreen = () => {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [license, setLicense] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !specialty || !license || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);

      // Create auth account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Create doctor profile in Firestore
      try {
        await setDoc(doc(db, 'doctors', userCredential.user.uid), {
          id: userCredential.user.uid,
          name,
          email,
          specialty,
          license,
          rating: 0,
          reviews: 0,
          about: `Experienced ${specialty} with excellent patient care.`,
          experience: 5,
          fees: 100,
          createdAt: new Date().getTime(),
        });

        Alert.alert(
          'Success',
          'Your doctor account has been created! You can now login.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } catch (firestoreError) {
        console.log('Firestore not ready, account created in Auth only:', firestoreError);
        Alert.alert(
          'Account Created',
          'Your account has been created. Please login.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      let message = 'Failed to register';
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already registered';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters';
      }
      Alert.alert('Registration Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
        <Text className="text-3xl font-bold text-secondary mb-2">Join as Doctor</Text>
        <Text className="text-muted mb-8">Fill in your details to apply.</Text>

        <Input label="Full Name" value={name} onChangeText={setName} placeholder="Dr. Jane Doe" />
        <Input label="Specialty" value={specialty} onChangeText={setSpecialty} placeholder="Cardiologist" />
        <Input label="Medical License Number" value={license} onChangeText={setLicense} placeholder="LIC-123456" />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="doctor@example.com"
        />
        <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="Min 6 characters" />

        <Button
          title="Submit Application"
          onPress={handleRegister}
          variant="secondary"
          className="mt-4"
          isLoading={loading}
        />

        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          variant="outline"
          className="mt-4"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DoctorRegistrationScreen;
