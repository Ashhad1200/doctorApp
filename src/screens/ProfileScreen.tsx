import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
          style: 'destructive'
        },
      ]
    );
  };

  const menuItems = [
    { icon: 'person-outline', title: 'Edit Profile', action: () => Alert.alert('Coming Soon', 'Edit profile feature') },
    { icon: 'notifications-outline', title: 'Notifications', action: () => Alert.alert('Coming Soon', 'Notifications feature') },
    { icon: 'card-outline', title: 'Payment Methods', action: () => Alert.alert('Coming Soon', 'Payment methods feature') },
    { icon: 'help-circle-outline', title: 'Help & Support', action: () => Alert.alert('Coming Soon', 'Help & support feature') },
    { icon: 'document-text-outline', title: 'Terms & Conditions', action: () => Alert.alert('Coming Soon', 'Terms & conditions') },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Header */}
        <View className="bg-primary p-6 rounded-b-3xl mb-6">
          <View className="items-center">
            <View className="w-24 h-24 bg-white/20 rounded-full items-center justify-center mb-4">
              <Ionicons name="person" size={50} color="white" />
            </View>
            <Text className="text-white text-2xl font-bold">{user?.email?.split('@')[0] || 'User'}</Text>
            <Text className="text-white/80 mt-1">{user?.email}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View className="px-6">
          <Card className="mb-4">
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={item.action}
                className={`flex-row items-center py-4 ${index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <Ionicons name={item.icon as any} size={24} color="#6b7280" />
                <Text className="text-text ml-4 flex-1">{item.title}</Text>
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
              </TouchableOpacity>
            ))}
          </Card>

          <Button
            title="Logout"
            onPress={handleLogout}
            variant="danger"
            className="w-full"
          />

          <Text className="text-center text-xs text-muted mt-6">
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
