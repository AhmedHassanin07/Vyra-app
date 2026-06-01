/**
 * Edit Profile Screen - Coming Soon
 * Placeholder for future profile editing functionality
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function EditProfileScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>Edit Profile</ThemedText>
        <ThemedText style={styles.subtitle}>Coming Soon</ThemedText>
        <ThemedText style={styles.description}>
          Profile editing features will be available soon. For now, you can continue viewing your profile.
        </ThemedText>

        <Button
          title="Go Back"
          onPress={handleBack}
          variant="primary"
          style={styles.button}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  button: {
    minWidth: 120,
  },
});
