import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import DoctorLogin from '../screens/DoctorLogin';
import DoctorRegistrationScreen from '../screens/DoctorRegistrationScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="DoctorLogin" component={DoctorLogin} />
            <Stack.Screen name="DoctorRegistration" component={DoctorRegistrationScreen} />
        </Stack.Navigator>
    );
};

export default AuthNavigator;
