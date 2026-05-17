export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  followers: number;
  following: number;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  isLiked?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isAiEnhanced?: boolean;
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
}

export interface AuraNotification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  user: User;
  content?: string;
  timestamp: string;
  isRead: boolean;
}

export interface Story {
  id: string;
  user: User;
  image: string;
  isSeen: boolean;
  songName?: string;
  artistName?: string;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: string;
}
