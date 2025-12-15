import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { auth } from '../services/firebase';

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();

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
              await auth.signOut();
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
    {
      icon: 'person-outline',
      title: 'Edit Profile',
      subtitle: 'Update your information',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      subtitle: 'Manage notifications',
      onPress: () => { },
    },
    {
      icon: 'lock-closed-outline',
      title: 'Privacy',
      subtitle: 'Privacy settings',
      onPress: () => { },
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      subtitle: 'Get help',
      onPress: () => { },
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-6 bg-primary">
        <Text className="text-white text-2xl font-bold">Profile</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="p-6">
          {/* User Info Card */}
          <Card className="p-6 mb-6">
            <View className="items-center">
              <View className="w-24 h-24 bg-primary rounded-full items-center justify-center mb-4">
                <Text className="text-white text-3xl font-bold">
                  {user?.email?.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text className="text-xl font-bold text-text mb-1">
                {user?.email?.split('@')[0]}
              </Text>
              <Text className="text-muted">{user?.email}</Text>
            </View>
          </Card>

          {/* Menu Items */}
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              className="mb-3"
            >
              <Card className="p-4 flex-row items-center">
                <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-4">
                  <Ionicons name={item.icon as any} size={20} color="#059669" />
                </View>
                <View className="flex-1">
                  <Text className="text-text font-semibold mb-1">{item.title}</Text>
                  <Text className="text-xs text-muted">{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </Card>
            </TouchableOpacity>
          ))}

          {/* Logout Button */}
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            className="mt-6"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
