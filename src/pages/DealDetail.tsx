import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Navbar } from '../components/Navbar';
import { useDeal } from '../hooks/useDeals';
import { dealsService } from '../services/dealsService';
import { 
  Clock, 
  Users, 
  DollarSign, 
  Gift, 
  ArrowLeft, 
  Share2, 
  Heart,
  MapPin,
  Calendar,
  Tag,
  CheckCircle,
  Shield,
  Zap,
  Mail,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '../store/authStore';

export const DealDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuthStore();
  const { deal, isLoading, error } = useDeal(id || '');
  const [isLiked, setIsLiked] = useState(false);
  const [isClaimLoading, setIsClaimLoading] = useState(false);

  const handleClaim = async () => {
    if (!isAuthenticated) {
      // Store the current page for redirect after login
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      navigate('/login');
      return;
    }

    if (!user || !deal) {
      toast({
        title: "Error",
        description: "User information not available. Please try logging in again.",
        variant: "destructive",
      });
      return;
    }

    setIsClaimLoading(true);
    try {
      await dealsService.claimDeal(deal.id, user.id);
      toast({
        title: "Deal claimed!",
        description: `You've successfully claimed "${deal.title}". The owner will be notified.`,
      });
    } catch (error) {
      console.error('Error claiming deal:', error);
      toast({
        title: "Error claiming deal",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsClaimLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Deal link copied to clipboard",
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: isLiked ? "Deal removed from your favorites" : "Deal saved to your favorites",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading deal...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Deal not found</h1>
          <Button onClick={() => navigate('/deals')}>Back to Deals</Button>
        </div>
      </div>
    );
  }

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
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/deals')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Deals</span>
            </Button>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleLike}>
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current text-red-500' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Deal Summary Header */}
        <div className="mb-8">
          <div className="flex items-start space-x-4 mb-6">
            {/* Service Icon/Logo */}
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              {deal.imageUrl ? (
                <img 
                  src={deal.imageUrl} 
                  alt={deal.title} 
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <span className="text-2xl font-bold text-primary-foreground">
                  {deal.title.charAt(0)}
                </span>
              )}
            </div>
            
            <div className="flex-1">
              {/* Deal Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {deal.title}
              </h1>
              
              {/* Short Subtitle */}
              <p className="text-muted-foreground text-lg mb-4">
                {deal.description}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Offer Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gift className="h-5 w-5" />
                  <span>Offer Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">Type</p>
                    <p className="font-semibold capitalize">{deal.category}</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">Source</p>
                    <p className="font-semibold">{deal.source || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">Expires</p>
                    <p className="font-semibold">{formatDate(deal.expiryDate)}</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">Availability</p>
                    <p className="font-semibold">
                      {deal.availableSlots} of {deal.totalSlots} slots remaining
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Claimed</span>
                    <span>{deal.totalSlots - deal.availableSlots}/{deal.totalSlots}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${((deal.totalSlots - deal.availableSlots) / deal.totalSlots) * 100}%`
                      }}
                    />
                  </div>
                </div>

                {deal.usageNotes && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Usage Notes</h4>
                    <p className="text-sm text-muted-foreground">{deal.usageNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Optional Tags */}
            <div className="flex flex-wrap gap-3">
              {deal.tags.includes('verified') && (
                <Badge variant="secondary" className="flex items-center space-x-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  <CheckCircle className="h-3 w-3" />
                  <span>Verified sharer</span>
                </Badge>
              )}
              {deal.tags.includes('instant') && (
                <Badge variant="secondary" className="flex items-center space-x-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  <Zap className="h-3 w-3" />
                  <span>Fast responder</span>
                </Badge>
              )}
              <Badge variant="secondary" className="flex items-center space-x-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                <Shield className="h-3 w-3" />
                <span>Buyer protected</span>
              </Badge>
            </div>

            {/* Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Shield className="h-4 w-4 mt-1 text-green-600" />
                    <p className="text-sm">Backed by SplitClub's 100% Claim Guarantee</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Calendar className="h-4 w-4 mt-1 text-blue-600" />
                    <p className="text-sm">Valid until {formatDate(deal.expiryDate)}</p>
                  </div>
                  {deal.redemptionType && (
                    <div className="flex items-start space-x-2">
                      <Mail className="h-4 w-4 mt-1 text-purple-600" />
                      <p className="text-sm">Redemption type: {deal.redemptionType}</p>
                    </div>
                  )}
                  {deal.isLocationBound && deal.locationDetails && (
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 mt-1 text-orange-600" />
                      <p className="text-sm">Location: {deal.locationDetails}</p>
                    </div>
                  )}
                </div>
                
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Want to list your own unused slot?</p>
                  <Button variant="outline" size="sm" onClick={() => navigate('/share-deal')}>
                    Share Your Deal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price and action */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  {deal.isFree ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Gift className="h-6 w-6 text-green-600" />
                      <span className="text-2xl font-bold text-green-600">FREE</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-sm text-muted-foreground">£</span>
                        <span className="text-3xl font-bold">£{deal.sharePrice}</span>
                        <span className="text-sm text-muted-foreground">/month</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 mt-2">
                        <span className="text-sm text-muted-foreground line-through">
                          £{deal.originalPrice}
                        </span>
                        <Badge variant="secondary" className="text-green-600">
                          Save £{(deal.originalPrice - deal.sharePrice).toFixed(2)}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {deal.status === 'active' && deal.availableSlots > 0 ? (
                    <Button 
                      className="w-full" 
                      size="lg" 
                      onClick={handleClaim}
                      disabled={isClaimLoading}
                    >
                      {isClaimLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Claiming...
                        </>
                      ) : (
                        <>💸 {deal.isFree ? 'Join for Free' : `Join Now for £${deal.sharePrice}/month`}</>
                      )}
                    </Button>
                  ) : deal.status === 'claimed' ? (
                    <Button variant="secondary" className="w-full" size="lg" disabled>
                      Fully Claimed
                    </Button>
                  ) : (
                    <Button variant="secondary" className="w-full" size="lg" disabled>
                      Expired
                    </Button>
                  )}

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="font-medium text-primary">Secure Payment Notice</p>
                    <p>SplitClub holds your payment until access is confirmed.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Owner Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Owner Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={deal.sharedBy.avatar} alt={deal.sharedBy.name} />
                    <AvatarFallback>
                      {deal.sharedBy.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{deal.sharedBy.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {deal.tags.includes('verified') && (
                        <Badge variant="secondary" className="text-xs">Verified</Badge>
                      )}
                      {deal.tags.includes('instant') && (
                        <Badge variant="secondary" className="text-xs">Fast responder</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety & Terms */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Terms & Safety</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <p className="flex items-center space-x-2">
                    <Shield className="h-3 w-3 text-green-600" />
                    <span>Buyer protection included</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-blue-600" />
                    <span>Cancel anytime</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <Mail className="h-3 w-3 text-purple-600" />
                    <span>Instant access via email</span>
                  </p>
                </div>
                
                <div className="pt-3 border-t border-border">
                  <Button variant="link" size="sm" className="text-xs p-0 h-auto">
                    View Terms and Conditions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
