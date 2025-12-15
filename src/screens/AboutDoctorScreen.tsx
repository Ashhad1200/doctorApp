import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { getDoctorById, Doctor } from '../services/doctors';

const AboutDoctorScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { doctorId } = route.params || {};

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctor();
  }, [doctorId]);

  const loadDoctor = async () => {
    try {
      setLoading(true);
      const fetchedDoctor = await getDoctorById(doctorId);
      setDoctor(fetchedDoctor);
    } catch (error) {
      console.error('Error loading doctor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = () => {
    if (doctor) {
      navigation.navigate('Booking', { doctor });
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#059669" />
      </SafeAreaView>
    );
  }

  if (!doctor) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-lg text-muted">Doctor not found</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} className="mt-4" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="bg-primary p-6 rounded-b-3xl">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute top-4 left-4 bg-white/50 p-2 rounded-full"
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View className="px-6 py-6 -mt-6 bg-white rounded-t-3xl">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-2xl font-bold text-text">Dr. John Doe</Text>
            <View className="flex-row items-center bg-blue-50 px-2 py-1 rounded">
              <Ionicons name="star" size={16} color="#FBBF24" />
              <Text className="ml-1 font-bold text-secondary">4.8</Text>
            </View>
          </View>
          <Text className="text-muted text-base mb-4">Cardiologist - New York Hospital</Text>

          <Text className="text-lg font-bold text-text mb-2">About</Text>
          <Text className="text-gray-500 leading-6 mb-6">
            Dr. John Doe is a highly experienced cardiologist with over 15 years of experience in treating heart diseases. He is known for his patient-centric approach and has performed numerous successful surgeries.
          </Text>

          <View className="flex-row justify-between mb-8">
            <View className="items-center bg-gray-50 p-4 rounded-xl flex-1 mr-2">
              <Text className="font-bold text-xl text-primary">100+</Text>
              <Text className="text-xs text-muted">Patients</Text>
            </View>
            <View className="items-center bg-gray-50 p-4 rounded-xl flex-1 mx-2">
              <Text className="font-bold text-xl text-primary">15+</Text>
              <Text className="text-xs text-muted">Exp. Years</Text>
            </View>
            <View className="items-center bg-gray-50 p-4 rounded-xl flex-1 ml-2">
              <Text className="font-bold text-xl text-primary">4.8</Text>
              <Text className="text-xs text-muted">Rating</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="p-4 border-t border-gray-100">
        <Button title="Book Appointment" onPress={() => navigation.navigate('Booking', { doctorId })} />
      </View>
    </SafeAreaView>
  );
};

export default AboutDoctorScreen;
