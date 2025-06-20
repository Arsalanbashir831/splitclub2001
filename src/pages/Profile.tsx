
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { DealStatusCard } from '../components/DealStatusCard';
import { ClaimedDealCard } from '../components/Profile/ClaimedDealCard';
import { EditDealModal } from '../components/DealEdit/EditDealModal';
import { useUserDeals } from '../hooks/useUserDeals';
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
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuthStore();
  const { userDeals, claimedDeals, isLoading, error } = useUserDeals();
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
    // Implement delete logic here
    console.log(`Deleting deal with ID: ${dealId}`);
  };

  const handleViewDeal = (dealId: string) => {
    navigate(`/deal/${dealId}`);
  };

  const handleSaveDeal = async (updatedDeal: Deal) => {
    // Implement save logic here
    console.log('Saving deal:', updatedDeal);
    handleCloseEditModal();
  };

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold">Loading profile...</h1>
        </div>
        <Footer />
      </div>
    );
  }

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

      {/* Header */}
      <motion.div 
        className="bg-card border-b border-border"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Your Profile</h1>
            <Button variant="outline" size="sm" onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Summary Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>View and manage your profile details.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-semibold">{user?.name}</p>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <Badge variant="secondary">
                    <User className="h-3 w-3 mr-1" />
                    User
                  </Badge>
                </div>
              </div>
              <Button variant="outline" onClick={() => navigate('/settings')}>
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs defaultValue="deals" className="space-y-4">
          <TabsList>
            <TabsTrigger value="deals">
              <Gift className="h-4 w-4 mr-2" />
              Your Deals
            </TabsTrigger>
            <TabsTrigger value="claimed">
              <Heart className="h-4 w-4 mr-2" />
              Claimed Deals
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="deals" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userDeals.map((deal) => (
                <div key={deal.id} className="space-y-2">
                  <DealStatusCard deal={deal} />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleViewDeal(deal.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleEditDeal(deal)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteDeal(deal.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {userDeals.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <h3 className="text-lg font-semibold mb-2">No deals created yet</h3>
                  <p className="text-muted-foreground mb-4">Share your first deal and start saving!</p>
                  <Button onClick={() => navigate('/share-deal')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Share a Deal
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="claimed" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {claimedDeals.map((claim) => (
                <ClaimedDealCard 
                  key={claim.id} 
                  claim={claim} 
                  onViewDetails={(dealId) => navigate(`/deal/${dealId}`)}
                />
              ))}
            </div>
            {claimedDeals.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <h3 className="text-lg font-semibold mb-2">No deals claimed yet</h3>
                  <p className="text-muted-foreground mb-4">Find exciting deals and claim them!</p>
                  <Button onClick={() => navigate('/deals')}>
                    <Gift className="h-4 w-4 mr-2" />
                    Browse Deals
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Impact</CardTitle>
                <CardDescription>Overview of your sharing and claiming activity.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Deals Shared</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{userDeals.length}</div>
                      <p className="text-muted-foreground">Total deals you've shared</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Deals Claimed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{claimedDeals.length}</div>
                      <p className="text-muted-foreground">Total deals you've claimed</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Average Savings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$XX.XX</div>
                      <p className="text-muted-foreground">Average saved per deal</p>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Chart</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Your recent activity and engagement.</p>
                    <Calendar className="h-4 w-4 mr-2" />
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
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
