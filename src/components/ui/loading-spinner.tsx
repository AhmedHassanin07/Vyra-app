/**
 * Loading Spinner Component
 */

import { Colors } from '@/constants/theme';
import { ActivityIndicator, StyleSheet, useColorScheme, View } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

export function LoadingSpinner({ size = 'large', fullScreen = true }: LoadingSpinnerProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const containerStyle = fullScreen ? styles.fullScreen : styles.centered;

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={colors.tint} />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
