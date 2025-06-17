import { create } from 'zustand';
import { AuthState, User } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  
  login: async (email: string, password: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - accept any password for demo users
    const user = mockUsers.find(u => u.email === email);
    
    if (user) {
      set({ user, isAuthenticated: true });
      return true;
    }
    
    return false;
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  
  setUser: (user: User) => {
    set({ user, isAuthenticated: true });
  }
}));