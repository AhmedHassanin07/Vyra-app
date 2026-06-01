/**
 * Edit Profile Screen
 * Allows users to edit their displayName and username
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/components/ui/error-message';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/hooks/use-auth';
import { isUsernameAvailableForUser, updateUser } from '@/services/firestore-service';
import AuthService from '@/services/auth-service';
import { validateDisplayName, validateUsername } from '@/utils/validation';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

export default function EditProfileScreen() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [username, setUsername] = useState(user?.username || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ displayName?: string; username?: string }>({});
  const [success, setSuccess] = useState(false);

  if (authLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          <ThemedText style={styles.error}>User profile not found</ThemedText>
        </View>
      </ThemedView>
    );
  }

  const hasChanges = displayName !== user.displayName || username !== user.username;

  const handleSave = async () => {
    try {
      setError(null);
      setFieldErrors({});
      setSuccess(false);

      const trimmedDisplayName = displayName.trim();
      const trimmedUsername = username.trim();

      // Validate displayName
      const displayNameValidation = validateDisplayName(trimmedDisplayName);
      if (!displayNameValidation.valid) {
        setFieldErrors({ displayName: displayNameValidation.error });
        return;
      }

      // Validate username format
      const usernameValidation = validateUsername(trimmedUsername);
      if (!usernameValidation.valid) {
        setFieldErrors({ username: usernameValidation.error });
        return;
      }

      setLoading(true);

      // Check username availability (allow user to keep their own username)
      const usernameAvailable = await isUsernameAvailableForUser(trimmedUsername, user.uid);
      if (!usernameAvailable) {
        setFieldErrors({ username: 'This username is already taken' });
        setLoading(false);
        return;
      }

      // Update Firebase Auth profile if displayName changed
      if (trimmedDisplayName !== user.displayName) {
        await AuthService.updateAuthProfile(trimmedDisplayName);
      }

      // Update Firestore user document
      const updateData: Record<string, string> = {};
      if (trimmedDisplayName !== user.displayName) {
        updateData.display_name = trimmedDisplayName;
      }
      if (trimmedUsername !== user.username) {
        updateData.username = trimmedUsername.toLowerCase();
      }

      // Only update if there are actual changes
      if (Object.keys(updateData).length > 0) {
        await updateUser(user.uid, updateData as any);
      }

      setSuccess(true);
      // Navigate back after a brief success message
      setTimeout(() => {
        router.back();
      }, 500);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save changes';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Edit Profile</ThemedText>
            <ThemedText style={styles.subtitle}>Update your profile information</ThemedText>
          </View>

          {success && (
            <View style={styles.successBanner}>
              <ThemedText style={styles.successText}>Changes saved successfully!</ThemedText>
            </View>
          )}

          <ErrorMessage message={error} />

          <Input
            label="Display Name"
            placeholder="Your full name"
            value={displayName}
            onChangeText={setDisplayName}
            error={fieldErrors.displayName}
            editable={!loading}
            autoCapitalize="words"
            helperText="2-30 characters"
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
            helperText="3-20 characters, letters, numbers, underscores only"
          />

          <Input
            label="Email"
            value={user.email}
            editable={false}
            placeholder="Email cannot be changed"
            helperText="Email cannot be changed in this version"
          />
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button
            title={loading ? 'Saving...' : 'Save Changes'}
            onPress={handleSave}
            loading={loading}
            disabled={!hasChanges || loading}
            variant="primary"
            size="medium"
            style={styles.saveButton}
          />
          <Button
            title="Cancel"
            onPress={handleCancel}
            disabled={loading}
            variant="secondary"
            size="medium"
            style={styles.cancelButton}
          />
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
  successBanner: {
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  successText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    padding: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    gap: 12,
  },
  saveButton: {
    width: '100%',
  },
  cancelButton: {
    width: '100%',
  },
  error: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
