/**
 * Mock Posts Data - MVP Placeholder
 * This is temporary test data for the Home Feed MVP
 * In production, this will be replaced with real Firestore queries
 */

import { Timestamp } from 'firebase/firestore';

export interface Post {
  id: string;
  uid: string;
  authorName: string;
  authorUsername: string;
  content: string;
  timestamp: Timestamp;
  likes: number;
  comments: number;
}

// Convert JS date to Firestore Timestamp
const createTimestamp = (daysAgo: number): Timestamp => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return Timestamp.fromDate(date);
};

export const MOCK_POSTS: Post[] = [
  {
    id: 'post_1',
    uid: 'user_1',
    authorName: 'Sarah Chen',
    authorUsername: 'sarahchen',
    content: 'Just launched my new design system! Really excited to share what I\'ve been working on. Check it out and let me know your thoughts!',
    timestamp: createTimestamp(0),
    likes: 234,
    comments: 42,
  },
  {
    id: 'post_2',
    uid: 'user_2',
    authorName: 'Alex Rivera',
    authorUsername: 'alexrivera',
    content: 'Learning React Native has been such a journey. The docs are great and the community is amazing. If anyone wants to chat about mobile dev, let me know!',
    timestamp: createTimestamp(1),
    likes: 156,
    comments: 28,
  },
  {
    id: 'post_3',
    uid: 'user_3',
    authorName: 'Jordan Kim',
    authorUsername: 'jordankim',
    content: 'Finished my first Expo project today. It feels good to build something that works on both iOS and Android without ejecting. MVP mentality wins!',
    timestamp: createTimestamp(2),
    likes: 389,
    comments: 67,
  },
  {
    id: 'post_4',
    uid: 'user_4',
    authorName: 'Taylor Morgan',
    authorUsername: 'taylormorgan',
    content: 'Hot take: good documentation is underrated. Spent today writing docs for my team\'s components. It\'s not glamorous but it\'s essential.',
    timestamp: createTimestamp(3),
    likes: 112,
    comments: 19,
  },
  {
    id: 'post_5',
    uid: 'user_5',
    authorName: 'Casey Liu',
    authorUsername: 'caseyliu',
    content: 'Building in public is scary but rewarding. Launched the beta today and got incredible feedback. Here we go! 🚀',
    timestamp: createTimestamp(4),
    likes: 567,
    comments: 89,
  },
];
