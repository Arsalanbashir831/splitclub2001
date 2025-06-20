import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, Users, MapPin, Tag, Clock, ExternalLink, Heart, HeartOff, Share2, AlertCircle, FileText } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { useUserClaims } from '@/hooks/useUserClaims';
import { useFavorites } from '@/hooks/useFavorites';
import { useToast } from '@/hooks/use-toast';
import { Deal } from '@/types';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { DealClaimButton } from '@/components/deals/DealClaimButton';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { dealsService } from '@/services/dealsService';
import { cn } from '@/lib/utils';

export const DealDetail = () => {
  useScrollToTop();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { hasClaimedDeal } = useUserClaims();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [deal, setDeal] = useState<Deal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  const isFav = deal ? isFavorite(deal.id) : false;

  useEffect(() => {
    const fetchDeal = async () => {
      if (!id) return;
      
      try {
        const dealData = await dealsService.getDealById(id);
        setDeal(dealData);
      } catch (error) {
        console.error('Error fetching deal:', error);
        toast({
          title: "Error loading deal",
          description: "Could not load deal details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeal();
  }, [id, toast]);

  const handleClaim = async () => {
    if (!deal || !user) return;
    
    setIsClaimLoading(true);
    try {
      await dealsService.claimDeal(deal.id, user.id);
      toast({
        title: "Deal claimed!",
        description: "You have successfully claimed this deal.",
      });
      
      // Update deal to show one less available slot
      setDeal(prev => prev ? {
        ...prev,
        availableSlots: prev.availableSlots - 1
      } : null);
    } catch (error) {
      console.error('Error claiming deal:', error);
      toast({
        title: "Error claiming deal",
        description: "Could not claim this deal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsClaimLoading(false);
    }
  };

  const handleFavoriteToggle = () => {
    if (!deal) return;
    
    if (isFav) {
      removeFavorite(deal.id);
      toast({
        title: "Removed from favorites",
        description: "Deal removed from your favorites.",
      });
    } else {
      addFavorite(deal.id);
      toast({
        title: "Added to favorites",
        description: "Deal added to your favorites.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-32" />
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full mb-4" />
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Deal not found</h1>
            <Button onClick={() => navigate('/deals')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Deals
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{deal.title}</CardTitle>
                  <div className="flex items-center space-x-2 mb-4">
                    <Badge variant="outline">{deal.category}</Badge>
                    <Badge variant={deal.status === 'active' ? 'default' : 'secondary'}>
                      {deal.status}
                    </Badge>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleFavoriteToggle}
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    isFav ? "text-red-500" : "text-gray-400 hover:text-red-500"
                  )}
                >
                  <Heart className={cn("h-6 w-6", isFav && "fill-current")} />
                </motion.button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {deal.imageUrl && (
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  {!isImageLoaded && (
                    <Skeleton className="w-full h-64 rounded-lg" />
                  )}
                  <img
                    src={deal.imageUrl}
                    alt={deal.title}
                    className={cn(
                      "w-full h-64 object-cover rounded-lg transition-opacity duration-300",
                      isImageLoaded ? "opacity-100" : "opacity-0"
                    )}
                    onLoad={() => setIsImageLoaded(true)}
                    onError={() => setIsImageLoaded(true)}
                  />
                </motion.div>
              )}

              {/* Price Section */}
              <motion.div 
                className="text-center py-6 bg-muted rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                {deal.isFree ? (
                  <div>
                    <span className="text-4xl font-bold text-green-600">FREE</span>
                    {deal.originalPrice > 0 && (
                      <p className="text-muted-foreground mt-2">
                        Original price: <span className="line-through">${deal.originalPrice}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <span className="text-4xl font-bold text-green-600">${deal.sharePrice}</span>
                    {deal.originalPrice > deal.sharePrice && (
                      <div className="mt-2">
                        <span className="text-lg text-muted-foreground line-through">
                          ${deal.originalPrice}
                        </span>
                        <span className="ml-2 text-green-600 font-semibold">
                          Save ${(deal.originalPrice - deal.sharePrice).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Deal Details */}
              <motion.div 
                className="grid md:grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-3 text-muted-foreground" />
                    <span>{deal.availableSlots} of {deal.totalSlots} slots available</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-3 text-muted-foreground" />
                    <span>Expires on {new Date(deal.expiryDate).toLocaleDateString()}</span>
                  </div>
                  
                  {deal.isLocationBound && deal.locationDetails && (
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-3 text-muted-foreground" />
                      <span>{deal.locationDetails}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
                    <span>Shared on {new Date(deal.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  {deal.source && (
                    <div className="flex items-center">
                      <Tag className="h-5 w-5 mr-3 text-muted-foreground" />
                      <span>Source: {deal.source}</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Usage Notes */}
              {deal.usageNotes && (
                <motion.div 
                  className="p-4 bg-muted rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-2">Usage Notes</h4>
                      <p className="text-muted-foreground">{deal.usageNotes}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Shared By */}
              <motion.div 
                className="flex items-center space-x-3 p-4 bg-muted rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <Avatar>
                  <AvatarImage src={deal.sharedBy.avatar} />
                  <AvatarFallback>
                    {deal.sharedBy.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Shared by {deal.sharedBy.name}</p>
                  <p className="text-sm text-muted-foreground">Community member</p>
                </div>
              </motion.div>

              {/* Action Buttons */}
              {isAuthenticated && deal.availableSlots > 0 && (
                <motion.div 
                  className="flex space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                >
                  <Button 
                    size="lg" 
                    className="flex-1"
                    onClick={handleClaim}
                    disabled={isClaimLoading}
                  >
                    {isClaimLoading ? 'Claiming...' : 'Claim This Deal'}
                  </Button>
                </motion.div>
              )}
              
              {!isAuthenticated && (
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                >
                  <p className="text-muted-foreground mb-4">
                    Please log in to claim this deal
                  </p>
                  <Button onClick={() => navigate('/login')}>
                    Log In
                  </Button>
                </motion.div>
              )}
              
              {deal.availableSlots === 0 && (
                <motion.div 
                  className="text-center p-4 bg-destructive/10 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                >
                  <p className="text-destructive font-semibold">
                    This deal is no longer available
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};
