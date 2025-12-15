import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/ui/Button';
import { isValidFutureDate } from '../utils/validation';

const BookingScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { doctor } = route.params || {};

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [dates, setDates] = useState<Date[]>([]);

  useEffect(() => {
    // Generate next 14 days
    const nextDays = [];
    const today = new Date();

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      nextDays.push(date);
    }
    setDates(nextDays);
  }, []);

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  ];

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleDateSelect = (date: Date) => {
    if (!isValidFutureDate(date)) {
      Alert.alert('Invalid Date', 'Please select a future date');
      return;
    }
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
  };

  const handleContinue = () => {
    if (!selectedDate) {
      Alert.alert('Select Date', 'Please select a date for your appointment');
      return;
    }

    if (!selectedTime) {
      Alert.alert('Select Time', 'Please select a time slot');
      return;
    }

    // Double-check date is still valid (edge case: user selected near midnight)
    if (!isValidFutureDate(selectedDate)) {
      Alert.alert('Invalid Date', 'The selected date is no longer valid. Please select another date.');
      return;
    }

    navigation.navigate('Checkout', {
      bookingData: {
        doctor,
        date: selectedDate.toISOString(),
        time: selectedTime,
      },
    });
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
            {dates.map((date, index) => {
              const isSelected = selectedDate ? date.toDateString() === selectedDate.toDateString() : false;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleDateSelect(date)}
                  className={`mr-3 p-4 rounded-xl items-center ${isSelected ? 'bg-primary' : 'bg-white'
                    }`}
                  style={{ width: 80 }}
                >
                  <Text className={`text-xs ${isSelected ? 'text-white' : 'text-muted'}`}>
                    {getDayName(date)}
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
              const isSelected = selectedTime === time;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedTime(time)}
                  className={`mr-3 mb-3 px-6 py-3 rounded-full border ${isSelected
                      ? 'bg-primary border-primary'
                      : 'bg-white border-gray-200'
                    }`}
                >
                  <Text
                    className={`${isSelected ? 'text-white font-bold' : 'text-text'
                      }`}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
        <Button
          title="Continue to Checkout"
          onPress={handleContinue}
          disabled={!selectedDate || !selectedTime}
        />
      </View>
    </SafeAreaView>
  );
};

export default BookingScreen;
