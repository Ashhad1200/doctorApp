import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';

interface EmptyStateProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    actionLabel,
    onAction,
}) => {
    return (
        <View className="items-center justify-center py-12 px-6">
            <View className="w-24 h-24 rounded-full bg-gray-100 items-center justify-center mb-4">
                <Ionicons name={icon} size={48} color="#9ca3af" />
            </View>

            <Text className="text-xl font-bold text-gray-900 text-center mb-2">
                {title}
            </Text>

            {description && (
                <Text className="text-sm text-gray-500 text-center mb-6 max-w-xs">
                    {description}
                </Text>
            )}

            {actionLabel && onAction && (
                <Button
                    title={actionLabel}
                    onPress={onAction}
                    variant="outline"
                />
            )}
        </View>
    );
};
