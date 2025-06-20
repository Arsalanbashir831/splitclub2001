
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/authStore';
import { useUserDeals } from '@/hooks/useUserDeals';
import { useFavoriteDeals } from '@/hooks/useFavoriteDeals';
import { useFavorites } from '@/hooks/useFavorites';
import { DealCard } from '@/components/DealCard';
import { Clock, MapPin, User, Package, Heart, HeartOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const ProfileSkeleton = () => (
  <div className="space-y-6">
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="w-20 h-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </CardContent>
    </Card>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-12" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

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
    <motion.div 
      className="min-h-screen bg-background"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        {isLoading ? (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <Skeleton className="w-20 h-20 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <motion.div variants={fadeInUp} transition={{ duration: 0.6 }}>
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
          </motion.div>
        )}

        {/* Tabs */}
        <motion.div variants={fadeInUp} transition={{ delay: 0.2 }}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="deals">My Deals ({userDeals.length})</TabsTrigger>
              <TabsTrigger value="claimed">Claimed ({claimedDeals.length})</TabsTrigger>
              <TabsTrigger value="favorites">Favorites ({favoriteDeals?.length || 0})</TabsTrigger>
            </TabsList>

            {/* My Deals Tab */}
            <TabsContent value="deals" className="mt-6">
              {isLoading ? (
                <ProfileSkeleton />
              ) : userDeals.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={staggerContainer}
                >
                  {userDeals.map((deal, index) => (
                    <motion.div
                      key={deal.id}
                      variants={fadeInUp}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="overflow-hidden">
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
                            className="w-full hover:scale-105 transition-transform"
                            onClick={() => handleDealView(deal.id)}
                          >
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  className="text-center py-12"
                  variants={fadeInUp}
                >
                  <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No deals yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't shared any deals yet. Start sharing to help others save!
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button onClick={() => navigate('/share-deal')}>
                      Share Your First Deal
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </TabsContent>

            {/* Claimed Deals Tab */}
            <TabsContent value="claimed" className="mt-6">
              {isLoading ? (
                <ProfileSkeleton />
              ) : claimedDeals.length > 0 ? (
                <motion.div 
                  className="space-y-4"
                  variants={staggerContainer}
                >
                  {claimedDeals.map((claim: any, index) => (
                    <motion.div
                      key={claim.id}
                      variants={fadeInUp}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <Card>
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
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  className="text-center py-12"
                  variants={fadeInUp}
                >
                  <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No claimed deals</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't claimed any deals yet. Browse available deals to get started!
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button onClick={() => navigate('/deals')}>
                      Browse Deals
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites" className="mt-6">
              {favoritesLoading ? (
                <ProfileSkeleton />
              ) : favoriteDeals && favoriteDeals.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={staggerContainer}
                >
                  {favoriteDeals.map((deal, index) => (
                    <motion.div 
                      key={deal.id} 
                      className="relative"
                      variants={fadeInUp}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <DealCard
                        deal={deal}
                        onClaim={() => {}}
                        onView={handleDealView}
                        isClaimLoading={false}
                      />
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                          onClick={() => handleRemoveFavorite(deal.id)}
                        >
                          <HeartOff className="h-4 w-4 text-red-500" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  className="text-center py-12"
                  variants={fadeInUp}
                >
                  <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No favorite deals</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't added any deals to your favorites yet. Browse deals and click the heart icon to save them!
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button onClick={() => navigate('/deals')}>
                      Browse Deals
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
};
