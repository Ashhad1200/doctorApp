import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { isValidFutureDate } from '../utils/validation';

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
];

const BookingScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { doctor } = route.params || {};

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');

  // Generate next 14 days (excluding past dates)
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();

  const handleDateSelect = (date: Date) => {
    // Validate date is not in the past
    if (!isValidFutureDate(date)) {
      Alert.alert('Invalid Date', 'Please select a future date');
      return;
    }
    setSelectedDate(date);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handleContinue = () => {
    if (!selectedDate) {
      Alert.alert('Select Date', 'Please select a date for your appointment');
      return;
    }

    if (!selectedTime) {
      time: selectedTime,
    };

    navigation.navigate('Checkout', { bookingData });
  };

  if (!doctor) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-lg text-muted">No doctor selected</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} className="mt-4" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="bg-white p-6 mb-4">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mb-4">
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-text">Book Appointment</Text>
          <Text className="text-muted mt-1">with {doctor.name}</Text>
        </View>

        {/* Date Selection */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-text mb-3">Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {getNextDays().map((date, index) => {
              const isSelected = date.toDateString() === selectedDate.toDateString();
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedDate(date)}
                  className={`mr-3 p-4 rounded-xl items-center ${isSelected ? 'bg-primary' : 'bg-white'
                    }`}
                  style={{ width: 80 }}
                >
                  <Text className={`text-xs ${isSelected ? 'text-white' : 'text-muted'}`}>
                    {formatDay(date)}
                  </Text>
                  <Text className={`text-lg font-bold mt-1 ${isSelected ? 'text-white' : 'text-text'}`}>
                    {date.getDate()}
                  </Text>
                  <Text className={`text-xs ${isSelected ? 'text-white/80' : 'text-muted'}`}>
                    {formatDate(date).split(' ')[0]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Time Slots */}
        <View className="px-6">
          <Text className="text-lg font-bold text-text mb-3">Select Time</Text>
          <View className="flex-row flex-wrap">
            {timeSlots.map((time, index) => {
              const isSelected = time === selectedTime;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedTime(time)}
                  className={`mr-3 mb-3 px-4 py-3 rounded-lg ${isSelected ? 'bg-primary' : 'bg-white'
                    }`}
                >
                  <Text className={`font-semibold ${isSelected ? 'text-white' : 'text-text'}`}>
                    {time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white p-6 border-t border-gray-200">
        <Button
          title="Continue to Payment"
          onPress={handleContinue}
          className="w-full"
        />
      </View>
    </SafeAreaView>
  );
};

export default BookingScreen;
