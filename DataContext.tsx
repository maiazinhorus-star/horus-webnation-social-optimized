import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Post, Comment, ChatMessage, MuralMessage } from './index';
import { useAuth } from './AuthContext';

interface DataContextType {
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments'>) => void;
  deletePost: (postId: string) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (content: string) => void;
  muralMessages: MuralMessage[];
  addMuralMessage: (content: string, title?: string) => void;
  deleteMuralMessage: (id: string) => void;
  onlineCount: number;
}

const DataContext = createContext<DataContextType | null>(null);

function getPosts(): Post[] {
  const stored = localStorage.getItem('horus_posts');
  return stored ? JSON.parse(stored) : [];
}

function savePosts(posts: Post[]) {
  localStorage.setItem('horus_posts', JSON.stringify(posts));
}

function getChatMessages(): ChatMessage[] {
  const stored = localStorage.getItem('horus_chat');
  return stored ? JSON.parse(stored) : [];
}

function saveChatMessages(messages: ChatMessage[]) {
  localStorage.setItem('horus_chat', JSON.stringify(messages.slice(-200)));
}

function getMuralMessages(): MuralMessage[] {
  const stored = localStorage.getItem('horus_mural');
  return stored ? JSON.parse(stored) : [];
}

function saveMuralMessages(messages: MuralMessage[]) {
  localStorage.setItem('horus_mural', JSON.stringify(messages));
}

export function DataProvider({ children }: { children: ReactNode }) {
  const { user, allUsers } = useAuth();
  const [posts, setPosts] = useState<Post[]>(getPosts());
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(getChatMessages());
  const [muralMessages, setMuralMessages] = useState<MuralMessage[]>(getMuralMessages());
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    setOnlineCount(allUsers.filter((u) => u.isOnline).length);
  }, [allUsers]);

  // BroadcastChannel for real-time sync
  useEffect(() => {
    const channel = new BroadcastChannel('horus_channel');
    
    channel.onmessage = (event) => {
      const { type, data } = event.data;
      
      if (type === 'post_added') {
        setPosts((prev) => {
          if (prev.some(p => p.id === data.id)) return prev;
          return [data, ...prev];
        });
      } else if (type === 'post_deleted') {
        setPosts((prev) => prev.filter((p) => p.id !== data));
      } else if (type === 'post_liked') {
        setPosts((prev) => prev.map((p) => p.id === data.postId ? { ...p, likes: data.likes } : p));
      } else if (type === 'comment_added') {
        setPosts((prev) => prev.map((p) => {
          if (p.id !== data.postId) return p;
          if (p.comments.some(c => c.id === data.comment.id)) return p;
          return { ...p, comments: [...p.comments, data.comment] };
        }));
      } else if (type === 'chat_message') {
        setChatMessages((prev) => {
          if (prev.some(m => m.id === data.id)) return prev;
          return [...prev, data];
        });
      } else if (type === 'mural_added') {
        setMuralMessages((prev) => {
          if (prev.some(m => m.id === data.id)) return prev;
          return [data, ...prev];
        });
      } else if (type === 'mural_deleted') {
        setMuralMessages((prev) => prev.filter((m) => m.id !== data));
      }
    };

    return () => channel.close();
  }, []);

  // Storage event for cross-tab sync
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'horus_posts') {
        setPosts(e.newValue ? JSON.parse(e.newValue) : []);
      }
      if (e.key === 'horus_chat') {
        setChatMessages(e.newValue ? JSON.parse(e.newValue) : []);
      }
      if (e.key === 'horus_mural') {
        setMuralMessages(e.newValue ? JSON.parse(e.newValue) : []);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const broadcast = useCallback((type: string, data: unknown) => {
    const channel = new BroadcastChannel('horus_channel');
    channel.postMessage({ type, data });
    channel.close();
  }, []);

  const addPost = (postData: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments'>) => {
    const newPost: Post = {
      ...postData,
      id: 'post-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      likes: [],
      comments: [],
    };
    const updated = [newPost, ...posts];
    setPosts(updated);
    savePosts(updated);
    broadcast('post_added', newPost);
  };

  const deletePost = (postId: string) => {
    const updated = posts.filter((p) => p.id !== postId);
    setPosts(updated);
    savePosts(updated);
    broadcast('post_deleted', postId);
  };

  const likePost = (postId: string) => {
    if (!user) return;
    const updated = posts.map((p) => {
      if (p.id !== postId) return p;
      const likes = p.likes.includes(user.id)
        ? p.likes.filter((id) => id !== user.id)
        : [...p.likes, user.id];
      return { ...p, likes };
    });
    setPosts(updated);
    savePosts(updated);
    const post = updated.find((p) => p.id === postId);
    if (post) broadcast('post_liked', { postId, likes: post.likes });
  };

  const addComment = (postId: string, commentData: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...commentData,
      id: 'comment-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    const updated = posts.map((p) => {
      if (p.id !== postId) return p;
      return { ...p, comments: [...p.comments, newComment] };
    });
    setPosts(updated);
    savePosts(updated);
    broadcast('comment_added', { postId, comment: newComment });
  };

  const sendChatMessage = (content: string) => {
    if (!user || !content.trim()) return;
    const newMessage: ChatMessage = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userNickname: user.nickname,
      userAvatar: user.avatar,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...chatMessages, newMessage];
    setChatMessages(updated);
    saveChatMessages(updated);
    broadcast('chat_message', newMessage);
  };

  const addMuralMessage = (content: string, title?: string) => {
    if (!user?.isAdmin) return;
    const newMessage: MuralMessage = {
      id: 'mural-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      content: content.trim(),
      title: title?.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newMessage, ...muralMessages];
    setMuralMessages(updated);
    saveMuralMessages(updated);
    broadcast('mural_added', newMessage);
  };

  const deleteMuralMessage = (id: string) => {
    if (!user?.isAdmin) return;
    const updated = muralMessages.filter((m) => m.id !== id);
    setMuralMessages(updated);
    saveMuralMessages(updated);
    broadcast('mural_deleted', id);
  };

  return (
    <DataContext.Provider value={{
      posts, addPost, deletePost, likePost, addComment,
      chatMessages, sendChatMessage,
      muralMessages, addMuralMessage, deleteMuralMessage,
      onlineCount,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be inside DataProvider');
  return ctx;
}
