import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/ui/Button';

const ConfirmScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { bookingId } = route.params || {};

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-6">
          <Ionicons name="checkmark-circle" size={60} color="#10b981" />
        </View>

        <Text className="text-2xl font-bold text-text mb-2 text-center">
          Booking Confirmed!
        </Text>
        <Text className="text-muted text-center mb-8">
          Your appointment has been successfully booked.
        </Text>

        {bookingId && (
          <View className="bg-gray-50 p-4 rounded-lg mb-6 w-full">
            <Text className="text-xs text-muted text-center">Booking ID</Text>
            <Text className="text-sm font-mono text-text text-center mt-1">{bookingId}</Text>
          </View>
        )}

        <Button
          title="View Appointments"
          onPress={() => navigation.navigate('Main', { screen: 'Appointments' })}
          className="w-full mb-3"
        />
        <Button
          title="Back to Home"
          onPress={() => navigation.navigate('Main', { screen: 'Home' })}
          variant="outline"
          className="w-full"
        />
      </View>
      <Text className="text-2xl font-bold text-text text-center mb-2">Booking Confirmed!</Text>
      <Text className="text-muted text-center mb-8">Your appointment has been successfully booked. You will receive a confirmation email shortly.</Text>

      <Button title="Go to Home" onPress={() => navigation.navigate('Main')} className="w-full" />
    </SafeAreaView>
  );
};

export default ConfirmScreen;
