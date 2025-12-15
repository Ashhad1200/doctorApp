import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';

const DoctorProfile = () => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text className="text-xl font-bold text-text">DoctorProfile</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DoctorProfile;
