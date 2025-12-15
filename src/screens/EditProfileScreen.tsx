import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { getUserProfile, updateUserProfile, UserProfile } from '../services/profile';
import { isValidName, isValidPhone } from '../utils/validation';

const EditProfileScreen = () => {
    const navigation = useNavigation<any>();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const [errors, setErrors] = useState({
        name: '',
        phone: '',
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await getUserProfile();
            if (data) {
                setProfile(data);
                setName(data.name);
                setPhone(data.phone || '');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = (): boolean => {
        const newErrors = { name: '', phone: '' };
        let isValid = true;

        if (!name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        } else if (!isValidName(name)) {
            newErrors.name = 'Name must be at least 2 characters';
            isValid = false;
        }

        if (phone && !isValidPhone(phone)) {
            newErrors.phone = 'Phone must be 10 digits';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            setSaving(true);
            await updateUserProfile({ name, phone });
            Alert.alert('Success', 'Profile updated successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#059669" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1 px-6">
                <View className="py-6">
                    <Text className="text-2xl font-bold text-text mb-2">Edit Profile</Text>
                    <Text className="text-muted">Update your personal information</Text>
                </View>

                <View className="mb-6">
                    <Text className="text-sm font-semibold text-text mb-2">Full Name</Text>
                    <Input
                        placeholder="Enter your name"
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            if (errors.name) setErrors({ ...errors, name: '' });
                        }}
                    />
                    {errors.name ? (
                        <Text className="text-red-500 text-xs mt-1">{errors.name}</Text>
                    ) : null}
                </View>

                <View className="mb-6">
                    <Text className="text-sm font-semibold text-text mb-2">Email</Text>
                    <Input
                        placeholder="Email"
                        value={profile?.email || ''}
                        editable={false}
                        className="bg-gray-100"
                    />
                    <Text className="text-xs text-muted mt-1">Email cannot be changed</Text>
                </View>

                <View className="mb-8">
                    <Text className="text-sm font-semibold text-text mb-2">Phone Number</Text>
                    <Input
                        placeholder="Enter 10-digit phone number"
                        value={phone}
                        onChangeText={(text) => {
                            setPhone(text.replace(/\D/g, '').slice(0, 10));
                            if (errors.phone) setErrors({ ...errors, phone: '' });
                        }}
                        keyboardType="phone-pad"
                        maxLength={10}
                    />
                    {errors.phone ? (
                        <Text className="text-red-500 text-xs mt-1">{errors.phone}</Text>
                    ) : null}
                </View>

                <Button
                    title="Save Changes"
                    onPress={handleSave}
                    isLoading={saving}
                    className="mb-4"
                />

                <Button
                    title="Cancel"
                    onPress={() => navigation.goBack()}
                    variant="outline"
                    className="mb-8"
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default EditProfileScreen;
