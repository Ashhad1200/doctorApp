import React from 'react';
import { View, ViewProps } from 'react-native';
import clsx from 'clsx';

export const Card: React.FC<ViewProps> = ({ children, className, ...props }) => {
    return (
        <View
            className={clsx("bg-white rounded-xl shadow-sm p-4", className)}
            {...props}
        >
            {children}
        </View>
    );
};
