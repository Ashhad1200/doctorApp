import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components/ui/Card';
import { Ionicons } from '@expo/vector-icons';
import { subscribeToDoctorAppointments, updateAppointmentStatus } from '../services/doctor';
import { BookingData } from '../services/booking';
import { useAuth } from '../context/AuthContext';
import { auth } from '../services/firebase';

const DoctorPanelScreen = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time subscription to doctor's appointments
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    console.log('DoctorPanel: Setting up real-time appointments subscription');
    const unsubscribe = subscribeToDoctorAppointments(
      (updatedAppointments) => {
        console.log('DoctorPanel: Received appointment update:', updatedAppointments.length);
        setAppointments(updatedAppointments);
        setLoading(false);
      },
      (error) => {
        console.error('DoctorPanel: Error in subscription:', error);
        setLoading(false);
      }
    );

    return () => {
      console.log('DoctorPanel: Cleaning up appointments subscription');
      unsubscribe();
    };
  }, [user]);

  const handleStatusUpdate = async (id: string, status: 'confirmed' | 'cancelled') => {
    try {
      await updateAppointmentStatus(id, status);
      // No need to manually refresh - real-time subscription will update automatically
      Alert.alert("Success", `Appointment ${status}`);
    } catch (error) {
      Alert.alert("Error", "Failed to update status");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-6 bg-secondary rounded-b-3xl mb-4">
        <View className="flex-row justify-between items-center mb-2">
          <View>
            <Text className="text-white text-sm">Welcome back,</Text>
            <Text className="text-white text-2xl font-bold">{user?.email?.split('@')[0] || 'Doctor'}</Text>
          </View>
          <TouchableOpacity
            onPress={() => Alert.alert(
              'Logout',
              'Are you sure you want to logout?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', onPress: async () => await auth.signOut(), style: 'destructive' }
              ]
            )}
            className="bg-white/20 p-3 rounded-lg"
          >
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View className="flex-row mt-4 justify-between">
          <View className="bg-white/20 p-3 rounded-lg flex-1 mr-2 items-center">
            <Text className="text-white font-bold text-lg">{appointments.length}</Text>
            <Text className="text-white/80 text-xs">Total</Text>
          </View>
        </View>
      </View>

      <View className="flex-1 px-6">
        <Text className="text-lg font-bold text-text mb-4">Appointments</Text>
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id || Math.random().toString()}
          renderItem={({ item }) => (
            <Card className="mb-4 flex-row items-center p-3">
              <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mr-4">
                <Ionicons name="person" size={20} color="gray" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-base">Patient: {item.doctorName || 'Unknown'}</Text>
                <Text className="text-muted text-sm">{item.date} - {item.time}</Text>
                <Text className={`text-xs ${item.status === 'confirmed' ? 'text-success' : item.status === 'cancelled' ? 'text-error' : 'text-yellow-600'}`}>
                  {item.status.toUpperCase()}
                </Text>
              </View>
              {item.status === 'pending' && (
                <View className="items-end">
                  <View className="flex-row mt-1">
                    <TouchableOpacity onPress={() => handleStatusUpdate(item.id!, 'confirmed')} className="bg-green-100 p-2 rounded mr-2">
                      <Ionicons name="checkmark" size={16} color="green" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleStatusUpdate(item.id!, 'cancelled')} className="bg-red-100 p-2 rounded">
                      <Ionicons name="close" size={16} color="red" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Card>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default DoctorPanelScreen;
