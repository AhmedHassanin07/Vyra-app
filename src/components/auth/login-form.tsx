/**
 * Login Form Component
 */

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/components/ui/error-message';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { validateEmail, validatePassword } from '@/utils/validation';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

interface LoginFormProps {
  onForgotPasswordPress: () => void;
  onSignupPress: () => void;
}

export function LoginForm({ onForgotPasswordPress, onSignupPress }: LoginFormProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const handleLogin = async () => {
    try {
      setError(null);
      setFieldErrors({});

      // Validate fields
      const emailValidation = validateEmail(email);
      const passwordValidation = validatePassword(password);

      if (!emailValidation.valid || !passwordValidation.valid) {
        setFieldErrors({
          email: emailValidation.error,
          password: passwordValidation.error,
        });
        return;
      }

      setLoading(true);
      await login(email, password);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ErrorMessage message={error} />

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
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        error={fieldErrors.password}
        editable={!loading}
        secureTextEntry
      />

      <Button
        title="Sign In"
        onPress={handleLogin}
        loading={loading}
        disabled={!email || !password}
        style={styles.signInButton}
      />

      <View style={styles.divider}>
        <View style={styles.line} />
        <ThemedText style={styles.dividerText}>or</ThemedText>
        <View style={styles.line} />
      </View>

      <Button
        title="Create Account"
        onPress={onSignupPress}
        variant="secondary"
        disabled={loading}
        style={styles.signUpButton}
      />

      <Button
        title="Forgot Password?"
        onPress={onForgotPasswordPress}
        variant="secondary"
        size="small"
        disabled={loading}
        style={styles.forgotButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  signInButton: {
    marginTop: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 12,
  },
  signUpButton: {
    marginBottom: 12,
  },
  forgotButton: {
    marginBottom: 20,
  },
});
