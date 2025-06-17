export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin?: boolean;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  category: 'subscription' | 'membership' | 'reward' | 'other';
  originalPrice: number;
  sharePrice: number;
  isFree: boolean;
  availableSlots: number;
  totalSlots: number;
  expiryDate: string;
  tags: string[];
  sharedBy: User;
  claimedBy?: User[];
  status: 'active' | 'claimed' | 'expired';
  createdAt: string;
  image?: string;
}

export interface DealLog {
  id: string;
  dealId: string;
  userId: string;
  action: 'viewed' | 'claimed' | 'shared' | 'reviewed';
  timestamp: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}