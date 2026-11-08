export type ThemeMode = 'light' | 'dark' | 'system';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'ja';

export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  verified?: boolean;
  followersCount: number;
  followingCount: number;
  likesCount: number;
  isFollowing?: boolean;
  joinedDate?: string;
  website?: string;
  category?: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  userAvatar: string;
  text: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  author: User;
  caption: string;
  tags: string[];
  musicTitle: string;
  musicAuthor: string;
  videoUrl?: string;
  thumbnailUrl: string;
  aspectRatio?: 'vertical' | 'square';
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
  comments: Comment[];
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'system';
  actor: {
    id: string;
    username: string;
    name: string;
    avatar: string;
  };
  content: string;
  targetPostId?: string;
  targetThumbnail?: string;
  createdAt: string;
  read: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface NotificationPreferences {
  likes: boolean;
  comments: boolean;
  newFollowers: boolean;
  directMessages: boolean;
  soundEnabled: boolean;
  emailDigest: boolean;
}

export interface UserSettings {
  theme: ThemeMode;
  language: Language;
  notifications: NotificationPreferences;
  autoplayVideos: boolean;
  privateAccount: boolean;
  highQualityVideo: boolean;
}
