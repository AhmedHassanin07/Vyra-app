/**
 * Login Screen
 */

import { LoginForm } from '@/components/auth/login-form';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();

  const handleForgotPasswordPress = () => {
    router.push('/(auth)/forgot-password');
  };

  const handleSignupPress = () => {
    router.push('/(auth)/signup');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Vyra</ThemedText>
          <ThemedText style={styles.subtitle}>Welcome Back</ThemedText>
        </View>

        <LoginForm
          onForgotPasswordPress={handleForgotPasswordPress}
          onSignupPress={handleSignupPress}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 4,
  },
});
