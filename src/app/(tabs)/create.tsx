/**
 * Create Post Screen
 * Allows signed-in user to publish a text post to Firestore
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/components/ui/error-message';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { createPost } from '@/services/posts-service';
import { useCallback, useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableWithoutFeedback,
    useColorScheme,
    View,
} from 'react-native';

const MIN_LENGTH = 3;
const MAX_LENGTH = 280;

export default function CreateScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user, loading: authLoading } = useAuth();

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Validate post content
  const validateContent = useCallback((text: string): string | null => {
    const trimmed = text.trim();

    if (!trimmed) {
      return 'Post content is required';
    }

    if (trimmed.length < MIN_LENGTH) {
      return `Post must be at least ${MIN_LENGTH} characters`;
    }

    if (trimmed.length > MAX_LENGTH) {
      return `Post cannot exceed ${MAX_LENGTH} characters`;
    }

    return null;
  }, []);

  // Handle post submission
  const handleSubmit = useCallback(async () => {
    if (!user) {
      setError('You must be logged in to create a post');
      return;
    }

    const validationError = validateContent(content);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await createPost({
        uid: user.uid,
        displayName: user.displayName,
        username: user.username,
        content: content.trim(),
      });

      // Success state
      setSuccess(true);
      setContent('');

      // Clear success message after 2 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create post';
      setError(message);
      console.error('Post creation error:', err);
    } finally {
      setLoading(false);
    }
  }, [user, content, validateContent]);

  // Handle clear/cancel
  const handleClear = useCallback(() => {
    setContent('');
    setError(null);
    setSuccess(false);
  }, []);

  // Calculate character count
  const charCount = content.length;
  const charCountColor =
    charCount === 0
      ? colors.tabIconDefault
      : charCount > MAX_LENGTH
        ? '#FF6B6B'
        : charCount > MAX_LENGTH * 0.9
          ? '#FFB84D'
          : colors.text;

  if (authLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.centerContent}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.centerContent}>
          <ThemedText style={styles.errorTitle}>Not logged in</ThemedText>
          <ThemedText style={styles.errorText}>
            Please log in to create posts.
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <ThemedText style={styles.title}>Create Post</ThemedText>
            <ThemedText style={styles.helperText}>
              Share your thoughts with the community
            </ThemedText>
          </View>

          {/* Error Message */}
          {error && !success && <ErrorMessage message={error} />}

          {/* Success Message */}
          {success && (
            <View style={[styles.successMessage, { backgroundColor: '#4CAF50' }]}>
              <ThemedText style={styles.successText}>
                ✓ Post created successfully!
              </ThemedText>
            </View>
          )}

          {/* Text Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: error && !success ? '#FF6B6B' : colors.tabIconDefault,
                },
              ]}
              placeholder="What's on your mind?"
              placeholderTextColor={colors.tabIconDefault}
              value={content}
              onChangeText={setContent}
              multiline
              maxLength={MAX_LENGTH}
              editable={!loading}
              scrollEnabled={false}
            />

            {/* Character Count */}
            <View style={styles.charCountContainer}>
              <ThemedText style={[styles.charCount, { color: charCountColor }]}>
                {charCount} / {MAX_LENGTH}
              </ThemedText>
            </View>
          </View>

          {/* Buttons Section */}
          <View style={styles.buttonContainer}>
            <Button
              title={loading ? 'Posting...' : 'Post'}
              onPress={handleSubmit}
              loading={loading}
              disabled={loading || content.trim().length === 0}
              variant="primary"
              style={styles.submitButton}
            />

            <Button
              title="Clear"
              onPress={handleClear}
              disabled={loading}
              variant="secondary"
              style={styles.clearButton}
            />
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <ThemedText style={styles.infoText}>
              Posts must be between {MIN_LENGTH} and {MAX_LENGTH} characters
            </ThemedText>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 14,
    opacity: 0.7,
  },
  inputContainer: {
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 160,
    textAlignVertical: 'top',
  },
  charCountContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  charCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  submitButton: {
    flex: 1,
  },
  clearButton: {
    flex: 1,
  },
  infoSection: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  infoText: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  successMessage: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  successText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});
