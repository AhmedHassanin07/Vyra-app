/**
 * Forgot Password Screen
 */

import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, View } from 'react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Reset Password</ThemedText>
        </View>

        <ForgotPasswordForm onBackPress={handleBackPress} />
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
    fontSize: 28,
    fontWeight: 'bold',
  },
});
