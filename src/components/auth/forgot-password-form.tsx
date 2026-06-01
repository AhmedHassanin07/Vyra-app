/**
 * Forgot Password Form Component
 */

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/components/ui/error-message';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { validateEmail } from '@/utils/validation';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

interface ForgotPasswordFormProps {
  onBackPress: () => void;
}

export function ForgotPasswordForm({ onBackPress }: ForgotPasswordFormProps) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState<string>();

  const handleReset = async () => {
    try {
      setError(null);
      setEmailError(undefined);

      // Validate email
      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        setEmailError(emailValidation.error);
        return;
      }

      setLoading(true);
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password reset failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.successContainer}>
          <ThemedText style={styles.successTitle}>Check Your Email</ThemedText>
          <ThemedText style={styles.successMessage}>
            We've sent a password reset link to {email}. Click the link in the email to reset
            your password.
          </ThemedText>

          <Button
            title="Back to Login"
            onPress={onBackPress}
            style={styles.backButton}
          />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedText style={styles.description}>
        Enter your email address and we'll send you a link to reset your password.
      </ThemedText>

      <ErrorMessage message={error} />

      <Input
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        error={emailError}
        editable={!loading}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Button
        title="Send Reset Link"
        onPress={handleReset}
        loading={loading}
        disabled={!email}
        style={styles.submitButton}
      />

      <Button
        title="Back to Login"
        onPress={onBackPress}
        variant="secondary"
        disabled={loading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 12,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  backButton: {
    marginTop: 20,
  },
});
