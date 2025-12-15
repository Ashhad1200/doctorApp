import React from 'react';
import { View, Text } from 'react-native';
import { Page } from '../components/shared/Page';

const MedicalAppointmentScreen = () => {
  return (
    <Page title="Medical Records">
      <View className="bg-blue-50 p-4 rounded-xl mb-4">
        <Text className="text-lg font-bold text-blue-800">Visit History</Text>
        <Text className="text-blue-600 mt-2">No records found.</Text>
      </View>
    </Page>
  );
};

export default MedicalAppointmentScreen;
