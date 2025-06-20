import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Bell, Shield, Trash2, Download } from 'lucide-react';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export const Settings = () => {
  useScrollToTop();
  const { user, signOut } = useAuthStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isPrivacyModeEnabled, setIsPrivacyModeEnabled] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({ display_name: displayName })
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // Optimistically update the user's name in the auth store
      useAuthStore.setState((state) => ({
        user: {
          ...state.user!,
          name: displayName,
        },
      }));

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message || "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Delete user account (Supabase function)
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { user_id: user.id },
      });

      if (error) {
        throw error;
      }

      // Sign out the user after successful deletion
      await signOut();

      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting account",
        description: error.message || "There was an error deleting your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <Button onClick={handleUpdateProfile} disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </Button>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Enable Notifications</Label>
                <Switch
                  id="notifications"
                  checked={isNotificationsEnabled}
                  onCheckedChange={setIsNotificationsEnabled}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Receive updates and promotional offers.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="privacy">Enable Privacy Mode</Label>
                <Switch
                  id="privacy"
                  checked={isPrivacyModeEnabled}
                  onCheckedChange={setIsPrivacyModeEnabled}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Hide your profile from public view.
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Data Management</h3>
              <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download Your Data
              </Button>
              <Button variant="destructive" className="w-full flex items-center justify-center gap-2" onClick={handleDeleteAccount} disabled={loading}>
                {loading ? (
                  "Deleting..."
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </>
                )}
              </Button>
            </div>

            <Separator />

            <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={handleSignOut} disabled={loading}>
              {loading ? "Signing Out..." : "Sign Out"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};
