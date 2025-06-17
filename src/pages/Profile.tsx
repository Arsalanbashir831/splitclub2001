import { useAuthStore } from "@/store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, TrendingUp, Gift, Users, Leaf, Edit, Trash2, Clock, Star } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { mockDeals } from "@/data/mockData";
import { Deal } from "@/types";
import { format } from "date-fns";

export const Profile = () => {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  // Mock data for demonstration - in real app, this would come from API
  const joinedDate = new Date('2024-01-15');
  const userProfile = {
    location: "London, UK",
    totalValueSaved: 234.50,
    rewardsShared: 18,
    subscriptionsLeased: 6,
    peopleHelped: 15,
    ecoScore: 47.5,
  };

  // Filter deals based on user interactions (mock data)
  const userDeals = mockDeals.filter(deal => deal.sharedBy.id === user.id);
  const claimedDeals = mockDeals.filter(deal => 
    deal.claimedBy?.some(claimedUser => claimedUser.id === user.id)
  );
  const wishlistDeals = mockDeals.slice(0, 2); // Mock wishlist

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const DealCard = ({ deal, showActions = false, showStatus = false }: { 
    deal: Deal; 
    showActions?: boolean; 
    showStatus?: boolean;
  }) => (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg leading-6">{deal.title}</CardTitle>
            <CardDescription className="mt-1">{deal.description}</CardDescription>
          </div>
          {showActions && (
            <div className="flex gap-2 ml-4">
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={deal.isFree ? "secondary" : "default"}>
                {deal.isFree ? "Free" : formatCurrency(deal.sharePrice)}
              </Badge>
              {showStatus && (
                <Badge variant={deal.status === 'active' ? "default" : "secondary"}>
                  {deal.status}
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {format(new Date(deal.expiryDate), 'MMM dd')}
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {deal.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Overview */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-lg">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {user.name}
                  </h1>
                  
                  <div className="flex items-center gap-6 text-muted-foreground">
                    {userProfile.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{userProfile.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {format(joinedDate, 'MMMM yyyy')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personal Impact Summary */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Personal Impact Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(userProfile.totalValueSaved)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Value Saved</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Gift className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {userProfile.rewardsShared}
                    </p>
                    <p className="text-sm text-muted-foreground">Rewards Shared</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {userProfile.subscriptionsLeased}
                    </p>
                    <p className="text-sm text-muted-foreground">Subscriptions Leased</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                    <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {userProfile.peopleHelped}
                    </p>
                    <p className="text-sm text-muted-foreground">People Helped This Month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                    <Leaf className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {userProfile.ecoScore}kg
                    </p>
                    <p className="text-sm text-muted-foreground">CO₂ Saved (Est.)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* My Deals */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">My Deals</h2>
          <Tabs defaultValue="shared" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="shared">Shared by Me</TabsTrigger>
              <TabsTrigger value="claimed">Claimed by Me</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            </TabsList>
            
            <TabsContent value="shared" className="mt-6">
              {userDeals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userDeals.map((deal) => (
                    <DealCard 
                      key={deal.id} 
                      deal={deal} 
                      showActions={true} 
                      showStatus={true}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">You haven't shared any deals yet.</p>
                    <Button className="mt-4">Share Your First Deal</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="claimed" className="mt-6">
              {claimedDeals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {claimedDeals.map((deal) => (
                    <DealCard key={deal.id} deal={deal} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">You haven't claimed any deals yet.</p>
                    <Button className="mt-4">Browse Available Deals</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="wishlist" className="mt-6">
              {wishlistDeals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlistDeals.map((deal) => (
                    <Card key={deal.id} className="h-full">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg leading-6">{deal.title}</CardTitle>
                            <CardDescription className="mt-1">{deal.description}</CardDescription>
                          </div>
                          <Button size="sm" variant="outline">
                            <Star className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge variant={deal.isFree ? "secondary" : "default"}>
                              {deal.isFree ? "Free" : formatCurrency(deal.sharePrice)}
                            </Badge>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {format(new Date(deal.expiryDate), 'MMM dd')}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {deal.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">Your wishlist is empty.</p>
                    <Button className="mt-4">Add Deals to Wishlist</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};