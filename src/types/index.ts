
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
  category: 'subscription' | 'membership' | 'reward' | 'cinema' | 'gym' | 'restaurant' | 'vouchers' | 'discounts' | 'other';
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
  imageUrl?: string;
  imageFileName?: string;
  source?: string;
  redemptionType?: 'voucher_code' | 'barcode' | 'pdf' | 'qr';
  voucherData?: string;
  isLocationBound?: boolean;
  locationDetails?: string;
  isForSale?: boolean;
  usageNotes?: string;
}

export interface DealLog {
  id: string;
  dealId: string;
  userId: string;
  action: 'viewed' | 'claimed' | 'shared' | 'reviewed';
  timestamp: string;
}

export interface UserConsent {
  id: string;
  userId: string;
  consentType: 'privacy' | 'cookies' | 'marketing';
  consentGiven: boolean;
  consentDate: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading?: boolean;
}

export interface DealClaim {
  id: string;
  dealId: string;
  userId: string;
  claimedAt: string;
}
