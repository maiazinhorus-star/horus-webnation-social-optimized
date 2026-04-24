import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';

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

  useEffect(() => {
    const stored = localStorage.getItem('horus_current_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      const users = getUsers();
      const found = users.find((u: User) => u.id === parsed.id);
      if (found) {
        found.isOnline = true;
        setUser(found);
        saveUsers(users.map((u: User) => u.id === found.id ? found : u));
        setAllUsers(getUsers());
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('horus_current_user', JSON.stringify(user));
      const users = getUsers();
      saveUsers(users.map((u: User) => u.id === user.id ? { ...user, isOnline: true } : u));
      setAllUsers(getUsers());
    }
  }, [user]);

  const login = (email: string, password: string): boolean => {
    const users = getUsers();
    const found = users.find(
      (u: User) => (u.email === email || u.nickname === email) && u.password === password
    );
    if (found) {
      found.isOnline = true;
      setUser(found);
      saveUsers(users.map((u: User) => u.id === found.id ? found : u));
      setAllUsers(getUsers());
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
    setAllUsers(getUsers());
    return true;
  };

  const logout = () => {
    if (user) {
      const users = getUsers();
      saveUsers(users.map((u: User) => u.id === user.id ? { ...u, isOnline: false } : u));
      setAllUsers(getUsers());
    }
    localStorage.removeItem('horus_current_user');
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    const users = getUsers();
    const updated = { ...user, ...userData };
    saveUsers(users.map((u: User) => u.id === user.id ? updated : u));
    setUser(updated);
    setAllUsers(getUsers());
  };

  const deleteUser = (userId: string) => {
    const users = getUsers();
    saveUsers(users.filter((u: User) => u.id !== userId));
    setAllUsers(getUsers());
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
