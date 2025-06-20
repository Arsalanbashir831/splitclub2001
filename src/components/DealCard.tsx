
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Clock, MapPin, Users, Eye, Package, Sparkles } from 'lucide-react';
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
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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
      className="h-full group"
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="h-full flex flex-col overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer backdrop-blur-sm relative">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />

        <div className="relative z-10" onClick={() => onView(deal.id)}>
          <CardHeader className="pb-3 relative">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg line-clamp-2 flex-1 pr-2 min-h-[3.5rem] bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent font-bold">
                {deal.title}
              </CardTitle>
              <motion.button
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleFavoriteToggle}
                className={cn(
                  "p-2 rounded-full transition-all duration-300 flex-shrink-0 backdrop-blur-md border",
                  isFav 
                    ? "text-red-500 bg-red-50/80 border-red-200 shadow-lg shadow-red-500/25" 
                    : "text-gray-400 hover:text-red-500 bg-white/80 border-gray-200 hover:bg-red-50/80 hover:border-red-200 hover:shadow-lg hover:shadow-red-500/25"
                )}
              >
                <Heart className={cn("h-4 w-4", isFav && "fill-current")} />
              </motion.button>
            </div>
          </CardHeader>
          
          <CardContent className="flex flex-col flex-1 space-y-4 p-6 pt-0">
            {/* Enhanced image section with overlay effects */}
            <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden group/image">
              {deal.imageUrl && !imageError ? (
                <>
                  {!isImageLoaded && (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 animate-pulse flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="h-8 w-8 text-gray-500" />
                      </motion.div>
                    </div>
                  )}
                  <img
                    src={deal.imageUrl}
                    alt={deal.title}
                    className={cn(
                      "w-full h-full object-cover transition-all duration-500 group-hover/image:scale-110",
                      isImageLoaded ? "opacity-100" : "opacity-0"
                    )}
                    onLoad={() => setIsImageLoaded(true)}
                    onError={() => {
                      setImageError(true);
                      setIsImageLoaded(true);
                    }}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
                  
                  {/* Floating overlay content */}
                  <motion.div 
                    className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"
                    initial={{ y: 20 }}
                    animate={{ y: isHovered ? 0 : 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="backdrop-blur-md bg-white/20 text-white border-white/30 text-xs">
                        {deal.category}
                      </Badge>
                      <div className="flex items-center space-x-1 text-xs bg-black/30 backdrop-blur-md rounded-full px-2 py-1">
                        <Eye className="h-3 w-3" />
                        <span>View</span>
                      </div>
                    </div>
                  </motion.div>
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 flex items-center justify-center relative overflow-hidden">
                  {/* Animated background pattern */}
                  <motion.div
                    className="absolute inset-0 opacity-20"
                    animate={{
                      background: [
                        "radial-gradient(circle at 20% 20%, #3b82f6 0%, transparent 70%)",
                        "radial-gradient(circle at 80% 80%, #8b5cf6 0%, transparent 70%)",
                        "radial-gradient(circle at 20% 80%, #ec4899 0%, transparent 70%)",
                        "radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 70%)"
                      ]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <Package className="h-12 w-12 text-gray-400" />
                  </motion.div>
                </div>
              )}
            </div>

            {/* Price and category section with enhanced styling */}
            <div className="flex items-center justify-between">
              {!deal.imageUrl && (
                <Badge 
                  variant="outline" 
                  className="text-xs bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200 text-blue-700 dark:text-blue-300"
                >
                  {deal.category}
                </Badge>
              )}
              <div className="text-right ml-auto">
                {deal.isFree ? (
                  <motion.span 
                    className="font-bold text-2xl bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent"
                    whileHover={{ scale: 1.05 }}
                  >
                    FREE
                  </motion.span>
                ) : (
                  <div className="flex flex-col items-end">
                    <motion.span 
                      className="font-bold text-xl bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent"
                      whileHover={{ scale: 1.05 }}
                    >
                      ${deal.sharePrice}
                    </motion.span>
                    {deal.originalPrice > deal.sharePrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${deal.originalPrice}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced user info */}
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/50 backdrop-blur-sm">
              <Avatar className="h-8 w-8 ring-2 ring-white shadow-lg">
                <AvatarImage src={deal.sharedBy.avatar} />
                <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  {deal.sharedBy.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground truncate font-medium">{deal.sharedBy.name}</span>
            </div>

            {/* Enhanced deal details */}
            <div className="flex-1 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center p-2 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                <Users className="h-4 w-4 mr-2 flex-shrink-0 text-blue-500" />
                <span className="font-medium">{deal.availableSlots} of {deal.totalSlots} slots available</span>
              </div>
              
              <div className="flex items-center p-2 rounded-lg bg-orange-50/50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800">
                <Clock className="h-4 w-4 mr-2 flex-shrink-0 text-orange-500" />
                <span className="font-medium">Expires {new Date(deal.expiryDate).toLocaleDateString()}</span>
              </div>
              
              {deal.isLocationBound && deal.locationDetails && (
                <div className="flex items-center p-2 rounded-lg bg-green-50/50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-green-500" />
                  <span className="truncate font-medium">{deal.locationDetails}</span>
                </div>
              )}
            </div>

            {/* Enhanced action buttons */}
            <div className="flex space-x-3 pt-4">
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-white/80 backdrop-blur-sm hover:bg-white border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(deal.id);
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              </motion.div>
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 border-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClaim(deal.id);
                  }}
                  disabled={deal.availableSlots === 0 || isClaimLoading}
                >
                  {isClaimLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 mr-2"
                    >
                      <Sparkles className="h-4 w-4" />
                    </motion.div>
                  ) : null}
                  {isClaimLoading ? 'Claiming...' : 'Claim'}
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
};
