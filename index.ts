export interface User {
  id: string;
  nickname: string;
  email: string;
  password: string;
  bio: string;
  avatar: string;
  whatsapp: string;
  instagram: string;
  telegram: string;
  createdAt: string;
  isOnline: boolean;
  isAdmin: boolean;
}

export interface Post {
  id: string;
  userId: string;
  userNickname: string;
  userAvatar: string;
  content: string;
  image?: string;
  video?: string;
  createdAt: string;
  likes: string[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  userNickname: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userNickname: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}
