import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Navbar } from '../components/Navbar';
import { Deal } from '../types';
import { mockDeals } from '../data/mockData';
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
  Mail
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '../store/authStore';

export const DealDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuthStore();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (id) {
      const foundDeal = mockDeals.find(d => d.id === id);
      setDeal(foundDeal || null);
    }
  }, [id]);

  if (!deal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Deal not found</h1>
          <Button onClick={() => navigate('/')}>Back to Deals</Button>
        </div>
      </div>
    );
  }

  const handleClaim = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    toast({
      title: "Deal claimed!",
      description: `You've successfully claimed "${deal.title}". The owner will be notified.`,
    });
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
              <span className="text-2xl font-bold text-primary-foreground">
                {deal.title.charAt(0)}
              </span>
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
                    <p className="font-medium text-sm text-muted-foreground">What's included</p>
                    <p className="font-semibold">
                      {deal.category === 'subscription' ? 'Full subscription access' : 'Complete access'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">Remaining duration</p>
                    <p className="font-semibold">Renews monthly · No long-term contract</p>
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
                    <p className="text-sm">Cancel anytime before next billing</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Mail className="h-4 w-4 mt-1 text-purple-600" />
                    <p className="text-sm">Once accepted, you'll receive the invite by email or in-app</p>
                  </div>
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
                    <Button className="w-full" size="lg" onClick={handleClaim}>
                      💸 {deal.isFree ? 'Join for Free' : `Join Now for £${deal.sharePrice}/month`}
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
                <Button variant="outline" className="w-full mt-4" size="sm">
                  View Profile
                </Button>
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