import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, DimensionValue } from 'react-native';

interface SkeletonProps {
    width?: DimensionValue;
    height?: DimensionValue;
    borderRadius?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    width = '100%',
    height = 20,
    borderRadius = 4,
}) => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [opacity]);

    return (
        <Animated.View
            style={[
                styles.skeleton,
                {
                    width,
                    height,
                    borderRadius,
                    opacity,
                },
            ]}
        />
    );
};

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: '#e5e7eb',
    },
});

// Doctor Card Skeleton
export const DoctorCardSkeleton: React.FC = () => {
    return (
        <View className="w-64 mr-4 bg-white rounded-xl p-4 border border-gray-100">
            <View className="items-center">
                <Skeleton width={80} height={80} borderRadius={40} />
                <View className="mb-3" />
                <Skeleton width="80%" height={20} />
                <View className="mb-2" />
                <Skeleton width="60%" height={16} />
                <View className="mb-2" />
                <Skeleton width="50%" height={16} />
            </View>
        </View>
    );
};

// Appointment Card Skeleton
export const AppointmentCardSkeleton: React.FC = () => {
    return (
        <View className="bg-white rounded-xl p-4 mb-4 border border-gray-100">
            <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                    <Skeleton width="60%" height={20} />
                    <View className="mb-2" />
                    <Skeleton width="40%" height={16} />
                </View>
                <Skeleton width={80} height={24} borderRadius={12} />
            </View>
            <Skeleton width="80%" height={16} />
            <View className="mb-2" />
            <Skeleton width="50%" height={16} />
        </View>
    );
};

// List Skeleton
interface ListSkeletonProps {
    count?: number;
    type: 'doctor' | 'appointment';
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({ count = 3, type }) => {
    const SkeletonComponent = type === 'doctor' ? DoctorCardSkeleton : AppointmentCardSkeleton;

    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonComponent key={index} />
            ))}
        </>
    );
};
