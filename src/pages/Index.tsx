import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '../components/Navbar';
import { DealCard } from '../components/DealCard';
import { DealFilters, FilterState } from '../components/DealFilters';
import { WelcomeTip } from '../components/WelcomeTip';
import { Deal } from '../types';
import { useAuthStore } from '../store/authStore';
import { Search, Leaf, TrendingUp, Users, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    category: [],
    priceRange: [0, 100],
    isFree: false,
    availableOnly: false,
    expiringWithin: 'any',
    sortBy: 'newest'
  });

  // Category mapping from database to UI
  const categoryMap: Record<string, Deal['category']> = {
    cinema: 'reward',
    gym: 'membership',
    restaurant: 'reward',
    vouchers: 'reward',
    discounts: 'other',
    subscriptions: 'subscription'
  };

  // Demo deals to show alongside real deals
  const demoDeals: Deal[] = [
    {
      id: 'demo-netflix',
      title: 'Netflix Premium Family Slot (DEMO)',
      description: 'Share my Netflix Premium family plan! Only 2 slots left. Perfect for binge-watching your favorite shows.',
      category: 'subscription',
      originalPrice: 17.99,
      sharePrice: 4.50,
      isFree: false,
      availableSlots: 2,
      totalSlots: 4,
      expiryDate: '2024-07-15',
      tags: ['streaming', 'entertainment', 'family', 'DEMO'],
      sharedBy: {
        id: 'demo-user',
        name: 'Demo User',
        email: '',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      status: 'active',
      createdAt: '2024-06-01T10:00:00Z'
    },
    {
      id: 'demo-gym',
      title: 'Gym Membership Guest Passes (DEMO)',
      description: 'I have 5 unused guest passes for EquinoxFit. Free to community members who want to try it out!',
      category: 'membership',
      originalPrice: 35.00,
      sharePrice: 0,
      isFree: true,
      availableSlots: 3,
      totalSlots: 5,
      expiryDate: '2024-06-30',
      tags: ['fitness', 'health', 'gym', 'DEMO'],
      sharedBy: {
        id: 'demo-user',
        name: 'Demo User',
        email: '',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      status: 'active',
      createdAt: '2024-06-05T14:30:00Z'
    },
    {
      id: 'demo-rewards',
      title: 'Costco Shopping Rewards (DEMO)',
      description: 'Earned $50 in Costco cashback rewards but won\'t use them all. Sharing at 20% discount!',
      category: 'reward',
      originalPrice: 50.00,
      sharePrice: 40.00,
      isFree: false,
      availableSlots: 1,
      totalSlots: 1,
      expiryDate: '2024-06-25',
      tags: ['shopping', 'cashback', 'grocery', 'DEMO'],
      sharedBy: {
        id: 'demo-user',
        name: 'Demo User',
        email: '',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      status: 'active',
      createdAt: '2024-06-08T16:45:00Z'
    },
    {
      id: 'demo-adobe',
      title: 'Adobe Creative Cloud Team (DEMO)',
      description: 'Adobe CC for Teams subscription with 2 available licenses. Perfect for creative professionals.',
      category: 'subscription',
      originalPrice: 79.99,
      sharePrice: 25.00,
      isFree: false,
      availableSlots: 2,
      totalSlots: 3,
      expiryDate: '2024-09-01',
      tags: ['design', 'creative', 'professional', 'DEMO'],
      sharedBy: {
        id: 'demo-user',
        name: 'Demo User',
        email: '',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      status: 'active',
      createdAt: '2024-05-28T11:20:00Z'
    }
  ];

  const fetchDeals = async () => {
    try {
      const { data: dealsData, error } = await supabase
        .from('deals')
        .select(`
          *,
          profiles!deals_user_id_fkey (
            display_name,
            avatar_url
          )
        `)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching deals:', error);
        return;
      }

      // Transform database data to match Deal interface
      const transformedDeals: Deal[] = dealsData?.map((deal: any) => ({
        id: deal.id,
        title: deal.title,
        description: deal.usage_notes || `${deal.source} ${deal.category} deal`,
        category: categoryMap[deal.category] || 'other',
        originalPrice: deal.original_price || (deal.price ? deal.price * 1.5 : 50),
        sharePrice: deal.price || 0,
        isFree: !deal.is_for_sale,
        availableSlots: 1, // Default to 1 slot available
        totalSlots: 1,     // Default to 1 total slot
        expiryDate: deal.expiry_date,
        tags: deal.tags || [],
        sharedBy: {
          id: deal.user_id,
          name: deal.profiles?.display_name || 'Anonymous',
          email: '', // Not exposing email for privacy
          avatar: deal.profiles?.avatar_url
        },
        status: deal.status,
        createdAt: deal.created_at
      })) || [];

      // Combine real deals with demo deals
      setDeals([...transformedDeals, ...demoDeals]);
    } catch (error) {
      console.error('Error fetching deals:', error);
      toast({
        title: "Error",
        description: "Failed to load deals. Please try again.",
        variant: "destructive",
      });
      // If there's an error, still show demo deals
      setDeals(demoDeals);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleDealClaim = (dealId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to claim deals",
        variant: "destructive",
      });
      return;
    }
    // Handle claim logic here
  };

  const handleDealView = (dealId: string) => {
    // Handle view tracking here
    console.log('Viewing deal:', dealId);
  };

  const filteredDeals = useMemo(() => {
    let filteredList = [...deals];

    // Search filter
    if (searchQuery) {
      filteredList = filteredList.filter(deal =>
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (filters.category.length > 0) {
      filteredList = filteredList.filter(deal => filters.category.includes(deal.category));
    }

    // Price filter
    if (!filters.isFree) {
      filteredList = filteredList.filter(deal => 
        deal.isFree || (deal.sharePrice >= filters.priceRange[0] && deal.sharePrice <= filters.priceRange[1])
      );
    } else {
      filteredList = filteredList.filter(deal => deal.isFree);
    }

    // Available only filter
    if (filters.availableOnly) {
      filteredList = filteredList.filter(deal => deal.status === 'active' && deal.availableSlots > 0);
    }

    // Expiring within filter
    if (filters.expiringWithin !== 'any') {
      const days = parseInt(filters.expiringWithin);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() + days);
      
      filteredList = filteredList.filter(deal => {
        const expiryDate = new Date(deal.expiryDate);
        return expiryDate <= cutoffDate;
      });
    }

    // Sort
    switch (filters.sortBy) {
      case 'newest':
        filteredList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'expiring':
        filteredList.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
        break;
      case 'price-low':
        filteredList.sort((a, b) => a.sharePrice - b.sharePrice);
        break;
      case 'price-high':
        filteredList.sort((a, b) => b.sharePrice - a.sharePrice);
        break;
      case 'popular':
        filteredList.sort((a, b) => (b.totalSlots - b.availableSlots) - (a.totalSlots - a.availableSlots));
        break;
    }

    return filteredList;
  }, [searchQuery, filters, deals]);

  const clearFilters = () => {
    setFilters({
      category: [],
      priceRange: [0, 100],
      isFree: false,
      availableOnly: false,
      expiringWithin: 'any',
      sortBy: 'newest'
    });
    setSearchQuery('');
  };

  const stats = {
    totalDeals: deals.length,
    activeDeals: deals.filter(d => d.status === 'active').length,
    totalSavings: deals.reduce((sum, deal) => sum + (deal.originalPrice - deal.sharePrice), 0),
    freeDeals: deals.filter(d => d.isFree).length
  };

  return (
    <div className="min-h-screen bg-background">
      <WelcomeTip />
      <Navbar />
      
      {/* Hero section */}
      <div className="bg-gradient-to-r from-primary/10 via-background to-accent/10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
                <Leaf className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Share. Save. Sustain.
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join the community marketplace for unused subscriptions, memberships, and rewards. 
              Reduce waste while saving money together.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center space-x-2 bg-card px-4 py-2 rounded-lg border">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-medium">${stats.totalSavings.toFixed(0)}+ saved</span>
              </div>
              <div className="flex items-center space-x-2 bg-card px-4 py-2 rounded-lg border">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="font-medium">{stats.activeDeals} active deals</span>
              </div>
              <div className="flex items-center space-x-2 bg-card px-4 py-2 rounded-lg border">
                <Gift className="h-4 w-4 text-purple-600" />
                <span className="font-medium">{stats.freeDeals} free offers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters sidebar */}
          <div className="lg:col-span-1">
            <DealFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
              isOpen={isFiltersOpen}
              onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
            />
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Search and header */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Available Deals</h2>
                  <p className="text-muted-foreground">
                    {filteredDeals.length} deals found
                  </p>
                </div>
                {!isAuthenticated && (
                  <Button size="lg" className="sm:w-auto">
                    Join SplitClub
                  </Button>
                )}
              </div>

              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search deals by title, description, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Active filters */}
              {(searchQuery || filters.category.length > 0 || filters.isFree || filters.availableOnly || filters.expiringWithin !== 'any') && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {searchQuery && (
                    <Badge variant="secondary" className="px-3 py-1">
                      Search: "{searchQuery}"
                    </Badge>
                  )}
                  {filters.category.map(category => (
                    <Badge key={category} variant="secondary" className="px-3 py-1">
                      {category}
                    </Badge>
                  ))}
                  {filters.isFree && (
                    <Badge variant="secondary" className="px-3 py-1">
                      Free only
                    </Badge>
                  )}
                  {filters.availableOnly && (
                    <Badge variant="secondary" className="px-3 py-1">
                      Available only
                    </Badge>
                  )}
                  {filters.expiringWithin !== 'any' && (
                    <Badge variant="secondary" className="px-3 py-1">
                      Expires in {filters.expiringWithin} days
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-auto p-1 text-muted-foreground hover:text-foreground"
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </div>

            {/* Deals grid */}
            {filteredDeals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDeals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    onClaim={handleDealClaim}
                    onView={handleDealView}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No deals found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filters to find more deals.
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              This app was created with the help of{' '}
              <a 
                href="https://launchmd.ingenious.agency" 
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                LaunchMD
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
