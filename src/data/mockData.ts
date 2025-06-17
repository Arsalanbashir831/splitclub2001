import { User, Deal, DealLog } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Leo Kim',
    email: 'leo@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    isAdmin: false
  },
  {
    id: '2',
    name: 'Sarah Green',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b02c?w=150&h=150&fit=crop&crop=face',
    isAdmin: true
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isAdmin: false
  }
];

export const mockDeals: Deal[] = [
  {
    id: '1',
    title: 'Netflix Premium Family Slot',
    description: 'Share my Netflix Premium family plan! Only 2 slots left. Perfect for binge-watching your favorite shows.',
    category: 'subscription',
    originalPrice: 17.99,
    sharePrice: 4.50,
    isFree: false,
    availableSlots: 2,
    totalSlots: 4,
    expiryDate: '2024-07-15',
    tags: ['streaming', 'entertainment', 'family'],
    sharedBy: mockUsers[0],
    claimedBy: [mockUsers[1]],
    status: 'active',
    createdAt: '2024-06-01T10:00:00Z',
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=200&fit=crop'
  },
  {
    id: '2',
    title: 'Gym Membership Guest Passes',
    description: 'I have 5 unused guest passes for EquinoxFit. Free to community members who want to try it out!',
    category: 'membership',
    originalPrice: 35.00,
    sharePrice: 0,
    isFree: true,
    availableSlots: 3,
    totalSlots: 5,
    expiryDate: '2024-06-30',
    tags: ['fitness', 'health', 'gym'],
    sharedBy: mockUsers[1],
    claimedBy: [mockUsers[0], mockUsers[2]],
    status: 'active',
    createdAt: '2024-06-05T14:30:00Z',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop'
  },
  {
    id: '3',
    title: 'Spotify Premium Duo Spot',
    description: 'Looking for someone to split Spotify Premium Duo. Love discovering new music together!',
    category: 'subscription',
    originalPrice: 14.99,
    sharePrice: 7.50,
    isFree: false,
    availableSlots: 1,
    totalSlots: 2,
    expiryDate: '2024-08-01',
    tags: ['music', 'streaming', 'duo'],
    sharedBy: mockUsers[2],
    status: 'active',
    createdAt: '2024-06-03T09:15:00Z',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop'
  },
  {
    id: '4',
    title: 'Costco Shopping Rewards',
    description: 'Earned $50 in Costco cashback rewards but won\'t use them all. Sharing at 20% discount!',
    category: 'reward',
    originalPrice: 50.00,
    sharePrice: 40.00,
    isFree: false,
    availableSlots: 1,
    totalSlots: 1,
    expiryDate: '2024-06-25',
    tags: ['shopping', 'cashback', 'grocery'],
    sharedBy: mockUsers[1],
    status: 'active',
    createdAt: '2024-06-08T16:45:00Z',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop'
  },
  {
    id: '5',
    title: 'Adobe Creative Cloud Team',
    description: 'Adobe CC for Teams subscription with 2 available licenses. Perfect for creative professionals.',
    category: 'subscription',
    originalPrice: 79.99,
    sharePrice: 25.00,
    isFree: false,
    availableSlots: 0,
    totalSlots: 3,
    expiryDate: '2024-09-01',
    tags: ['design', 'creative', 'professional'],
    sharedBy: mockUsers[0],
    claimedBy: [mockUsers[1], mockUsers[2]],
    status: 'claimed',
    createdAt: '2024-05-28T11:20:00Z',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop'
  }
];

export const mockLogs: DealLog[] = [
  {
    id: '1',
    dealId: '1',
    userId: '2',
    action: 'claimed',
    timestamp: '2024-06-10T09:30:00Z'
  },
  {
    id: '2',
    dealId: '2',
    userId: '1',
    action: 'claimed',
    timestamp: '2024-06-11T14:15:00Z'
  },
  {
    id: '3',
    dealId: '1',
    userId: '3',
    action: 'viewed',
    timestamp: '2024-06-12T16:45:00Z'
  }
];