const fs = require('fs');
const path = require('path');

const screens = [
    'AboutDoctorScreen',
    'AppointmentScreen',
    'BookingScreen',
    'ChatBotScreen',
    'CheckoutScreen',
    'ConfirmScreen',
    'DietPlanScreen',
    'DoctorLogin',
    'DoctorPanelScreen',
    'DoctorProfile',
    'DoctorRegistrationScreen',
    'HomeScreen',
    'LoginScreen',
    'MedicalAppointmentScreen',
    'ProfileScreen',
    'SignUpScreen',
    'SplashScreen',
];

const template = (name) => `import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';

const ${name} = () => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text className="text-xl font-bold text-text">${name}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ${name};
`;

screens.forEach((screen) => {
    const filePath = path.join(__dirname, 'src/screens', screen + '.tsx');
    fs.writeFileSync(filePath, template(screen));
    console.log('Created ' + filePath);
});
