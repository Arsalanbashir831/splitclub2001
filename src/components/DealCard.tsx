
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Eye, Tag } from 'lucide-react';
import { Deal } from '@/types';
import { DealClaimButton } from '@/components/deals/DealClaimButton';
import { DealAvailabilityInfo } from '@/components/deals/DealAvailabilityInfo';
import { HoverScale } from '@/components/animations/HoverScale';

interface DealCardProps {
  deal: Deal;
  onClaim: (dealId: string) => void;
  onView: (dealId: string) => void;
  isClaimLoading?: boolean;
  hasClaimedDeal?: boolean;
  isOwnDeal?: boolean;
  index?: number;
}

export const DealCard = ({ 
  deal, 
  onClaim, 
  onView, 
  isClaimLoading = false,
  hasClaimedDeal = false,
  isOwnDeal = false,
  index = 0
}: DealCardProps) => {
  const handleClaim = () => {
    onClaim(deal.id);
  };

  const handleView = () => {
    onView(deal.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        ease: 'easeOut' 
      }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <HoverScale scale={1.02}>
        <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer">
          <div onClick={handleView}>
            {deal.image && (
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <motion.img 
                  src={deal.image} 
                  alt={deal.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div 
                  className="absolute top-2 left-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge variant="secondary" className="capitalize">
                    {deal.category}
                  </Badge>
                </motion.div>
              </div>
            )}
          </div>
          
          <CardHeader className="pb-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors duration-200">
                {deal.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {deal.description}
              </p>
            </motion.div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Price information */}
            {deal.originalPrice > 0 && (
              <motion.div 
                className="flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-sm">
                  <span className="text-muted-foreground line-through">
                    ${deal.originalPrice.toFixed(2)}
                  </span>
                  <span className="ml-2 text-green-600 font-semibold">
                    Save ${(deal.originalPrice - deal.sharePrice).toFixed(2)}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Availability info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <DealAvailabilityInfo
                availableSlots={deal.availableSlots}
                totalSlots={deal.totalSlots}
                isFree={deal.isFree}
                sharePrice={deal.sharePrice}
              />
            </motion.div>

            {/* Deal details */}
            <motion.div 
              className="space-y-2 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Expires: {new Date(deal.expiryDate).toLocaleDateString()}</span>
              </div>
              
              {deal.isLocationBound && deal.locationDetails && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{deal.locationDetails}</span>
                </div>
              )}
            </motion.div>

            {/* Tags */}
            {deal.tags.length > 0 && (
              <motion.div 
                className="flex flex-wrap gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {deal.tags.slice(0, 3).map((tag, tagIndex) => (
                  <motion.div
                    key={tagIndex}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + tagIndex * 0.1 }}
                  >
                    <Badge variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  </motion.div>
                ))}
                {deal.tags.length > 3 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <Badge variant="outline" className="text-xs">
                      +{deal.tags.length - 3} more
                    </Badge>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Action buttons */}
            <motion.div 
              className="flex gap-2 pt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <DealClaimButton
                isOwnDeal={isOwnDeal}
                hasClaimedDeal={hasClaimedDeal}
                isClaimLoading={isClaimLoading}
                isAvailable={deal.availableSlots > 0}
                onClaim={handleClaim}
              />
              
              <motion.button
                onClick={handleView}
                className="flex items-center justify-center px-3 py-2 text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye className="h-4 w-4" />
              </motion.button>
            </motion.div>
          </CardContent>
        </Card>
      </HoverScale>
    </motion.div>
  );
};
