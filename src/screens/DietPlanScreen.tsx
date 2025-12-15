import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Page } from '../components/shared/Page';

const DietPlanScreen = () => {
  return (
    <Page title="Diet Plan">
      <View className="bg-green-50 p-4 rounded-xl mb-4">
        <Text className="text-lg font-bold text-green-800">Your Daily Plan</Text>
        <Text className="text-green-600 mt-2">1. Breakfast: Oatmeal with fruits</Text>
        <Text className="text-green-600 mt-1">2. Lunch: Grilled Chicken Salad</Text>
        <Text className="text-green-600 mt-1">3. Dinner: Steamed Vegetables</Text>
      </View>
    </Page>
  );
};

export default DietPlanScreen;
