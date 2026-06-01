/**
 * Error Message Component
 */

import { ThemedText } from '@/components/themed-text';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface ErrorMessageProps {
  message?: string | null;
  style?: ViewStyle;
}

export function ErrorMessage({ message, style }: ErrorMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <ThemedText style={styles.text}>{message}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});
