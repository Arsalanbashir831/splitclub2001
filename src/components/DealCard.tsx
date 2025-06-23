
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Clock, MapPin, Users, Eye, Package } from 'lucide-react';
import { Deal } from '@/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DealCardProps {
  deal: Deal;
  onClaim: (dealId: string) => void;
  onView: (dealId: string) => void;
  isClaimLoading?: boolean;
}

export const DealCard = ({ deal, onClaim, onView, isClaimLoading = false }: DealCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Safely handle deal data with fallbacks
  if (!deal || !deal.id) {
    console.error('DealCard: Invalid deal data', deal);
    return null;
  }

  const safeTitle = deal.title || 'Untitled Deal';
  const safeCategory = deal.category || 'other';
  const safeSharePrice = Number(deal.sharePrice) || 0;
  const safeOriginalPrice = Number(deal.originalPrice) || 0;
  const safeIsFree = Boolean(deal.isFree);
  const safeExpiryDate = deal.expiryDate ? new Date(deal.expiryDate).toLocaleDateString() : 'No expiry';
  const safeAvailableSlots = Number(deal.availableSlots) || 0;
  const safeTotalSlots = Number(deal.totalSlots) || 5;
  const safeStatus = deal.status || 'active';
  const safeImageUrl = deal.imageUrl || deal.image;
  const safeIsLocationBound = Boolean(deal.isLocationBound);
  const safeLocationDetails = deal.locationDetails || '';
  
  // Safely handle sharedBy data
  const safeSharedBy = deal.sharedBy || { id: '', name: 'Unknown User', email: '', avatar: undefined };
  const safeSharedByName = safeSharedBy.name || 'Unknown User';
  const safeSharedByAvatar = safeSharedBy.avatar;

  const handleCardClick = () => {
    try {
      onView(deal.id);
    } catch (error) {
      console.error('Error viewing deal:', error);
    }
  };

  const handleClaimClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      onClaim(deal.id);
    } catch (error) {
      console.error('Error claiming deal:', error);
    }
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      onView(deal.id);
    } catch (error) {
      console.error('Error viewing deal:', error);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={handleCardClick}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg line-clamp-2 flex-1 pr-2 min-h-[3.5rem]">
              {safeTitle}
            </CardTitle>
            <div className="flex flex-col items-end gap-1">
              {safeIsFree ? (
                <Badge variant="secondary" className="text-green-600 bg-green-50 border-green-200">
                  FREE
                </Badge>
              ) : (
                <Badge variant="default" className="bg-blue-600">
                  £{safeSharePrice.toFixed(2)}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex flex-col flex-1 space-y-4">
          {/* Image section with consistent height */}
          <div className="relative h-32 bg-gray-50 rounded-lg overflow-hidden">
            {safeImageUrl && !imageError ? (
              <>
                {!isImageLoaded && (
                  <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <img
                  src={safeImageUrl}
                  alt={safeTitle}
                  className={cn(
                    "w-full h-full object-cover transition-opacity duration-200",
                    isImageLoaded ? "opacity-100" : "opacity-0"
                  )}
                  onLoad={() => setIsImageLoaded(true)}
                  onError={() => {
                    setImageError(true);
                    setIsImageLoaded(true);
                  }}
                />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Price and category section */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs capitalize">{safeCategory}</Badge>
            <div className="text-right">
              {safeIsFree ? (
                <span className="font-bold text-green-600 text-lg">FREE</span>
              ) : (
                <div className="flex flex-col items-end">
                  <span className="font-bold text-blue-600 text-lg">£{safeSharePrice.toFixed(2)}</span>
                  {safeOriginalPrice > 0 && safeOriginalPrice > safeSharePrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      £{safeOriginalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* User info */}
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={safeSharedByAvatar} />
              <AvatarFallback className="text-xs">
                {safeSharedByName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground truncate">{safeSharedByName}</span>
          </div>

          {/* Deal details - flex-1 to push buttons to bottom */}
          <div className="flex-1 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{safeAvailableSlots} of {safeTotalSlots} slots available</span>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>Expires {safeExpiryDate}</span>
            </div>
            
            {safeIsLocationBound && safeLocationDetails && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{safeLocationDetails}</span>
              </div>
            )}
          </div>

          {/* Action buttons - always at bottom */}
          <div className="flex space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleViewClick}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={handleClaimClick}
              disabled={safeAvailableSlots === 0 || isClaimLoading || safeStatus !== 'active'}
            >
              {isClaimLoading ? 'Claiming...' : (safeIsFree ? 'Claim Free' : `Claim £${safeSharePrice.toFixed(2)}`)}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
