
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Eye, Tag } from 'lucide-react';
import { Deal } from '@/types';
import { DealClaimButton } from '@/components/deals/DealClaimButton';
import { DealAvailabilityInfo } from '@/components/deals/DealAvailabilityInfo';

interface DealCardProps {
  deal: Deal;
  onClaim: (dealId: string) => void;
  onView: (dealId: string) => void;
  isClaimLoading?: boolean;
  hasClaimedDeal?: boolean;
  isOwnDeal?: boolean;
}

export const DealCard = ({ 
  deal, 
  onClaim, 
  onView, 
  isClaimLoading = false,
  hasClaimedDeal = false,
  isOwnDeal = false
}: DealCardProps) => {
  const handleClaim = () => {
    onClaim(deal.id);
  };

  const handleView = () => {
    onView(deal.id);
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
      <div onClick={handleView}>
        {deal.image && (
          <div className="relative h-48 overflow-hidden rounded-t-lg">
            <img 
              src={deal.image} 
              alt={deal.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="capitalize">
                {deal.category}
              </Badge>
            </div>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-2">{deal.title}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {deal.description}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Price information */}
        <div className="flex items-center justify-between">
          {deal.originalPrice > 0 && (
            <div className="text-sm">
              <span className="text-muted-foreground line-through">
                ${deal.originalPrice.toFixed(2)}
              </span>
              <span className="ml-2 text-green-600 font-semibold">
                Save ${(deal.originalPrice - deal.sharePrice).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Availability info */}
        <DealAvailabilityInfo
          availableSlots={deal.availableSlots}
          totalSlots={deal.totalSlots}
          isFree={deal.isFree}
          sharePrice={deal.sharePrice}
        />

        {/* Deal details */}
        <div className="space-y-2 text-sm text-muted-foreground">
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
        </div>

        {/* Tags */}
        {deal.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {deal.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {deal.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{deal.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          <DealClaimButton
            isOwnDeal={isOwnDeal}
            hasClaimedDeal={hasClaimedDeal}
            isClaimLoading={isClaimLoading}
            isAvailable={deal.availableSlots > 0}
            onClaim={handleClaim}
          />
          
          <button
            onClick={handleView}
            className="flex items-center justify-center px-3 py-2 text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
