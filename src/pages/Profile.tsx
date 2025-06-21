import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { EditDealModal } from '../components/DealEdit/EditDealModal';
import { ClaimedDealCard } from '../components/Profile/ClaimedDealCard';
import { useUserDeals } from '../hooks/useUserDeals';
import { useFavoriteDeals } from '../hooks/useFavoriteDeals';
import { useAuthStore } from '../store/authStore';
import { Deal } from '../types';
import { 
  User, 
  Settings, 
  Gift, 
  Heart, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Star,
  Plus,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Clock,
  Users,
  Crown,
  Award,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileSkeleton = () => (
  <div className="space-y-6">
    {/* Stats Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="border-0 shadow-lg">
          <CardContent className="p-0">
            <Skeleton className="h-48 w-full" />
            <div className="p-6 space-y-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex space-x-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-12" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const DealCard = ({ deal, onEdit, onDelete, onView, showActions = true }: {
  deal: Deal;
  onEdit?: (deal: Deal) => void;
  onDelete?: (dealId: string) => void;
  onView: (dealId: string) => void;
  showActions?: boolean;
}) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -4 }}
    transition={{ duration: 0.2 }}
    className="h-full"
  >
    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card h-full">
      <CardContent className="p-0 h-full flex flex-col">
        {/* Image Section */}
        <div className="relative h-48 bg-gradient-to-br from-primary to-purple-600 overflow-hidden">
          {deal.imageUrl ? (
            <img
              src={deal.imageUrl}
              alt={deal.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Gift className="w-16 h-16 text-primary-foreground/80" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-background/90 text-foreground">
              {deal.category}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant={deal.status === 'active' ? 'default' : 'destructive'}>
              {deal.status}
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-3 line-clamp-2 text-foreground">
              {deal.title}
            </h3>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                <span>Created: {new Date(deal.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-2 text-green-500" />
                <span>{deal.availableSlots} of {deal.totalSlots} slots available</span>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-2 text-orange-500" />
                <span>Expires: {new Date(deal.expiryDate).toLocaleDateString()}</span>
              </div>
              
              {deal.isLocationBound && deal.locationDetails && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2 text-red-500" />
                  <span className="truncate">{deal.locationDetails}</span>
                </div>
              )}
            </div>

            {/* Price Section */}
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700 dark:text-green-400 font-medium">Price</span>
                <div className="text-right">
                  {deal.isFree ? (
                    <span className="font-bold text-green-600 dark:text-green-400 text-lg">FREE</span>
                  ) : (
                    <div>
                      <span className="font-bold text-green-600 dark:text-green-400 text-lg">${deal.sharePrice}</span>
                      {deal.originalPrice > deal.sharePrice && (
                        <div className="text-sm text-muted-foreground line-through">
                          ${deal.originalPrice}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onView(deal.id)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            {showActions && onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(deal)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {showActions && onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(deal.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuthStore();
  const { userDeals, claimedDeals, isLoading: userDealsLoading, error } = useUserDeals();
  const { data: favoriteDeals, isLoading: favoritesLoading } = useFavoriteDeals();
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditDeal = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedDeal(null);
  };

  const handleDeleteDeal = async (dealId: string) => {
    console.log(`Deleting deal with ID: ${dealId}`);
  };

  const handleViewDeal = (dealId: string) => {
    navigate(`/deal/${dealId}`);
  };

  const handleSaveDeal = async (updatedDeal: Deal) => {
    console.log('Saving deal:', updatedDeal);
    handleCloseEditModal();
  };

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const isLoading = userDealsLoading || favoritesLoading;

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="border-0 shadow-xl bg-destructive/10 border-destructive/20">
            <CardContent className="text-center p-12">
              <h1 className="text-2xl font-bold text-destructive">Error loading profile</h1>
              <p className="text-destructive/80 mt-2">{error.message}</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate stats
  const totalDealsCreated = userDeals?.length || 0;
  const totalDealsClaimed = claimedDeals?.length || 0;
  const totalFavorites = favoriteDeals?.length || 0;

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Navbar />

      {/* Hero Section */}
      <motion.div 
        className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 dark:from-slate-800 dark:via-slate-700 dark:to-slate-900 text-primary-foreground overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/5 dark:from-black/30 dark:via-black/10 dark:to-black/20"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center space-x-8 flex-1">
              {/* Avatar with Enhanced Styling */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-white/30 to-white/10 rounded-full blur-sm"></div>
                <Avatar className="relative h-28 w-28 border-4 border-white/30 shadow-2xl ring-4 ring-white/20">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-primary-foreground/90 to-primary-foreground/70 text-primary font-bold">
                    {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                {/* Online Status Indicator */}
                <div className="absolute bottom-2 right-2 h-6 w-6 bg-green-500 border-3 border-white rounded-full shadow-lg"></div>
              </div>
              
              {/* User Info with Enhanced Typography */}
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white drop-shadow-lg">
                  {user?.name}
                </h1>
                <p className="text-white/90 text-lg mb-4 font-medium">
                  {user?.email}
                </p>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2 text-sm font-medium">
                    <User className="h-4 w-4 mr-2" />
                    Premium Member
                  </Badge>
                  <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-100 border-emerald-300/30 backdrop-blur-sm px-4 py-2 text-sm font-medium">
                    <Crown className="h-4 w-4 mr-2" />
                    Active
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Action Buttons with Enhanced Styling */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                size="lg"
                className="bg-white/15 border-white/30 text-white hover:bg-white/25 hover:border-white/40 backdrop-blur-sm transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                onClick={() => navigate('/settings')}
              >
                <Settings className="h-5 w-5 mr-2" />
                Edit Profile
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="bg-red-500/15 border-red-300/30 text-red-100 hover:bg-red-500/25 hover:border-red-300/40 backdrop-blur-sm transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </div>
          </div>
          
          {/* Additional User Stats Row */}
          <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl font-bold text-white">{totalDealsCreated}</div>
              <div className="text-sm text-white/80">Deals Created</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl font-bold text-white">{totalDealsClaimed}</div>
              <div className="text-sm text-white/80">Deals Claimed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl font-bold text-white">{totalFavorites}</div>
              <div className="text-sm text-white/80">Favorites</div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards with Enhanced Positioning */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 -mt-12 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Card className="border-0 shadow-xl bg-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Gift className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Deals Created</p>
                  <p className="text-3xl font-bold text-foreground">{totalDealsCreated}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
                  <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Deals Claimed</p>
                  <p className="text-3xl font-bold text-foreground">{totalDealsClaimed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
                  <Heart className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Favorites</p>
                  <p className="text-3xl font-bold text-foreground">{totalFavorites}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs Section */}
        <Tabs defaultValue="deals" className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-3 w-fit bg-card shadow-lg border-0 p-1">
              <TabsTrigger value="deals" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Gift className="h-4 w-4" />
                Your Deals ({totalDealsCreated})
              </TabsTrigger>
              <TabsTrigger value="claimed" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <TrendingUp className="h-4 w-4" />
                Claimed ({totalDealsClaimed})
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Heart className="h-4 w-4" />
                Favorites ({totalFavorites})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="deals" className="space-y-6">
            {isLoading ? (
              <ProfileSkeleton />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {userDeals?.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    onEdit={handleEditDeal}
                    onDelete={handleDeleteDeal}
                    onView={handleViewDeal}
                    showActions={true}
                  />
                ))}
                {(!userDeals || userDeals.length === 0) && (
                  <div className="col-span-full">
                    <Card className="border-0 shadow-xl bg-card">
                      <CardContent className="text-center py-16">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Gift className="h-10 w-10 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-foreground">No deals created yet</h3>
                        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                          Start sharing your unused subscriptions, memberships, and rewards to help others save money while reducing waste.
                        </p>
                        <Button onClick={() => navigate('/share-deal')} size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                          <Plus className="h-5 w-5 mr-2" />
                          Share Your First Deal
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="claimed" className="space-y-6">
            {isLoading ? (
              <ProfileSkeleton />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {claimedDeals?.map((claim) => (
                  <ClaimedDealCard
                    key={claim.id}
                    claim={claim}
                    onViewDetails={handleViewDeal}
                  />
                ))}
                {(!claimedDeals || claimedDeals.length === 0) && (
                  <div className="col-span-full">
                    <Card className="border-0 shadow-xl bg-card">
                      <CardContent className="text-center py-16">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                          <TrendingUp className="h-10 w-10 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-foreground">No deals claimed yet</h3>
                        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                          Browse amazing deals from the community and start saving money on subscriptions and memberships.
                        </p>
                        <Button onClick={() => navigate('/deals')} size="lg" className="bg-gradient-to-r from-green-500 to-primary hover:from-green-600 hover:to-primary/80">
                          <Gift className="h-5 w-5 mr-2" />
                          Browse Available Deals
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            {isLoading ? (
              <ProfileSkeleton />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {favoriteDeals?.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    onView={handleViewDeal}
                    showActions={false}
                  />
                ))}
                {(!favoriteDeals || favoriteDeals.length === 0) && (
                  <div className="col-span-full">
                    <Card className="border-0 shadow-xl bg-card">
                      <CardContent className="text-center py-16">
                        <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Heart className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-foreground">No favorite deals yet</h3>
                        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                          Mark deals as favorites to easily find them later and get notified about similar offers.
                        </p>
                        <Button onClick={() => navigate('/deals')} size="lg" className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                          <Star className="h-5 w-5 mr-2" />
                          Discover Great Deals
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {selectedDeal && (
        <EditDealModal 
          isOpen={isEditModalOpen} 
          onClose={handleCloseEditModal} 
          deal={selectedDeal}
          onSave={handleSaveDeal}
        />
      )}
      <Footer />
    </motion.div>
  );
};

export default Profile;
