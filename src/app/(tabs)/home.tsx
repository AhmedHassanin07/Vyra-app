/**
 * Home Feed Screen - MVP
 * Displays a simple social feed with posts
 * Currently uses mock data - will connect to Firestore posts collection in next phase
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { MOCK_POSTS, Post } from '@/data/mock-posts';
import { useAuth } from '@/hooks/use-auth';
import { Timestamp } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import {
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    View,
} from 'react-native';

export default function HomeScreen() {
  const { loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load posts (currently from mock data)
  const loadPosts = useCallback(async () => {
    try {
      setError(null);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      // In production, this will be replaced with Firestore query
      setPosts(MOCK_POSTS);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load feed';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadPosts();
    }
  }, [authLoading, loadPosts]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  const formatTime = (timestamp: Timestamp): string => {
    const date = timestamp.toDate();
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  const renderPostCard = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.authorInfo}>
          <View style={styles.avatar}>
            <ThemedText style={styles.avatarText}>
              {item.authorName.charAt(0).toUpperCase()}
            </ThemedText>
          </View>
          <View style={styles.authorDetails}>
            <ThemedText style={styles.authorName}>{item.authorName}</ThemedText>
            <ThemedText style={styles.authorHandle}>@{item.authorUsername}</ThemedText>
          </View>
        </View>
        <ThemedText style={styles.timestamp}>{formatTime(item.timestamp)}</ThemedText>
      </View>

      {/* Post Content */}
      <ThemedText style={styles.postContent}>{item.content}</ThemedText>

      {/* Post Stats */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <ThemedText style={styles.statLabel}>❤️</ThemedText>
          <ThemedText style={styles.statValue}>{item.likes}</ThemedText>
        </View>
        <View style={styles.stat}>
          <ThemedText style={styles.statLabel}>💬</ThemedText>
          <ThemedText style={styles.statValue}>{item.comments}</ThemedText>
        </View>
      </View>

      {/* Post Actions */}
      <View style={styles.actionsRow}>
        <Pressable style={styles.actionButton}>
          <ThemedText style={styles.actionText}>Like</ThemedText>
        </Pressable>
        <Pressable style={styles.actionButton}>
          <ThemedText style={styles.actionText}>Comment</ThemedText>
        </Pressable>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <ThemedText style={styles.emptyTitle}>No posts yet</ThemedText>
      <ThemedText style={styles.emptySubtitle}>
        Follow creators to see their posts in your feed
      </ThemedText>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorState}>
      <ThemedText style={styles.errorTitle}>Something went wrong</ThemedText>
      <ThemedText style={styles.errorMessage}>{error}</ThemedText>
    </View>
  );

  if (authLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.headerBar}>
        <ThemedText style={styles.headerTitle}>Feed</ThemedText>
      </View>

      {/* Feed List */}
      {error ? (
        renderError()
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPostCard}
          ListEmptyComponent={renderEmpty}
          ListHeaderComponent={loading ? <LoadingSpinner /> : null}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  listContent: {
    paddingVertical: 8,
  },
  postCard: {
    marginHorizontal: 0,
    marginVertical: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  authorHandle: {
    fontSize: 13,
    opacity: 0.5,
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.5,
    marginLeft: 8,
  },
  postContent: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statLabel: {
    fontSize: 14,
  },
  statValue: {
    fontSize: 13,
    opacity: 0.6,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 0,
    justifyContent: 'flex-start',
    paddingTop: 8,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.7,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#d32f2f',
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 20,
  },
});
