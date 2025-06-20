
import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/store/authStore';
import { useUserDeals } from '@/hooks/useUserDeals';
import { useFavoriteDeals } from '@/hooks/useFavoriteDeals';
import { useFavorites } from '@/hooks/useFavorites';
import { DealCard } from '@/components/DealCard';
import { Clock, MapPin, User, Package, Heart, HeartOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user } = useAuthStore();
  const { userDeals, claimedDeals, isLoading } = useUserDeals();
  const { data: favoriteDeals, isLoading: favoritesLoading } = useFavoriteDeals();
  const { removeFavorite } = useFavorites();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('deals');

  const handleRemoveFavorite = (dealId: string) => {
    removeFavorite(dealId);
    toast({
      title: "Removed from favorites",
      description: "Deal removed from your favorites.",
    });
  };

  const handleDealView = (dealId: string) => {
    navigate(`/deal/${dealId}`);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold">Please log in to view your profile</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-primary-foreground" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
                {user.isAdmin && (
                  <Badge variant="secondary" className="mt-1">Admin</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="deals">My Deals ({userDeals.length})</TabsTrigger>
            <TabsTrigger value="claimed">Claimed ({claimedDeals.length})</TabsTrigger>
            <TabsTrigger value="favorites">Favorites ({favoriteDeals?.length || 0})</TabsTrigger>
          </TabsList>

          {/* My Deals Tab */}
          <TabsContent value="deals" className="mt-6">
            {isLoading ? (
              <div className="text-center py-8">Loading your deals...</div>
            ) : userDeals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userDeals.map((deal) => (
                  <Card key={deal.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg line-clamp-2">{deal.title}</CardTitle>
                        <Badge variant={deal.status === 'active' ? 'default' : 'secondary'}>
                          {deal.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{deal.category}</Badge>
                        <div className="text-right">
                          {deal.isFree ? (
                            <span className="font-bold text-green-600">FREE</span>
                          ) : (
                            <div>
                              <span className="font-bold text-green-600">${deal.sharePrice}</span>
                              {deal.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through ml-1">
                                  ${deal.originalPrice}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        Created: {new Date(deal.createdAt).toLocaleDateString()}
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        Expires: {new Date(deal.expiryDate).toLocaleDateString()}
                      </div>
                      
                      {deal.isLocationBound && deal.locationDetails && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          {deal.locationDetails}
                        </div>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleDealView(deal.id)}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No deals yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't shared any deals yet. Start sharing to help others save!
                </p>
                <Button onClick={() => navigate('/share-deal')}>
                  Share Your First Deal
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Claimed Deals Tab */}
          <TabsContent value="claimed" className="mt-6">
            {isLoading ? (
              <div className="text-center py-8">Loading claimed deals...</div>
            ) : claimedDeals.length > 0 ? (
              <div className="space-y-4">
                {claimedDeals.map((claim: any) => (
                  <Card key={claim.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{claim.deals?.title}</h3>
                          <p className="text-muted-foreground text-sm">
                            Claimed on {new Date(claim.claimed_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="secondary">Claimed</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No claimed deals</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't claimed any deals yet. Browse available deals to get started!
                </p>
                <Button onClick={() => navigate('/deals')}>
                  Browse Deals
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="mt-6">
            {favoritesLoading ? (
              <div className="text-center py-8">Loading favorite deals...</div>
            ) : favoriteDeals && favoriteDeals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteDeals.map((deal) => (
                  <div key={deal.id} className="relative">
                    <DealCard
                      deal={deal}
                      onClaim={() => {}}
                      onView={handleDealView}
                      isClaimLoading={false}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      onClick={() => handleRemoveFavorite(deal.id)}
                    >
                      <HeartOff className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No favorite deals</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't added any deals to your favorites yet. Browse deals and click the heart icon to save them!
                </p>
                <Button onClick={() => navigate('/deals')}>
                  Browse Deals
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
