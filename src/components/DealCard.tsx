
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Clock, MapPin, Users, Eye } from 'lucide-react';
import { Deal } from '@/types';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';
import { motion } from 'framer-motion';

interface DealCardProps {
  deal: Deal;
  onClaim: (dealId: string) => void;
  onView: (dealId: string) => void;
  isClaimLoading?: boolean;
}

export const DealCard = ({ deal, onClaim, onView, isClaimLoading = false }: DealCardProps) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const isFav = isFavorite(deal.id);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFav) {
      removeFavorite(deal.id);
    } else {
      addFavorite(deal.id);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={() => onView(deal.id)}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg line-clamp-2 flex-1 pr-2">{deal.title}</CardTitle>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleFavoriteToggle}
              className={cn(
                "p-1 rounded-full transition-colors",
                isFav ? "text-red-500" : "text-gray-400 hover:text-red-500"
              )}
            >
              <Heart className={cn("h-5 w-5", isFav && "fill-current")} />
            </motion.button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {deal.imageUrl && (
            <div className="relative">
              {!isImageLoaded && (
                <div className="w-full h-32 bg-gray-200 rounded-lg animate-pulse" />
              )}
              <img
                src={deal.imageUrl}
                alt={deal.title}
                className={cn(
                  "w-full h-32 object-cover rounded-lg transition-opacity duration-200",
                  isImageLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setIsImageLoaded(true)}
                onError={() => setIsImageLoaded(true)}
              />
            </div>
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

          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={deal.sharedBy.avatar} />
              <AvatarFallback className="text-xs">
                {deal.sharedBy.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{deal.sharedBy.name}</span>
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
              onClick={(e) => {
                e.stopPropagation();
                onView(deal.id);
              }}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onClaim(deal.id);
              }}
              disabled={deal.availableSlots === 0 || isClaimLoading}
            >
              {isClaimLoading ? 'Claiming...' : 'Claim'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
