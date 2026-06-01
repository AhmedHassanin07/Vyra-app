/**
 * Profile Screen - Tab 5 (Placeholder)
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { StyleSheet, View } from 'react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>@{user?.username}</ThemedText>
        <ThemedText style={styles.subtitle}>{user?.displayName}</ThemedText>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <ThemedText style={styles.statValue}>{user?.earnedCoins}</ThemedText>
            <ThemedText style={styles.statLabel}>Coins</ThemedText>
          </View>
        </View>

        <ThemedText style={styles.sectionTitle}>Profile Settings</ThemedText>
        <ThemedText style={styles.placeholder}>Coming Soon</ThemedText>

        <Button
          title="Logout"
          onPress={handleLogout}
          variant="secondary"
          style={styles.logoutButton}
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  stat: {
    alignItems: 'center',
    marginRight: 20,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  placeholder: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 24,
  },
  logoutButton: {
    marginTop: 'auto',
    marginBottom: 20,
  },
});
