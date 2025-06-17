import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Tag
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
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Deal image */}
            {deal.image && (
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className={getCategoryColor(deal.category)}>
                    {deal.category}
                  </Badge>
                </div>
                {isExpiringSoon() && deal.status === 'active' && (
                  <div className="absolute top-4 right-4 bg-orange-500 text-white text-sm px-3 py-1 rounded-full">
                    Expires Soon!
                  </div>
                )}
              </div>
            )}

            {/* Deal info */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-4">{deal.title}</h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {deal.description}
              </p>
            </div>

            {/* Tags */}
            {deal.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {deal.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Deal details */}
            <Card>
              <CardHeader>
                <CardTitle>Deal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Expires</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(deal.expiryDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Availability</p>
                      <p className="text-sm text-muted-foreground">
                        {deal.availableSlots} of {deal.totalSlots} slots
                      </p>
                    </div>
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
                        <DollarSign className="h-6 w-6 text-muted-foreground" />
                        <span className="text-3xl font-bold">${deal.sharePrice}</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 mt-2">
                        <span className="text-sm text-muted-foreground line-through">
                          ${deal.originalPrice}
                        </span>
                        <Badge variant="secondary" className="text-green-600">
                          Save ${(deal.originalPrice - deal.sharePrice).toFixed(2)}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {deal.status === 'active' && deal.availableSlots > 0 ? (
                    <Button className="w-full" size="lg" onClick={handleClaim}>
                      {deal.isFree ? 'Claim for Free' : `Claim for $${deal.sharePrice}`}
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

                  <p className="text-xs text-muted-foreground">
                    You'll be connected with the deal owner after claiming
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Shared by */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Shared by</CardTitle>
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
                    <p className="text-sm text-muted-foreground">Community member</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View Profile
                </Button>
              </CardContent>
            </Card>

            {/* Safety tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Safety Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  • Verify deal details before claiming
                </p>
                <p className="text-sm text-muted-foreground">
                  • Communicate through SplitClub messages
                </p>
                <p className="text-sm text-muted-foreground">
                  • Report suspicious activity
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};