import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import { useAuth } from '../context/AuthContext';
import BookingScreen from '../screens/BookingScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import ConfirmScreen from '../screens/ConfirmScreen';
import AboutDoctorScreen from '../screens/AboutDoctorScreen';
import ChatBotScreen from '../screens/ChatBotScreen';
import DietPlanScreen from '../screens/DietPlanScreen';
import MedicalAppointmentScreen from '../screens/MedicalAppointmentScreen';
import DoctorPanelScreen from '../screens/DoctorPanelScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
    // @ts-ignore
    const { user, loading, isDoctor } = useAuth();
    console.log("RootNavigator: Rendering. Loading:", loading, "User:", user ? user.email : "null", "IsDoctor:", isDoctor);

    if (loading) {
        // Return a null or loading spinner while auth checks status
        // The native splash screen handles the initial load visual
        return null;
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
                // User is signed in - route based on role
                isDoctor ? (
                    // Doctor user - show doctor panel
                    <Stack.Screen name="DoctorPanel" component={DoctorPanelScreen} />
                ) : (
                    // Regular user - show main tabs
                    <Stack.Screen name="Main" component={TabNavigator} />
                )
            ) : (
                // No user is signed in
                <Stack.Screen name="Auth" component={AuthNavigator} />
            )}

            {/* Additional screens available to both roles */}
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
                <Stack.Screen name="Booking" component={BookingScreen} />
                <Stack.Screen name="Checkout" component={CheckoutScreen} />
                <Stack.Screen name="Confirm" component={ConfirmScreen} />
            </Stack.Group>

            <Stack.Group>
                <Stack.Screen name="AboutDoctor" component={AboutDoctorScreen} />
                <Stack.Screen name="ChatBot" component={ChatBotScreen} />
                <Stack.Screen name="DietPlan" component={DietPlanScreen} />
                <Stack.Screen name="MedicalAppointment" component={MedicalAppointmentScreen} />
            </Stack.Group>
        </Stack.Navigator>
    );
};

export default RootNavigator;
