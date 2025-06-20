
import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '../components/Navbar';
import { DealCard } from '../components/DealCard';
import { DealFilters, FilterState } from '../components/DealFilters';
import { WelcomeTip } from '../components/WelcomeTip';
import { DemoVideoSection } from '../components/DemoVideoSection';
import { Deal } from '../types';
import { mockDeals } from '../data/mockData';
import { useAuthStore } from '../store/authStore';
import { Search, Leaf, TrendingUp, Users, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'react-router-dom';

const Index = () => {
  const { isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: [],
    priceRange: [0, 100],
    isFree: false,
    availableOnly: false,
    expiringWithin: 'any',
    sortBy: 'newest'
  });

  // Handle search from URL parameters
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
  }, [searchParams]);

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
    let deals = [...mockDeals];

    // Search filter
    if (searchQuery) {
      deals = deals.filter(deal =>
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (filters.category.length > 0) {
      deals = deals.filter(deal => filters.category.includes(deal.category));
    }

    // Price filter
    if (!filters.isFree) {
      deals = deals.filter(deal => 
        deal.isFree || (deal.sharePrice >= filters.priceRange[0] && deal.sharePrice <= filters.priceRange[1])
      );
    } else {
      deals = deals.filter(deal => deal.isFree);
    }

    // Available only filter
    if (filters.availableOnly) {
      deals = deals.filter(deal => deal.status === 'active' && deal.availableSlots > 0);
    }

    // Expiring within filter
    if (filters.expiringWithin !== 'any') {
      const days = parseInt(filters.expiringWithin);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() + days);
      
      deals = deals.filter(deal => {
        const expiryDate = new Date(deal.expiryDate);
        return expiryDate <= cutoffDate;
      });
    }

    // Sort
    switch (filters.sortBy) {
      case 'newest':
        deals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'expiring':
        deals.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
        break;
      case 'price-low':
        deals.sort((a, b) => a.sharePrice - b.sharePrice);
        break;
      case 'price-high':
        deals.sort((a, b) => b.sharePrice - a.sharePrice);
        break;
      case 'popular':
        deals.sort((a, b) => (b.totalSlots - b.availableSlots) - (a.totalSlots - a.availableSlots));
        break;
    }

    return deals;
  }, [searchQuery, filters]);

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
    totalDeals: mockDeals.length,
    activeDeals: mockDeals.filter(d => d.status === 'active').length,
    totalSavings: mockDeals.reduce((sum, deal) => sum + (deal.originalPrice - deal.sharePrice), 0),
    freeDeals: mockDeals.filter(d => d.isFree).length
  };

  return (
    <div className="min-h-screen bg-background">
      <WelcomeTip />
      <Navbar />
      
      {/* Hero section */}
      <div className="bg-gradient-to-r from-primary/10 via-background to-accent/10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
                <Leaf className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Share. Save. Sustain.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
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

      {/* Demo Video Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DemoVideoSection />
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
