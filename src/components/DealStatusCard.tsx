
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Calendar, Users, MapPin, Tag, Clock, ExternalLink } from 'lucide-react';
import { Deal } from '@/types';
import { format } from 'date-fns';

interface DealStatusCardProps {
  deal: Deal;
  onClaim?: (dealId: string) => void;
  onView?: (dealId: string) => void;
  showActions?: boolean;
  compact?: boolean;
}

export const DealStatusCard = ({ 
  deal, 
  onClaim, 
  onView, 
  showActions = true,
  compact = false 
}: DealStatusCardProps) => {
  const slotsUsed = deal.totalSlots - deal.availableSlots;
  const progressPercentage = (slotsUsed / deal.totalSlots) * 100;
  
  const handleView = () => {
    onView?.(deal.id);
  };

  const handleClaim = () => {
    onClaim?.(deal.id);
  };

  return (
    <Card className={`w-full transition-all duration-200 hover:shadow-lg ${compact ? 'p-3' : ''}`}>
      {deal.image && (
        <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
          <img 
            src={deal.image} 
            alt={deal.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge variant={deal.status === 'active' ? 'default' : 'secondary'}>
              {deal.status}
            </Badge>
          </div>
        </div>
      )}
      
      <CardHeader className={compact ? 'p-3 pb-2' : ''}>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className={`${compact ? 'text-lg' : 'text-xl'} line-clamp-2`}>
              {deal.title}
            </CardTitle>
            <p className={`text-muted-foreground ${compact ? 'text-sm' : ''} line-clamp-2`}>
              {deal.description}
            </p>
          </div>
          {!deal.image && (
            <Badge variant={deal.status === 'active' ? 'default' : 'secondary'}>
              {deal.status}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className={`space-y-4 ${compact ? 'p-3 pt-0' : ''}`}>
        {/* Price and savings */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            {deal.isFree ? (
              <p className="text-lg font-bold text-green-600">FREE</p>
            ) : (
              <div className="flex items-center space-x-2">
                <p className="text-lg font-bold">${deal.sharePrice}</p>
                {deal.originalPrice > deal.sharePrice && (
                  <p className="text-sm text-muted-foreground line-through">
                    ${deal.originalPrice}
                  </p>
                )}
              </div>
            )}
            {deal.originalPrice > deal.sharePrice && (
              <p className="text-xs text-green-600">
                Save ${(deal.originalPrice - deal.sharePrice).toFixed(2)}
              </p>
            )}
          </div>
          <Badge variant="outline" className="text-xs">
            {deal.category}
          </Badge>
        </div>

        {/* Progress and slots */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{slotsUsed}/{deal.totalSlots} claimed</span>
            </span>
            <span className="text-muted-foreground">{deal.availableSlots} left</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Meta information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>Expires {format(new Date(deal.expiryDate), 'MMM dd')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{format(new Date(deal.createdAt), 'MMM dd')}</span>
          </div>
        </div>

        {/* Tags */}
        {deal.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {deal.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                <Tag className="h-2 w-2 mr-1" />
                {tag}
              </Badge>
            ))}
            {deal.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{deal.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Shared by */}
        <div className="flex items-center space-x-2 pt-2 border-t">
          <Avatar className="h-6 w-6">
            <AvatarImage src={deal.sharedBy.avatar} />
            <AvatarFallback className="text-xs">
              {deal.sharedBy.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">
            Shared by {deal.sharedBy.name}
          </span>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleView}
              className="flex-1"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Details
            </Button>
            {deal.status === 'active' && deal.availableSlots > 0 && (
              <Button
                size="sm"
                onClick={handleClaim}
                className="flex-1"
                disabled={deal.status !== 'active'}
              >
                {deal.isFree ? 'Claim Free' : `Claim $${deal.sharePrice}`}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
