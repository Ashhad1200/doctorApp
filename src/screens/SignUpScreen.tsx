import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { isValidEmail, isValidPhone, isValidName, getPasswordStrength } from '../utils/validation';

const SignUpScreen = () => {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const validateForm = (): boolean => {
    const newErrors = {
      name: '',
      email: '',
      phone: '',
      password: '',
    };

    let isValid = true;

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (!isValidName(name)) {
      newErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Phone validation
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!isValidPhone(phone)) {
      newErrors.phone = 'Phone must be 10 digits';
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignUp = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Store additional user data in Firestore
      try {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name,
          email,
          phone,
          createdAt: new Date().getTime(),
        });
      } catch (firestoreError) {
        console.log('Firestore not ready, user profile not saved:', firestoreError);
      }

    } catch (error: any) {
      console.error('SignUp error:', error);
      let message = 'Failed to create account';
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already registered';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters';
      }
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }}>
        <View className="mb-8">
          <Text className="text-3xl font-bold text-text mb-2">Create Account</Text>
          <Text className="text-muted">Sign up to get started!</Text>
        </View>

        <View className="w-full">
          <View className="mb-6">
            <Text className="text-sm font-semibold text-text mb-2">Full Name</Text>
            <Input
              placeholder="Enter your name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
            />
            {errors.name ? (
              <Text className="text-red-500 text-xs mt-1">{errors.name}</Text>
            ) : null}
          </View>

          <View className="mb-6">
            <Text className="text-sm font-semibold text-text mb-2">Email</Text>
            <Input
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email ? (
              <Text className="text-red-500 text-xs mt-1">{errors.email}</Text>
            ) : null}
          </View>

          <View className="mb-6">
            <Text className="text-sm font-semibold text-text mb-2">Phone Number</Text>
            <Input
              placeholder="Enter 10-digit phone number"
              value={phone}
              onChangeText={(text) => {
                setPhone(text.replace(/\D/g, '').slice(0, 10));
                if (errors.phone) setErrors({ ...errors, phone: '' });
              }}
              keyboardType="phone-pad"
              maxLength={10}
            />
            {errors.phone ? (
              <Text className="text-red-500 text-xs mt-1">{errors.phone}</Text>
            ) : null}
          </View>

          <View className="mb-8">
            <Text className="text-sm font-semibold text-text mb-2">Password</Text>
            <Input
              placeholder="Enter password (min 6 characters)"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              secureTextEntry
            />
            {errors.password ? (
              <Text className="text-red-500 text-xs mt-1">{errors.password}</Text>
            ) : password.length > 0 ? (
              <View className="flex-row items-center mt-1">
                <Text className="text-xs text-muted">Password strength: </Text>
                <Text
                  className={`text-xs font-semibold ${getPasswordStrength(password) === 'weak'
                      ? 'text-red-500'
                      : getPasswordStrength(password) === 'medium'
                        ? 'text-yellow-500'
                        : 'text-green-500'
                    }`}
                >
                  {getPasswordStrength(password).toUpperCase()}
                </Text>
              </View>
            ) : null}
          </View>
          <Button
            title="Create Account"
            onPress={handleSignUp}
            className="mb-6"
            isLoading={loading}
          />

          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-500">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text className="text-primary font-bold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
