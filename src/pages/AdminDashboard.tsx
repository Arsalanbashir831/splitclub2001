import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VideoManagement } from '@/components/AdminDashboard/VideoManagement';
import { AdminSkeleton } from '@/components/AdminDashboard/AdminSkeleton';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { Users, Package, MessageSquare, DollarSign, Activity } from 'lucide-react';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export const AdminDashboard = () => {
  useScrollToTop();
  const { user } = useAuthStore();

  const { data: usersCount, isLoading: usersLoading } = useQuery(
    ['usersCount'],
    async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });
      if (error) throw error;
      return count || 0;
    }
  );

  const { data: dealsCount, isLoading: dealsLoading } = useQuery(
    ['dealsCount'],
    async () => {
      const { count, error } = await supabase
        .from('deals')
        .select('*', { count: 'exact' });
      if (error) throw error;
      return count || 0;
    }
  );

  const { data: messagesCount, isLoading: messagesLoading } = useQuery(
    ['messagesCount'],
    async () => {
      const { count, error } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact' });
      if (error) throw error;
      return count || 0;
    }
  );

  const { data: totalRevenue, isLoading: revenueLoading } = useQuery(
    ['totalRevenue'],
    async () => {
      const { data, error } = await supabase
        .from('deals')
        .select('price')
        .not('price', 'is', null);
      if (error) throw error;
      const total = data?.reduce((acc, deal) => acc + (deal.price || 0), 0) || 0;
      return total;
    }
  );

  const isAdmin = user?.isAdmin;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="mt-4">You do not have permission to view this page.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <AdminSkeleton />
              ) : (
                <div className="text-3xl font-bold">{usersCount}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Total Deals
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dealsLoading ? (
                <AdminSkeleton />
              ) : (
                <div className="text-3xl font-bold">{dealsCount}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Contact Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              {messagesLoading ? (
                <AdminSkeleton />
              ) : (
                <div className="text-3xl font-bold">{messagesCount}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              {revenueLoading ? (
                <AdminSkeleton />
              ) : (
                <div className="text-3xl font-bold">${totalRevenue?.toFixed(2)}</div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Demo Video Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <VideoManagement />
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};
