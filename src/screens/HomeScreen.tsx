import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ListSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { subscribeToDoctors, searchDoctors, Doctor } from '../services/doctors';

const categories = [
  { id: 1, name: 'Cardiology', icon: 'heart-outline' },
  { id: 2, name: 'General', icon: 'medkit-outline' },
  { id: 3, name: 'Dentist', icon: 'star-outline' },
  { id: 4, name: 'Neurology', icon: 'headset-outline' },
];

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time subscription to doctors
  useEffect(() => {
    console.log('HomeScreen: Setting up real-time doctors subscription');
    const unsubscribe = subscribeToDoctors(
      (updatedDoctors) => {
        console.log('HomeScreen: Received doctor update:', updatedDoctors.length);
        setDoctors(updatedDoctors);
        setLoading(false);
      },
      (error) => {
        console.error('HomeScreen: Error in subscription:', error);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      console.log('HomeScreen: Cleaning up doctors subscription');
      unsubscribe();
    };
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = await searchDoctors(query);
      setDoctors(results);
    }
    // Note: Real-time subscription will restore full list automatically
  };

  const renderDoctor = ({ item }: { item: typeof doctors[0] }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('AboutDoctor', { doctor: item })}
      className="mr-4"
    >
      <Card className="w-64 p-4">
        <View className="items-center">
          <View className="w-20 h-20 bg-gray-200 rounded-full mb-3 items-center justify-center">
            <Ionicons name="person" size={32} color="#6b7280" />
          </View>
          <Text className="text-lg font-bold text-text mb-1">{item.name}</Text>
          <Text className="text-sm text-muted mb-2">{item.specialty}</Text>
          <View className="flex-row items-center">
            <Ionicons name="star" size={16} color="#fbbf24" />
            <Text className="ml-1 text-sm text-muted">{item.rating} ({item.reviews} reviews)</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        {/* Header */}
        <View className="p-6 bg-primary rounded-b-3xl">
          <Text className="text-white text-xs">Hello 👋</Text>
          <Text className="text-white text-2xl font-bold mt-1">Find Your Doctor</Text>

          {/* Search */}
          <View className="mt-6">
            <Input
              placeholder="Search doctors or specialties..."
              value={searchQuery}
              onChangeText={handleSearch}
              className="bg-white"
            />
          </View>
        </View>

        {/* Categories */}
        <View className="p-6">
          <Text className="text-lg font-bold text-text mb-4">Categories</Text>
          <View className="flex-row flex-wrap">
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                className="w-[48%] mb-4 mr-[4%]"
                style={{ marginRight: cat.id % 2 === 0 ? 0 : '4%' }}
              >
                <Card className="items-center p-4">
                  <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center mb-2">
                    <Ionicons name={cat.icon as any} size={24} color="#059669" />
                  </View>
                  <Text className="text-sm font-semibold text-center">{cat.name}</Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Doctors */}
        <View className="px-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-text">Popular Doctors</Text>
            <TouchableOpacity>
              <Text className="text-primary text-sm">See All</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <ListSkeleton count={3} type="doctor" />
            </ScrollView>
          ) : doctors.length === 0 ? (
            <EmptyState
              icon="medical-outline"
              title="No Doctors Available"
              description="Please run 'node seed.js' to populate the database with sample doctors"
            />
          ) : (
            <FlatList
              data={doctors}
              renderItem={renderDoctor}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>
        {/* Recent or Banner */}
        <View className="p-6">
          <Card className="bg-secondary p-4 flex-row items-center justify-between">
            <View>
              <Text className="text-white font-bold text-lg">Early protection</Text>
              <Text className="text-white/80 text-xs mt-1">Check your health today</Text>
            </View>
            <Button title="Book Now" onPress={() => { }} className="bg-white h-8 px-3" variant="primary" />
            {/* Note: button children text color override needs care if variant is simple. Keeping simple. */}
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView >
  );
};

export default HomeScreen;
