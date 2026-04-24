import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from './index';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (userData: Omit<User, 'id' | 'createdAt' | 'isOnline' | 'isAdmin'>) => boolean;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  allUsers: User[];
  deleteUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ADMIN_USER = {
  id: 'admin-001',
  nickname: 'MaiazinHorus',
  email: 'maiazinhorus',
  password: 'horus2026',
  bio: '👁️ Dono do Horus WebNation - A rede social dos escolhidos',
  avatar: '',
  whatsapp: '',
  instagram: '',
  telegram: '',
  createdAt: new Date().toISOString(),
  isOnline: false,
  isAdmin: true,
};

function getUsers(): User[] {
  const stored = localStorage.getItem('horus_users');
  if (!stored) {
    const initial = [ADMIN_USER];
    localStorage.setItem('horus_users', JSON.stringify(initial));
    return initial;
  }
  const users = JSON.parse(stored);
  if (!users.find((u: User) => u.id === 'admin-001')) {
    users.unshift(ADMIN_USER);
    localStorage.setItem('horus_users', JSON.stringify(users));
  }
  return users;
}

function saveUsers(users: User[]) {
  localStorage.setItem('horus_users', JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(getUsers());

  const broadcast = useCallback((type: string, data: unknown) => {
    const channel = new BroadcastChannel('horus_auth_channel');
    channel.postMessage({ type, data });
    channel.close();
  }, []);

  useEffect(() => {
    const channel = new BroadcastChannel('horus_auth_channel');
    channel.onmessage = (event) => {
      const { type } = event.data;
      if (type === 'users_updated') {
        setAllUsers(getUsers());
      }
    };
    
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'horus_users') {
        setAllUsers(getUsers());
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      channel.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('horus_current_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      const users = getUsers();
      const found = users.find((u: User) => u.id === parsed.id);
      if (found) {
        found.isOnline = true;
        setUser(found);
        const updatedUsers = users.map((u: User) => u.id === found.id ? found : u);
        saveUsers(updatedUsers);
        setAllUsers(updatedUsers);
        broadcast('users_updated', null);
      }
    }
  }, [broadcast]);

  const login = (email: string, password: string): boolean => {
    const users = getUsers();
    const found = users.find(
      (u: User) => (u.email === email || u.nickname === email) && u.password === password
    );
    if (found) {
      found.isOnline = true;
      setUser(found);
      const updatedUsers = users.map((u: User) => u.id === found.id ? found : u);
      saveUsers(updatedUsers);
      setAllUsers(updatedUsers);
      localStorage.setItem('horus_current_user', JSON.stringify(found));
      broadcast('users_updated', null);
      return true;
    }
    return false;
  };

  const register = (userData: Omit<User, 'id' | 'createdAt' | 'isOnline' | 'isAdmin'>): boolean => {
    const users = getUsers();
    const exists = users.find(
      (u: User) => u.email === userData.email || u.nickname === userData.nickname
    );
    if (exists) return false;

    const newUser: User = {
      ...userData,
      id: 'user-' + Date.now(),
      createdAt: new Date().toISOString(),
      isOnline: true,
      isAdmin: false,
    };
    users.push(newUser);
    saveUsers(users);
    setUser(newUser);
    setAllUsers(users);
    localStorage.setItem('horus_current_user', JSON.stringify(newUser));
    broadcast('users_updated', null);
    return true;
  };

  const logout = () => {
    if (user) {
      const users = getUsers();
      const updatedUsers = users.map((u: User) => u.id === user.id ? { ...u, isOnline: false } : u);
      saveUsers(updatedUsers);
      setAllUsers(updatedUsers);
      broadcast('users_updated', null);
    }
    localStorage.removeItem('horus_current_user');
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    const users = getUsers();
    const updated = { ...user, ...userData };
    const updatedUsers = users.map((u: User) => u.id === user.id ? updated : u);
    saveUsers(updatedUsers);
    setUser(updated);
    setAllUsers(updatedUsers);
    localStorage.setItem('horus_current_user', JSON.stringify(updated));
    broadcast('users_updated', null);
  };

  const deleteUser = (userId: string) => {
    const users = getUsers();
    const updatedUsers = users.filter((u: User) => u.id !== userId);
    saveUsers(updatedUsers);
    setAllUsers(updatedUsers);
    broadcast('users_updated', null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, allUsers, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
