import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import clsx from 'clsx';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    isLoading?: boolean;
    disabled?: boolean;
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    isLoading = false,
    disabled = false,
    className,
}) => {
    const baseStyles = "h-12 rounded-lg items-center justify-center px-4";
    const variantStyles = {
        primary: "bg-primary",
        secondary: "bg-secondary",
        outline: "bg-transparent border border-primary",
        danger: "bg-error",
    };
    const textStyles = {
        primary: "text-white font-bold text-base",
        secondary: "text-white font-bold text-base",
        outline: "text-primary font-bold text-base",
        danger: "text-white font-bold text-base",
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || isLoading}
            className={clsx(
                baseStyles,
                variantStyles[variant],
                (disabled || isLoading) && "opacity-50",
                className
            )}
        >
            {isLoading ? (
                <ActivityIndicator testID="loading-indicator" color={variant === 'outline' ? '#059669' : 'white'} />
            ) : (
                <Text className={textStyles[variant]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};
