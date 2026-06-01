/**
 * Posts Service
 * Handles all Firestore operations for posts
 */

import {
    Timestamp,
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from 'firebase/firestore';
import { db } from './firebase-config';

const POSTS_COLLECTION = 'posts';

export interface CreatePostInput {
  uid: string;
  displayName: string;
  username: string;
  content: string;
}

export interface Post {
  id: string;
  uid: string;
  displayName: string;
  username: string;
  content: string;
  createdAt: Timestamp;
  likesCount: number;
  commentsCount: number;
}

export interface PostFirestoreData {
  uid: string;
  display_name: string;
  username: string;
  content: string;
  created_at: Timestamp;
  likes_count: number;
  comments_count: number;
}

/**
 * Create a new post in Firestore
 */
export async function createPost(input: CreatePostInput): Promise<Post> {
  const postsRef = collection(db, POSTS_COLLECTION);

  const postData: Omit<PostFirestoreData, 'id'> = {
    uid: input.uid,
    display_name: input.displayName,
    username: input.username,
    content: input.content,
    created_at: serverTimestamp() as Timestamp,
    likes_count: 0,
    comments_count: 0,
  };

  const docRef = await addDoc(postsRef, postData);

  return {
    id: docRef.id,
    uid: input.uid,
    displayName: input.displayName,
    username: input.username,
    content: input.content,
    createdAt: Timestamp.now(),
    likesCount: 0,
    commentsCount: 0,
  };
}

/**
 * Convert Firestore post document to Post interface
 */
export function firestoreDataToPost(id: string, data: PostFirestoreData): Post {
  return {
    id,
    uid: data.uid,
    displayName: data.display_name,
    username: data.username,
    content: data.content,
    createdAt: data.created_at,
    likesCount: data.likes_count,
    commentsCount: data.comments_count,
  };
}

/**
 * Load all posts from Firestore, ordered by creation time (newest first)
 */
export async function getPosts(): Promise<Post[]> {
  const postsRef = collection(db, POSTS_COLLECTION);
  const q = query(postsRef, orderBy('created_at', 'desc'));

  const snapshot = await getDocs(q);
  const posts = snapshot.docs.map((doc) =>
    firestoreDataToPost(doc.id, doc.data() as PostFirestoreData)
  );

  return posts;
}

/**
 * Delete a post from Firestore by its ID
 * Typically called after confirming the post owner
 */
export async function deletePost(postId: string): Promise<void> {
  const postRef = doc(db, POSTS_COLLECTION, postId);
  await deleteDoc(postRef);
}

/**
 * Update a post's content in Firestore
 * Only updates the content field to keep edits simple
 */
export async function updatePost(
  postId: string,
  newContent: string
): Promise<void> {
  const postRef = doc(db, POSTS_COLLECTION, postId);
  await updateDoc(postRef, {
    content: newContent,
  });
}
