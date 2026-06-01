/**
 * Complete Profile Screen (Onboarding)
 * Collects username from user during onboarding
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/components/ui/error-message';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/hooks/use-auth';
import { completeOnboarding, isUsernameUsed } from '@/services/firestore-service';
import { validateUsername } from '@/utils/validation';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Pressable } from 'react-native';

export default function CompleteProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ displayName?: string; username?: string }>({});

  if (!user) {
    return <LoadingSpinner fullScreen />;
  }

  const handleComplete = async () => {
    try {
      setError(null);
      setFieldErrors({});

      // Normalize inputs
      const trimmedUsername = username.trim();
      const trimmedDisplayName = displayName.trim();

      // Validate format
      const usernameValidation = validateUsername(trimmedUsername);

      if (!usernameValidation.valid) {
        setFieldErrors({
          username: usernameValidation.error,
        });
        return;
      }

      setLoading(true);

      // Check availability with normalized username
      const usernameTaken = await isUsernameUsed(trimmedUsername);
      if (usernameTaken) {
        setFieldErrors({
          username: 'This username is already taken',
        });
        setLoading(false);
        return;
      }

      // Complete onboarding with normalized values
      await completeOnboarding(user.uid, trimmedUsername, trimmedDisplayName);

      router.replace('/(tabs)/home');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to complete setup';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Complete Your Profile</ThemedText>
            <ThemedText style={styles.subtitle}>
              Set up your username to finish joining Vyra
            </ThemedText>
          </View>

          <ErrorMessage message={error} />

          <Input
            label="Display Name"
            placeholder="Your full name"
            value={displayName}
            onChangeText={setDisplayName}
            error={fieldErrors.displayName}
            editable={!loading}
            autoCapitalize="words"
          />

          <Input
            label="Username"
            placeholder="Choose a unique username"
            value={username}
            onChangeText={setUsername}
            error={fieldErrors.username}
            editable={!loading}
            autoCapitalize="none"
            autoCorrect={false}
            helperText="3-20 characters, letters, numbers, and underscores only"
          />

          <ThemedText style={styles.helperText}>
            3-20 characters, letters, numbers, and underscores only
          </ThemedText>

          <ThemedText style={styles.skipNote}>
            You can change your display name and username anytime from your profile settings.
          </ThemedText>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              {
                opacity: pressed || (!username || !displayName) ? 0.6 : 1,
              },
            ]}
            onPress={handleComplete}
            disabled={!username || !displayName || loading}
          >
            <ThemedText style={styles.buttonText}>
              {loading ? 'Setting up...' : 'Complete Setup'}
            </ThemedText>
          </Pressable>
        </View>
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
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  buttonContainer: {
    padding: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
  helperText: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  skipNote: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 20,
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 18,
  },
});
