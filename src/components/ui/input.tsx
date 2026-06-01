/**
 * Reusable Input Component
 */

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useState } from 'react';
import {
    StyleSheet,
    TextInput,
    TextInputProps,
    useColorScheme,
    View,
    ViewStyle,
} from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function Input({ label, error, containerStyle, ...props }: InputProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [focused, setFocused] = useState(false);

  const inputStyle = {
    borderColor: error ? '#FF6B6B' : focused ? colors.tint : colors.tabIconDefault,
    color: colors.text,
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      <TextInput
        style={[
          styles.input,
          inputStyle,
          { backgroundColor: colors.background },
        ]}
        placeholderTextColor={colors.tabIconDefault}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {error && <ThemedText style={styles.error}>{error}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  error: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
  },
});
