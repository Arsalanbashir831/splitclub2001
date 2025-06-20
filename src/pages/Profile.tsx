
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
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileSkeleton = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </CardHeader>
    </Card>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-32 w-full rounded-lg" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-full" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 flex-1" />
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
  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
    <CardHeader className="pb-3">
      <CardTitle className="text-lg line-clamp-2">{deal.title}</CardTitle>
      <CardDescription className="flex items-center text-sm">
        <Calendar className="h-4 w-4 mr-1" />
        {new Date(deal.createdAt).toLocaleDateString()}
      </CardDescription>
    </CardHeader>
    
    <CardContent className="space-y-4">
      {deal.imageUrl && (
        <img
          src={deal.imageUrl}
          alt={deal.title}
          className="w-full h-32 object-cover rounded-lg"
        />
      )}

      <div className="flex items-center justify-between">
        <Badge variant="outline">{deal.category}</Badge>
        <div className="text-right">
          {deal.isFree ? (
            <span className="font-bold text-green-600">FREE</span>
          ) : (
            <div>
              <span className="font-bold text-green-600">${deal.sharePrice}</span>
              {deal.originalPrice > deal.sharePrice && (
                <span className="text-sm text-muted-foreground line-through ml-1">
                  ${deal.originalPrice}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-1" />
          <span>{deal.availableSlots} of {deal.totalSlots} slots available</span>
        </div>
        
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>Expires {new Date(deal.expiryDate).toLocaleDateString()}</span>
        </div>
        
        {deal.isLocationBound && deal.locationDetails && (
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="truncate">{deal.locationDetails}</span>
          </div>
        )}
      </div>

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
    </CardContent>
  </Card>
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
          <h1 className="text-2xl font-bold">Error loading profile</h1>
          <p>{error.message}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Navbar />

      <motion.div 
        className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-border"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <Button variant="outline" onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-white to-gray-50">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>View and manage your profile details.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="text-lg">
                      {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xl font-semibold">{user?.name}</p>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <Badge variant="secondary" className="mt-2">
                      <User className="h-3 w-3 mr-1" />
                      User
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" onClick={() => navigate('/settings')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs defaultValue="deals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="deals" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Your Deals ({userDeals?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="claimed" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Claimed Deals ({claimedDeals?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Favorite Deals ({favoriteDeals?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deals" className="space-y-6">
            {isLoading ? (
              <ProfileSkeleton />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <Card>
                      <CardContent className="text-center py-12">
                        <Gift className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No deals created yet</h3>
                        <p className="text-muted-foreground mb-6">Share your first deal and start saving!</p>
                        <Button onClick={() => navigate('/share-deal')}>
                          <Plus className="h-4 w-4 mr-2" />
                          Share a Deal
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {claimedDeals?.map((claim) => (
                  <Card key={claim.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                      <CardTitle>Claim #{claim.id.slice(0, 8)}</CardTitle>
                      <CardDescription>
                        <Clock className="h-4 w-4 mr-1 inline" />
                        Claimed on {new Date(claim.claimed_at).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">Deal ID: {claim.deal_id}</p>
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => navigate(`/deal/${claim.deal_id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Deal Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                {(!claimedDeals || claimedDeals.length === 0) && (
                  <div className="col-span-full">
                    <Card>
                      <CardContent className="text-center py-12">
                        <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No deals claimed yet</h3>
                        <p className="text-muted-foreground mb-6">Find exciting deals and claim them!</p>
                        <Button onClick={() => navigate('/deals')}>
                          <Gift className="h-4 w-4 mr-2" />
                          Browse Deals
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <Card>
                      <CardContent className="text-center py-12">
                        <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No favorite deals yet</h3>
                        <p className="text-muted-foreground mb-6">Add deals to your favorites to see them here!</p>
                        <Button onClick={() => navigate('/deals')}>
                          <Star className="h-4 w-4 mr-2" />
                          Browse Deals
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
