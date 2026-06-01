/**
 * Signup Form Component
 */

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/components/ui/error-message';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { validateDisplayName, validateEmail, validatePassword } from '@/utils/validation';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

interface SignupFormProps {
  onLoginPress: () => void;
}

export function SignupForm({ onLoginPress }: SignupFormProps) {
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
    displayName?: string;
  }>({});

  const handleSignup = async () => {
    try {
      setError(null);
      setFieldErrors({});

      // Validate fields
      const emailValidation = validateEmail(email);
      const passwordValidation = validatePassword(password);
      const nameValidation = validateDisplayName(displayName);

      if (!emailValidation.valid || !passwordValidation.valid || !nameValidation.valid) {
        setFieldErrors({
          email: emailValidation.error,
          password: passwordValidation.error,
          displayName: nameValidation.error,
        });
        return;
      }

      setLoading(true);
      await signup(email, password, displayName);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      // Handle specific Firebase error codes
      if (message.includes('email-already-in-use')) {
        setError('This email is already registered');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ErrorMessage message={error} />

      <Input
        label="Full Name"
        placeholder="Enter your full name"
        value={displayName}
        onChangeText={setDisplayName}
        error={fieldErrors.displayName}
        editable={!loading}
        autoCapitalize="words"
      />

      <Input
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        error={fieldErrors.email}
        editable={!loading}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Input
        label="Password"
        placeholder="At least 6 characters"
        value={password}
        onChangeText={setPassword}
        error={fieldErrors.password}
        editable={!loading}
        secureTextEntry
      />

      <Button
        title="Create Account"
        onPress={handleSignup}
        loading={loading}
        disabled={!email || !password || !displayName}
        style={styles.signUpButton}
      />

      <View style={styles.bottomText}>
        <ThemedText style={styles.text}>Already have an account? </ThemedText>
        <Button
          title="Sign In"
          onPress={onLoginPress}
          variant="secondary"
          disabled={loading}
          size="small"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  signUpButton: {
    marginTop: 8,
  },
  bottomText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  text: {
    fontSize: 14,
  },
});
