import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../src/components/ui/Button';
import { Input } from '../src/components/ui/Input';

describe('Button', () => {
    it('renders correctly', () => {
        const { getByText } = render(<Button title="Test Button" onPress={() => { }} />);
        expect(getByText('Test Button')).toBeTruthy();
    });

    it('handles press', () => {
        const onPress = jest.fn();
        const { getByText } = render(<Button title="Press Me" onPress={onPress} />);
        fireEvent.press(getByText('Press Me'));
        expect(onPress).toHaveBeenCalled();
    });

    it('shows loading state', () => {
        const { getByTestId } = render(<Button title="Loading" onPress={() => { }} isLoading />);
        expect(getByTestId('loading-indicator')).toBeTruthy();
    });
});
