import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { createBooking } from '../services/booking';
import { useAuth } from '../context/AuthContext';

const CheckoutScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { bookingData } = route.params || {};
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleConfirmBooking = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to book an appointment');
      return;
    }

    try {
      setLoading(true);

      const bookingId = await createBooking({
        doctorId: bookingData.doctor.id,
        doctorName: bookingData.doctor.name,
        date: bookingData.date,
        time: bookingData.time,
      });

      navigation.navigate('Confirm', { bookingId });
    } catch (error: any) {
      console.error('Booking error:', error);
      Alert.alert('Booking Failed', error.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-lg text-muted">No booking data</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} className="mt-4" />
      </SafeAreaView>
    );
  }

  const { doctor, date, time } = bookingData;
  const consultationFee = doctor.fees || 100;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        <Text className="text-2xl font-bold text-text mb-6">Checkout</Text>

        {/* Booking Summary */}
        <Card className="mb-4">
          <Text className="text-lg font-bold text-text mb-3">Appointment Details</Text>
          <View className="space-y-2">
            <View className="flex-row justify-between py-2 border-b border-gray-100">
              <Text className="text-muted">Doctor</Text>
              <Text className="font-semibold text-text">{doctor.name}</Text>
            </View>
            <View className="flex-row justify-between py-2 border-b border-gray-100">
              <Text className="text-muted">Specialty</Text>
              <Text className="font-semibold text-text">{doctor.specialty}</Text>
            </View>
            <View className="flex-row justify-between py-2 border-b border-gray-100">
              <Text className="text-muted">Date</Text>
              <Text className="font-semibold text-text">{new Date(date).toLocaleDateString()}</Text>
            </View>
            <View className="flex-row justify-between py-2">
              <Text className="text-muted">Time</Text>
              <Text className="font-semibold text-text">{time}</Text>
            </View>
          </View>
        </Card>

        {/* Payment Summary */}
        <Card className="mb-4">
          <Text className="text-lg font-bold text-text mb-3">Payment Summary</Text>
          <View className="flex-row justify-between py-2 border-b border-gray-100">
            <Text className="text-muted">Consultation Fee</Text>
            <Text className="font-semibold text-text">${consultationFee}</Text>
          </View>
          <View className="flex-row justify-between py-2 mt-2">
            <Text className="text-lg font-bold text-text">Total</Text>
            <Text className="text-lg font-bold text-primary">${consultationFee}</Text>
          </View>
        </Card>

        <Card className="bg-blue-50 border border-blue-200">
          <Text className="text-sm text-blue-800">
            💡 For demo purposes, payment is simulated. In production, this would integrate with Stripe.
          </Text>
        </Card>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white p-6 border-t border-gray-200">
        <Button
          title={loading ? "Processing..." : "Confirm & Pay"}
          onPress={handleConfirmBooking}
          isLoading={loading}
          className="w-full"
        />
      </View>
    </SafeAreaView>
  );
};

export default CheckoutScreen;
