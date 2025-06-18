import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Deal } from '../types';
import { Clock, Users, DollarSign, Gift, Eye, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface DealCardProps {
  deal: Deal;
  onClaim?: (dealId: string) => void;
  onView?: (dealId: string) => void;
}

export const DealCard = ({ deal, onClaim, onView }: DealCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();

  const handleClaim = () => {
    onClaim?.(deal.id);
    toast({
      title: "Deal claimed!",
      description: `You've successfully claimed "${deal.title}". The owner will be notified.`,
    });
  };

  const handleView = () => {
    onView?.(deal.id);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: isLiked ? "Deal removed from your favorites" : "Deal saved to your favorites",
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'subscription': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'membership': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'reward': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const isExpiringSoon = () => {
    const expiryDate = new Date(deal.expiryDate);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  return (
    <Link to={`/deal/${deal.id}`} onClick={handleView}>
      <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer relative overflow-hidden">
        {/* Deal image */}
        {deal.image && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={deal.image}
              alt={deal.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute top-2 right-2 flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                onClick={handleLike}
              >
                <Heart 
                  className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                />
              </Button>
            </div>
            <div className="absolute top-2 left-2 flex gap-2">
              <Badge className={getCategoryColor(deal.category)}>
                {deal.category}
              </Badge>
              {deal.tags.includes('DEMO') && (
                <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-orange-300">
                  DEMO
                </Badge>
              )}
            </div>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {deal.title}
              </h3>
              <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                {deal.description}
              </p>
            </div>
          </div>

          {/* Shared by */}
          <div className="flex items-center space-x-2 mt-3">
            <Avatar className="h-6 w-6">
              <AvatarImage src={deal.sharedBy.avatar} alt={deal.sharedBy.name} />
              <AvatarFallback className="text-xs">
                {deal.sharedBy.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              Shared by {deal.sharedBy.name}
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Price and savings */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {deal.isFree ? (
                <div className="flex items-center space-x-1">
                  <Gift className="h-4 w-4 text-green-600" />
                  <span className="font-bold text-green-600">FREE</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-bold text-lg">${deal.sharePrice}</span>
                  <span className="text-sm text-muted-foreground line-through">
                    ${deal.originalPrice}
                  </span>
                </div>
              )}
            </div>
            {!deal.isFree && (
              <Badge variant="secondary" className="text-green-600">
                Save ${(deal.originalPrice - deal.sharePrice).toFixed(2)}
              </Badge>
            )}
          </div>

          {/* Availability and expiry */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {deal.availableSlots} of {deal.totalSlots} available
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className={`h-4 w-4 ${isExpiringSoon() ? 'text-orange-500' : 'text-muted-foreground'}`} />
                <span className={`text-sm ${isExpiringSoon() ? 'text-orange-500 font-medium' : 'text-muted-foreground'}`}>
                  Until {formatDate(deal.expiryDate)}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((deal.totalSlots - deal.availableSlots) / deal.totalSlots) * 100}%`
                }}
              />
            </div>
          </div>

          {/* Tags */}
          {deal.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {deal.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {deal.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{deal.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-0">
          <div className="w-full space-y-2">
            {deal.status === 'active' && deal.availableSlots > 0 ? (
              <Button 
                className="w-full" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleClaim();
                }}
              >
                {deal.isFree ? 'Claim for Free' : `Claim for $${deal.sharePrice}`}
              </Button>
            ) : deal.status === 'claimed' ? (
              <Button variant="secondary" className="w-full" disabled>
                Fully Claimed
              </Button>
            ) : (
              <Button variant="secondary" className="w-full" disabled>
                Expired
              </Button>
            )}
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleView();
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        </CardFooter>

        {/* Warning for expiring soon */}
        {isExpiringSoon() && deal.status === 'active' && (
          <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs px-2 py-1 rounded-bl-lg">
            Expires Soon!
          </div>
        )}
      </Card>
    </Link>
  );
};