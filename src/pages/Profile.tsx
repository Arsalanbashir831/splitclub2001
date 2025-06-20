
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/store/authStore';
import { useUserDeals } from '@/hooks/useUserDeals';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Tag, Plus, Settings, Eye } from 'lucide-react';

export const Profile = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { userDeals, claimedDeals, isLoading } = useUserDeals();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant={user.isAdmin ? "default" : "secondary"}>
                    {user.isAdmin ? 'Admin' : 'Member'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Joined {formatDate(new Date().toISOString())}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button asChild variant="outline">
                <Link to="/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
              <Button asChild>
                <Link to="/share-deal">
                  <Plus className="h-4 w-4 mr-2" />
                  Share Deal
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{userDeals.length}</div>
                <div className="text-sm text-muted-foreground">Deals Shared</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{claimedDeals.length}</div>
                <div className="text-sm text-muted-foreground">Deals Claimed</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {userDeals.filter(deal => deal.status === 'active').length}
                </div>
                <div className="text-sm text-muted-foreground">Active Deals</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Deals Tabs */}
        <Tabs defaultValue="shared" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="shared">Deals I've Shared</TabsTrigger>
            <TabsTrigger value="claimed">Deals I've Claimed</TabsTrigger>
          </TabsList>

          <TabsContent value="shared" className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                      <div className="flex space-x-2">
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : userDeals.length > 0 ? (
              <div className="space-y-4">
                {userDeals.map((deal) => (
                  <Card key={deal.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{deal.title}</h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Created {formatDate(deal.createdAt)}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Expires {formatDate(deal.expiryDate)}
                            </div>
                            {deal.locationDetails && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {deal.locationDetails}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge variant={deal.status === 'active' ? 'default' : 'secondary'}>
                            {deal.status}
                          </Badge>
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/deal/${deal.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          <Tag className="h-3 w-3 mr-1" />
                          {deal.category}
                        </Badge>
                        {deal.sharePrice && (
                          <Badge variant="outline" className="text-green-600">
                            ${deal.sharePrice}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-muted-foreground mb-4">
                    You haven't shared any deals yet
                  </div>
                  <Button asChild>
                    <Link to="/share-deal">
                      <Plus className="h-4 w-4 mr-2" />
                      Share Your First Deal
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="claimed" className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                      <div className="flex space-x-2">
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : claimedDeals.length > 0 ? (
              <div className="space-y-4">
                {claimedDeals.map((claim: any) => (
                  <Card key={claim.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{claim.deals.title}</h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Claimed {formatDate(claim.claimed_at)}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Expires {formatDate(claim.deals.expiry_date)}
                            </div>
                            {claim.deals.location_details && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {claim.deals.location_details}
                              </div>
                            )}
                          </div>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/deal/${claim.deals.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View Deal
                          </Link>
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          <Tag className="h-3 w-3 mr-1" />
                          {claim.deals.category}
                        </Badge>
                        {claim.deals.price && (
                          <Badge variant="outline" className="text-green-600">
                            ${claim.deals.price}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-muted-foreground mb-4">
                    You haven't claimed any deals yet
                  </div>
                  <Button asChild>
                    <Link to="/deals">
                      <Eye className="h-4 w-4 mr-2" />
                      Browse Deals
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
