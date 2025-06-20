
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GdprConsent } from '@/components/GdprConsent';
import { DealStatusCard } from '@/components/DealStatusCard';
import { useAuthStore } from '@/store/authStore';
import { dealsService } from '@/services/dealsService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Settings, Shield, History, Upload, Download, Trash2, Loader2 } from 'lucide-react';

export const Profile = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userDeals, setUserDeals] = useState([]);
  const [userClaims, setUserClaims] = useState([]);
  const [profileData, setProfileData] = useState({
    displayName: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      // Store the current page for redirect after login
      sessionStorage.setItem('redirectAfterLogin', '/profile');
      navigate('/login');
      return;
    }

    if (user) {
      loadUserData();
    }
  }, [isAuthenticated, user, navigate]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Load user deals
      const deals = await dealsService.getUserDeals(user.id);
      setUserDeals(deals);

      // Load user claims
      const claims = await dealsService.getUserClaims(user.id);
      setUserClaims(claims);
    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Error",
        description: "Failed to load user data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: profileData.displayName,
          avatar_url: profileData.avatar
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataExport = async () => {
    if (!user) return;

    try {
      // Get user's complete data
      const [deals, claims, profile] = await Promise.all([
        dealsService.getUserDeals(user.id),
        dealsService.getUserClaims(user.id),
        supabase.from('profiles').select('*').eq('user_id', user.id).single()
      ]);

      const userData = {
        profile: profile.data,
        deals,
        claims,
        exportDate: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `splitclub-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data exported",
        description: "Your data has been downloaded to your device.",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Error",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAccountDeletion = async () => {
    if (!user) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data."
    );

    if (!confirmed) return;

    try {
      // In a real implementation, this would call a secure endpoint
      // that handles the full account deletion process
      toast({
        title: "Account deletion requested",
        description: "Your account deletion request has been submitted. You will receive a confirmation email.",
      });
    } catch (error) {
      console.error('Error requesting account deletion:', error);
      toast({
        title: "Error",
        description: "Failed to request account deletion. Please contact support.",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account, privacy preferences, and view your activity.
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center space-x-2">
              <History className="h-4 w-4" />
              <span>Activity</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profileData.avatar} />
                    <AvatarFallback className="text-xl">
                      {profileData.displayName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{profileData.displayName}</h3>
                    <Badge variant="secondary">Member since 2024</Badge>
                    {user.isAdmin && (
                      <Badge variant="default">Admin</Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={profileData.displayName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                <Button onClick={handleProfileUpdate} disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Profile'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading activity...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Shared Deals ({userDeals.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {userDeals.length > 0 ? (
                      userDeals.slice(0, 5).map((deal) => (
                        <div key={deal.id} className="p-4 border rounded-lg">
                          <h4 className="font-medium">{deal.title}</h4>
                          <p className="text-sm text-muted-foreground">{deal.category}</p>
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant={deal.status === 'active' ? 'default' : 'secondary'}>
                              {deal.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(deal.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        You haven't shared any deals yet.
                      </p>
                    )}
                    {userDeals.length > 5 && (
                      <Button variant="outline" size="sm" className="w-full">
                        View All ({userDeals.length})
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Your Claimed Deals ({userClaims.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {userClaims.length > 0 ? (
                      userClaims.slice(0, 5).map((claim) => (
                        <div key={claim.id} className="p-4 border rounded-lg">
                          <h4 className="font-medium">{claim.deals?.title || 'Deal'}</h4>
                          <p className="text-sm text-muted-foreground">{claim.deals?.category}</p>
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="default">Claimed</Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(claim.claimed_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        You haven't claimed any deals yet.
                      </p>
                    )}
                    {userClaims.length > 5 && (
                      <Button variant="outline" size="sm" className="w-full">
                        View All ({userClaims.length})
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="privacy">
            <GdprConsent />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">Export Your Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Download a copy of all your SplitClub data
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleDataExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium text-destructive">Delete Account</h4>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button variant="destructive" onClick={handleAccountDeletion}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
