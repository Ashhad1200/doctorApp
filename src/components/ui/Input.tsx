import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import clsx from 'clsx';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    containerClassName,
    className,
    ...props
}) => {
    return (
        <View className={clsx("w-full mb-4", containerClassName)}>
            {label && <Text className="text-text font-semibold mb-1">{label}</Text>}
            <TextInput
                className={clsx(
                    "h-12 border border-gray-300 rounded-lg px-4 bg-white text-text",
                    error && "border-error",
                    className
                )}
                placeholderTextColor="#9ca3af"
                {...props}
            />
            {error && <Text className="text-error text-xs mt-1">{error}</Text>}
        </View>
    );
};
