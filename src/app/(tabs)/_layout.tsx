/**
 * Tabs Stack Layout
 * Bottom tab navigation for main app
 */

import { Colors } from '@/constants/theme';
import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useColorScheme } from 'react-native';

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.tabIconDefault + '20',
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <SymbolView name="house.fill" size={size} tintColor={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="live"
        options={{
          title: 'Live',
          tabBarLabel: 'Live',
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <SymbolView name="video.fill" size={size} tintColor={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarLabel: 'Create',
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <SymbolView name="plus.circle.fill" size={size} tintColor={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          tabBarLabel: 'Inbox',
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <SymbolView name="envelope.fill" size={size} tintColor={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <SymbolView name="person.fill" size={size} tintColor={color} />
          ),
        }}
      />
    </Tabs>
  );
}
