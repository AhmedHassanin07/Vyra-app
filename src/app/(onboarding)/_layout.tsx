/**
 * Onboarding Stack Layout
 * Nested layout for onboarding routes
 */

import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Disable back gesture during onboarding
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="complete-profile" options={{ animationEnabled: false }} />
    </Stack>
  );
}
