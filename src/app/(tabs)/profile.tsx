/**
 * Profile Screen - MVP Implementation
 * Displays user profile with stats and action buttons
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function ProfileScreen() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleEditProfile = () => {
    router.navigate('/(tabs)/profile/edit');
  };

  if (loading) {
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

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.header}>
          {/* Avatar Placeholder */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <ThemedText style={styles.avatarInitial}>
                {user.displayName?.charAt(0).toUpperCase() || '?'}
              </ThemedText>
            </View>
          </View>

          {/* User Info */}
          <ThemedText style={styles.displayName}>{user.displayName}</ThemedText>
          <ThemedText style={styles.username}>@{user.username}</ThemedText>
          <ThemedText style={styles.email}>{user.email}</ThemedText>
        </View>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <ThemedText style={styles.statValue}>0</ThemedText>
            <ThemedText style={styles.statLabel}>Following</ThemedText>
          </View>
          <View style={styles.stat}>
            <ThemedText style={styles.statValue}>0</ThemedText>
            <ThemedText style={styles.statLabel}>Followers</ThemedText>
          </View>
          <View style={styles.stat}>
            <ThemedText style={styles.statValue}>0</ThemedText>
            <ThemedText style={styles.statLabel}>Likes</ThemedText>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <Button
            title="Edit Profile"
            onPress={handleEditProfile}
            variant="primary"
            size="medium"
            style={styles.editButton}
          />
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="secondary"
            size="medium"
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 48,
    fontWeight: '600',
    color: '#666',
  },
  displayName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  username: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 8,
    textAlign: 'center',
  },
  email: {
    fontSize: 13,
    opacity: 0.5,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
    paddingVertical: 20,
    marginBottom: 32,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  buttonsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  editButton: {
    width: '100%',
  },
  logoutButton: {
    width: '100%',
  },
  error: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
