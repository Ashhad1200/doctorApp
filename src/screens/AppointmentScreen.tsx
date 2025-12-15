import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { ListSkeleton } from '../components/ui/Skeleton';
import { subscribeToMyBookings, cancelBooking, BookingData } from '../services/booking';
import { useAuth } from '../context/AuthContext';

const AppointmentScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time subscription to bookings
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    console.log('AppointmentScreen: Setting up real-time bookings subscription');
    const unsubscribe = subscribeToMyBookings(
      (updatedBookings) => {
        console.log('AppointmentScreen: Received booking update:', updatedBookings.length);
        setBookings(updatedBookings);
        setLoading(false);
      },
      (error) => {
        console.error('AppointmentScreen: Error in subscription:', error);
        if (error.message !== 'User not authenticated') {
          Alert.alert('Error', 'Failed to load appointments');
        }
        setLoading(false);
      }
    );

    return () => {
      console.log('AppointmentScreen: Cleaning up bookings subscription');
      unsubscribe();
    };
  }, [user]);

  const handleCancelBooking = (bookingId: string) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelBooking(bookingId);
              // No need to manually refresh - real-time subscription will update automatically
              Alert.alert('Success', 'Appointment cancelled successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel appointment');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderBooking = (booking: BookingData) => (
    <Card key={booking.id} className="mb-4">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-lg font-bold text-text">{booking.doctorName}</Text>
          <Text className="text-sm text-muted">{booking.doctorId}</Text>
        </View>
        <View className={`px-3 py-1 rounded-full ${getStatusColor(booking.status)}`}>
          <Text className="text-xs font-semibold capitalize">{booking.status}</Text>
        </View>
      </View>

      <View className="flex-row items-center mb-2">
        <Ionicons name="calendar-outline" size={16} color="#6b7280" />
        <Text className="text-sm text-muted ml-2">
          {new Date(booking.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
      </View>

      <View className="flex-row items-center mb-3">
        <Ionicons name="time-outline" size={16} color="#6b7280" />
        <Text className="text-sm text-muted ml-2">{booking.time}</Text>
      </View>

      {booking.status !== 'cancelled' && (
        <Button
          title="Cancel Appointment"
          variant="outline"
          onPress={() => handleCancelBooking(booking.id!)}
          className="mt-2"
        />
      )}
    </Card>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="p-6 bg-primary">
          <Text className="text-white text-2xl font-bold">My Appointments</Text>
        </View>
        <ScrollView contentContainerStyle={{ padding: 24 }}>
          <ListSkeleton count={3} type="appointment" />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-6 bg-primary">
        <Text className="text-white text-2xl font-bold">My Appointments</Text>
        <Text className="text-white/80 mt-1">{bookings.length} appointments</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
        {bookings.length === 0 ? (
          <EmptyState
            icon="calendar-outline"
            title="No Appointments Yet"
            description="Book your first appointment with a doctor to get started"
            actionLabel="Find Doctors"
            onAction={() => navigation.navigate('Home')}
          />
        ) : (
          bookings.map(renderBooking)
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AppointmentScreen;
