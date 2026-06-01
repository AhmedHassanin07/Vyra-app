/**
 * Profile Stack Layout
 * Handles navigation for profile-related screens
 */

import { Colors } from '@/constants/theme';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function ProfileLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen
        name="edit"
        options={{
          title: 'Edit Profile',
          headerShown: true,
        }}
      />
    </Stack>
  );
}
