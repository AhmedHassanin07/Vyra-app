/**
 * Home Feed Screen - MVP
 * Displays a social feed with posts from Firestore
 * Supports editing and deleting own posts
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { deletePost, getPosts, Post, updatePost } from '@/services/posts-service';
import { Timestamp } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    TextInput,
    useColorScheme,
    View,
} from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>('');
  const [savingPostId, setSavingPostId] = useState<string | null>(null);

  // Load posts from Firestore
  const loadPosts = useCallback(async () => {
    try {
      setError(null);
      const firestorePosts = await getPosts();
      setPosts(firestorePosts);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load feed';
      setError(message);
      console.error('Posts loading error:', err);
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

  const handleDeletePost = useCallback(
    (postId: string, postAuthorName: string) => {
      if (!user) {
        Alert.alert('Not Logged In', 'You must be logged in to delete posts.');
        return;
      }

      Alert.alert(
        'Delete Post?',
        `Are you sure you want to delete this post? This cannot be undone.`,
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              try {
                setDeletingPostId(postId);
                await deletePost(postId);
                // Remove post from feed UI
                setPosts((prevPosts) =>
                  prevPosts.filter((post) => post.id !== postId)
                );
              } catch (err) {
                const message =
                  err instanceof Error ? err.message : 'Failed to delete post';
                Alert.alert('Delete Failed', message);
                console.error('Post deletion error:', err);
              } finally {
                setDeletingPostId(null);
              }
            },
            style: 'destructive',
          },
        ]
      );
    },
    [user]
  );

  const validateContent = useCallback((text: string): string | null => {
    const trimmed = text.trim();
    const MIN_LENGTH = 3;
    const MAX_LENGTH = 280;

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

  const handleEditPost = useCallback(
    (postId: string, currentContent: string) => {
      if (!user) {
        Alert.alert('Not Logged In', 'You must be logged in to edit posts.');
        return;
      }

      setEditingPostId(postId);
      setEditingContent(currentContent);
    },
    [user]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingPostId(null);
    setEditingContent('');
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!editingPostId) return;

    const validationError = validateContent(editingContent);
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

    try {
      setSavingPostId(editingPostId);

      // Find the original post to check if content changed
      const originalPost = posts.find((p) => p.id === editingPostId);
      if (originalPost && originalPost.content === editingContent.trim()) {
        // Content hasn't changed, just exit edit mode
        setEditingPostId(null);
        setEditingContent('');
        return;
      }

      // Save to Firestore
      await updatePost(editingPostId, editingContent.trim());

      // Update local state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === editingPostId
            ? { ...post, content: editingContent.trim() }
            : post
        )
      );

      setEditingPostId(null);
      setEditingContent('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save post';
      Alert.alert('Save Failed', message);
      console.error('Post update error:', err);
    } finally {
      setSavingPostId(null);
    }
  }, [editingPostId, editingContent, validateContent, posts]);

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

  const renderPostCard = ({ item }: { item: Post }) => {
    const isOwnPost = user && item.uid === user.uid;
    const isDeleting = deletingPostId === item.id;
    const isEditing = editingPostId === item.id;
    const isSaving = savingPostId === item.id;

    return (
      <View style={styles.postCard}>
        {/* Post Header */}
        <View style={styles.postHeader}>
          <View style={styles.authorInfo}>
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarText}>
                {item.displayName.charAt(0).toUpperCase()}
              </ThemedText>
            </View>
            <View style={styles.authorDetails}>
              <ThemedText style={styles.authorName}>{item.displayName}</ThemedText>
              <ThemedText style={styles.authorHandle}>@{item.username}</ThemedText>
            </View>
          </View>
          <View style={styles.headerActions}>
            <ThemedText style={styles.timestamp}>{formatTime(item.createdAt)}</ThemedText>
            {isOwnPost && !isEditing && (
              <>
                <Pressable
                  style={[styles.editButton]}
                  onPress={() => handleEditPost(item.id, item.content)}
                >
                  <ThemedText style={styles.editButtonText}>Edit</ThemedText>
                </Pressable>
                <Pressable
                  style={[styles.deleteButton, isDeleting && styles.deleteButtonDisabled]}
                  onPress={() => handleDeletePost(item.id, item.displayName)}
                  disabled={isDeleting}
                >
                  <ThemedText
                    style={[
                      styles.deleteButtonText,
                      isDeleting && styles.deleteButtonTextDisabled,
                    ]}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </ThemedText>
                </Pressable>
              </>
            )}
          </View>
        </View>

        {/* Post Content - Edit Mode */}
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={[
                styles.editInput,
                {
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.tint,
                },
              ]}
              value={editingContent}
              onChangeText={setEditingContent}
              multiline
              maxLength={280}
              placeholder="Edit your post..."
              placeholderTextColor={colors.tabIconDefault}
              editable={!isSaving}
            />
            <View style={styles.editCharCount}>
              <ThemedText style={styles.charCountText}>
                {editingContent.length} / 280
              </ThemedText>
            </View>
          </View>
        ) : (
          /* Post Content - Normal Mode */
          <ThemedText style={styles.postContent}>{item.content}</ThemedText>
        )}

        {/* Post Stats */}
        {!isEditing && (
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <ThemedText style={styles.statLabel}>❤️</ThemedText>
              <ThemedText style={styles.statValue}>{item.likesCount}</ThemedText>
            </View>
            <View style={styles.stat}>
              <ThemedText style={styles.statLabel}>💬</ThemedText>
              <ThemedText style={styles.statValue}>{item.commentsCount}</ThemedText>
            </View>
          </View>
        )}

        {/* Post Actions or Edit Actions */}
        {isEditing ? (
          <View style={styles.editActionsRow}>
            <Pressable
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              onPress={handleSaveEdit}
              disabled={isSaving}
            >
              <ThemedText
                style={[
                  styles.saveButtonText,
                  isSaving && styles.saveButtonTextDisabled,
                ]}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </ThemedText>
            </Pressable>
            <Pressable
              style={styles.cancelButton}
              onPress={handleCancelEdit}
              disabled={isSaving}
            >
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </Pressable>
          </View>
        ) : (
          <View style={styles.actionsRow}>
            <Pressable style={styles.actionButton}>
              <ThemedText style={styles.actionText}>Like</ThemedText>
            </Pressable>
            <Pressable style={styles.actionButton}>
              <ThemedText style={styles.actionText}>Comment</ThemedText>
            </Pressable>
          </View>
        )}
      </View>
    );
  };

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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  deleteButtonDisabled: {
    opacity: 0.6,
  },
  deleteButtonText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  deleteButtonTextDisabled: {
    color: '#FF6B6B',
    opacity: 0.6,
  },
  editButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  editButtonText: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: '500',
  },
  editContainer: {
    marginBottom: 12,
  },
  editInput: {
    borderWidth: 1.5,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  editCharCount: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  charCountText: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.6,
  },
  editActionsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 8,
  },
  saveButton: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButtonTextDisabled: {
    color: 'white',
    opacity: 0.8,
  },
  cancelButton: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#999',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
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
