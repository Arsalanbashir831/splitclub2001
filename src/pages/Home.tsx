import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowRight, Shield, Users, Zap, Star, Play, Upload, Loader2 } from 'lucide-react';
import { VideoUploadModal } from '@/components/VideoUploadModal';
import { VideoPlayer } from '@/components/VideoPlayer';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDeals } from '@/hooks/useDeals';
import { useUserClaims } from '@/hooks/useUserClaims';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { dealsService } from '@/services/dealsService';

export const Home = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [demoVideoUrl, setDemoVideoUrl] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [claimingDeals, setClaimingDeals] = useState<Set<string>>(new Set());

  // Get real deals from backend
  const { deals, isLoading: dealsLoading } = useDeals();
  const { hasClaimedDeal } = useUserClaims();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for existing demo video and user role
  useEffect(() => {
    const checkDemoVideo = async () => {
      try {
        // Check if user is admin (simplified check - you might want to check auth state)
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('user_id', user.id)
            .single();
          
          setIsAdmin(profile?.is_admin || false);
        }
        
        // List files in demo-videos bucket to find existing demo
        const { data: files } = await supabase.storage
          .from('demo-videos')
          .list('demos', { limit: 1 });
        
        if (files && files.length > 0) {
          const { data: { publicUrl } } = supabase.storage
            .from('demo-videos')
            .getPublicUrl(`demos/${files[0].name}`);
          
          setDemoVideoUrl(publicUrl);
        }
      } catch (error) {
        console.error('Error checking demo video:', error);
      }
    };

    checkDemoVideo();
  }, []);

  const handleClaimDeal = async (dealId: string) => {
    if (!isAuthenticated) {
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      navigate('/login');
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "User information not available. Please try logging in again.",
        variant: "destructive",
      });
      return;
    }

    const deal = deals.find(d => d.id === dealId);
    if (!deal) return;

    if (deal.sharedBy.id === user.id) {
      toast({
        title: "Cannot claim own deal",
        description: "You cannot claim your own deal.",
        variant: "destructive",
      });
      return;
    }

    if (hasClaimedDeal(dealId)) {
      toast({
        title: "Already claimed",
        description: "You have already claimed this deal.",
        variant: "destructive",
      });
      return;
    }

    setClaimingDeals(prev => new Set(prev).add(dealId));
    try {
      await dealsService.claimDeal(dealId, user.id);
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
      setClaimingDeals(prev => {
        const newSet = new Set(prev);
        newSet.delete(dealId);
        return newSet;
      });
    }
  };

  const handleVideoUploaded = (videoUrl: string) => {
    setDemoVideoUrl(videoUrl);
  };

  const handleWatchDemo = () => {
    if (demoVideoUrl) {
      setShowVideoPlayer(true);
    } else if (isAdmin) {
      setShowUploadModal(true);
    }
  };

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Deals",
      description: "All transactions are protected with end-to-end encryption"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Driven",
      description: "Join thousands of users sharing and saving together"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Access",
      description: "Get immediate access to shared subscriptions and deals"
    }
  ];

  const stats = [
    { value: "50K+", label: "Active Users" },
    { value: "$2M+", label: "Total Savings" },
    { value: "95%", label: "Success Rate" },
    { value: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  🎉 New Feature: Mobile App Available
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                  Share deals,
                  <span className="text-primary"> Save money</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Join the community marketplace for unused subscriptions, memberships, and rewards. Reduce waste while saving money together.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="gap-2" asChild>
                  <Link to="/login">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="gap-2"
                  onClick={handleWatchDemo}
                  disabled={!demoVideoUrl && !isAdmin}
                >
                  {demoVideoUrl ? (
                    <>
                      <Play className="w-4 h-4" />
                      Watch Demo
                    </>
                  ) : isAdmin ? (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Demo
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Demo Coming Soon
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background"
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground">4.9/5 from 1000+ reviews</p>
                </div>
              </div>
            </div>

            {/* Right Content - Mobile Mockups */}
            <div className="relative">
              <div className="relative mx-auto w-80 h-[600px]">
                {/* Main Phone */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] p-2 shadow-2xl">
                  <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden">
                    {/* Phone Header */}
                    <div className="h-24 bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                      <div className="text-primary-foreground font-bold text-lg">SplitClub</div>
                    </div>

                    {/* Phone Content */}
                    <div className="p-6 space-y-4">
                      <div className="space-y-3">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                      </div>
                      
                      {/* Deal Cards */}
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <Card key={i} className="p-4">
                            <CardContent className="p-0">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg"></div>
                                <div className="flex-1 space-y-2">
                                  <div className="h-3 bg-muted rounded w-full"></div>
                                  <div className="h-2 bg-muted rounded w-2/3"></div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Phone */}
                <div className="absolute -right-16 top-20 w-64 h-[480px] bg-gradient-to-br from-gray-700 to-gray-800 rounded-[2.5rem] p-2 shadow-xl opacity-60 rotate-12">
                  <div className="w-full h-full bg-background rounded-[2rem] overflow-hidden">
                    <div className="h-16 bg-gradient-to-r from-accent to-primary"></div>
                    <div className="p-4 space-y-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-12 bg-muted rounded"></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -left-8 top-32 w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-primary/30">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <div className="absolute -right-4 bottom-32 w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-accent/30">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-muted-foreground mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 animate-scale-in">
              Why Choose SplitClub?
            </h2>
            <p className="text-xl text-muted-foreground">
              Experience the future of deal sharing with our innovative platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-0 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Deals Table Section */}
      <section className="py-20 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 animate-scale-in">
              Latest Deals
            </h2>
            <p className="text-xl text-muted-foreground animate-fade-in">
              Discover the newest deals and savings opportunities from our community
            </p>
          </div>
          
          <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border rounded-lg overflow-hidden animate-scale-in">
            <div className="sticky top-16 z-40 bg-background border-b border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Title</TableHead>
                    <TableHead className="w-[120px]">Category</TableHead>
                    <TableHead className="w-[120px] text-right">Original Price</TableHead>
                    <TableHead className="w-[120px] text-right">Share Price</TableHead>
                    <TableHead className="w-[100px] text-center">Available</TableHead>
                    <TableHead className="w-[120px]">Expires</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="w-[120px] text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableBody>
                  {dealsLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex items-center justify-center space-x-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Loading deals...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : deals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <p className="text-muted-foreground">No deals available at the moment.</p>
                        <Button asChild className="mt-4">
                          <Link to="/share-deal">Share Your First Deal</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    deals.slice(0, 10).map((deal, index) => {
                      const isOwnDeal = user && deal.sharedBy.id === user.id;
                      const hasClaimedThisDeal = hasClaimedDeal(deal.id);
                      const isClaimingThisDeal = claimingDeals.has(deal.id);

                      return (
                        <TableRow key={deal.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                          <TableCell className="font-medium w-[200px]">
                            <Link to={`/deal/${deal.id}`} className="hover:text-primary transition-colors truncate block">
                              {deal.title}
                            </Link>
                          </TableCell>
                          <TableCell className="w-[120px]">
                            <Badge variant="secondary" className="capitalize">
                              {deal.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="w-[120px] text-right">${deal.originalPrice.toFixed(2)}</TableCell>
                          <TableCell className="w-[120px] text-right">
                            {deal.isFree ? (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                Free
                              </Badge>
                            ) : (
                              `$${deal.sharePrice.toFixed(2)}`
                            )}
                          </TableCell>
                          <TableCell className="w-[100px] text-center">{deal.availableSlots}/{deal.totalSlots}</TableCell>
                          <TableCell className="w-[120px]">{new Date(deal.expiryDate).toLocaleDateString()}</TableCell>
                          <TableCell className="w-[120px]">
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={deal.status === 'active' ? 'default' : deal.status === 'claimed' ? 'secondary' : 'destructive'}
                                className="capitalize"
                              >
                                {deal.status}
                              </Badge>
                              {hasClaimedThisDeal && !isOwnDeal && (
                                <Badge variant="default" className="bg-green-600 text-xs">
                                  Claimed
                                </Badge>
                              )}
                              {isOwnDeal && (
                                <Badge variant="secondary" className="text-xs">
                                  Yours
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="w-[120px] text-center">
                            {deal.status === 'active' && deal.availableSlots > 0 ? (
                              <Button
                                size="sm"
                                onClick={() => handleClaimDeal(deal.id)}
                                disabled={isClaimingThisDeal || hasClaimedThisDeal || isOwnDeal}
                                variant={isOwnDeal ? 'outline' : hasClaimedThisDeal ? 'secondary' : 'default'}
                              >
                                {isClaimingThisDeal ? (
                                  <>
                                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                    Claiming...
                                  </>
                                ) : isOwnDeal ? (
                                  'Your Deal'
                                ) : hasClaimedThisDeal ? (
                                  'Claimed'
                                ) : (
                                  'Claim'
                                )}
                              </Button>
                            ) : (
                              <Button size="sm" variant="secondary" disabled>
                                {deal.availableSlots === 0 ? 'Full' : 'Expired'}
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-background to-accent/10 animate-fade-in">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Start Saving?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users who are already saving money with SplitClub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2" asChild>
              <Link to="/login">
                Sign Up Free <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Video Modals */}
      <VideoUploadModal
        open={showUploadModal}
        onOpenChange={setShowUploadModal}
        onVideoUploaded={handleVideoUploaded}
      />
      
      {demoVideoUrl && (
        <VideoPlayer
          open={showVideoPlayer}
          onOpenChange={setShowVideoPlayer}
          videoUrl={demoVideoUrl}
          title="SplitClub Demo"
        />
      )}
    </div>
  );
};
