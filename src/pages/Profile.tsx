
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
    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50 h-full">
      <CardContent className="p-0 h-full flex flex-col">
        {/* Image Section */}
        <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
          {deal.imageUrl ? (
            <img
              src={deal.imageUrl}
              alt={deal.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Gift className="w-16 h-16 text-white/80" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-white/90 text-slate-700">
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
            <h3 className="font-bold text-lg mb-3 line-clamp-2 text-slate-900">
              {deal.title}
            </h3>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-slate-600">
                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                <span>Created: {new Date(deal.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center text-sm text-slate-600">
                <Users className="h-4 w-4 mr-2 text-green-500" />
                <span>{deal.availableSlots} of {deal.totalSlots} slots available</span>
              </div>
              
              <div className="flex items-center text-sm text-slate-600">
                <Clock className="h-4 w-4 mr-2 text-orange-500" />
                <span>Expires: {new Date(deal.expiryDate).toLocaleDateString()}</span>
              </div>
              
              {deal.isLocationBound && deal.locationDetails && (
                <div className="flex items-center text-sm text-slate-600">
                  <MapPin className="h-4 w-4 mr-2 text-red-500" />
                  <span className="truncate">{deal.locationDetails}</span>
                </div>
              )}
            </div>

            {/* Price Section */}
            <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700 font-medium">Price</span>
                <div className="text-right">
                  {deal.isFree ? (
                    <span className="font-bold text-green-600 text-lg">FREE</span>
                  ) : (
                    <div>
                      <span className="font-bold text-green-600 text-lg">${deal.sharePrice}</span>
                      {deal.originalPrice > deal.sharePrice && (
                        <div className="text-sm text-slate-500 line-through">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="border-0 shadow-xl bg-red-50 border-red-200">
            <CardContent className="text-center p-12">
              <h1 className="text-2xl font-bold text-red-700">Error loading profile</h1>
              <p className="text-red-600 mt-2">{error.message}</p>
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
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Navbar />

      {/* Hero Section */}
      <motion.div 
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-8 md:mb-0">
              <Avatar className="h-24 w-24 border-4 border-white/20 shadow-xl">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-4xl font-bold mb-2">{user?.name}</h1>
                <p className="text-blue-100 text-lg">{user?.email}</p>
                <div className="flex items-center mt-3">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    <User className="h-4 w-4 mr-1" />
                    Member
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-slate-900" onClick={() => navigate('/settings')}>
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-slate-900" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 -mt-8 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Gift className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Deals Created</p>
                  <p className="text-3xl font-bold text-slate-900">{totalDealsCreated}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Deals Claimed</p>
                  <p className="text-3xl font-bold text-slate-900">{totalDealsClaimed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Heart className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Favorites</p>
                  <p className="text-3xl font-bold text-slate-900">{totalFavorites}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs Section */}
        <Tabs defaultValue="deals" className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-3 w-fit bg-white shadow-lg border-0 p-1">
              <TabsTrigger value="deals" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                <Gift className="h-4 w-4" />
                Your Deals ({totalDealsCreated})
              </TabsTrigger>
              <TabsTrigger value="claimed" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                <TrendingUp className="h-4 w-4" />
                Claimed ({totalDealsClaimed})
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
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
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50">
                      <CardContent className="text-center py-16">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Gift className="h-10 w-10 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-slate-900">No deals created yet</h3>
                        <p className="text-slate-600 mb-8 max-w-md mx-auto">
                          Start sharing your unused subscriptions, memberships, and rewards to help others save money while reducing waste.
                        </p>
                        <Button onClick={() => navigate('/share-deal')} size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
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
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50">
                      <CardContent className="text-center py-16">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <TrendingUp className="h-10 w-10 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-slate-900">No deals claimed yet</h3>
                        <p className="text-slate-600 mb-8 max-w-md mx-auto">
                          Browse amazing deals from the community and start saving money on subscriptions and memberships.
                        </p>
                        <Button onClick={() => navigate('/deals')} size="lg" className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
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
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50">
                      <CardContent className="text-center py-16">
                        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Heart className="h-10 w-10 text-purple-600" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-slate-900">No favorite deals yet</h3>
                        <p className="text-slate-600 mb-8 max-w-md mx-auto">
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
