import React from 'react';
import { SafeAreaView, View, Text, ViewProps } from 'react-native';
import clsx from 'clsx';

interface PageProps extends ViewProps {
    title?: string;
    children: React.ReactNode;
}

export const Page: React.FC<PageProps> = ({ title, children, className, ...props }) => {
    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className={clsx("flex-1 p-4", className)} {...props}>
                {title && <Text className="text-2xl font-bold text-text mb-4">{title}</Text>}
                {children}
            </View>
        </SafeAreaView>
    );
};
