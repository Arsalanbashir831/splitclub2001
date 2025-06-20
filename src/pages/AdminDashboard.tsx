
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { VideoManagement } from '../components/AdminDashboard/VideoManagement';
import { AdminSkeleton } from '../components/AdminDashboard/AdminSkeleton';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Gift, 
  DollarSign, 
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  category: string;
  price: number;
  status: string;
  created_at: string;
}

interface User {
  user_id: string;
  display_name: string;
  email: string;
  role?: string;
}

interface Claim {
  id: string;
  deal_id: string;
  user_id: string;
  claimed_at: string;
}

const AdminDashboardSkeleton = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle><div className="h-6 w-32 bg-muted animate-pulse" /></CardTitle>
              <CardDescription><div className="h-4 w-48 bg-muted animate-pulse" /></CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-full bg-muted animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <div className="h-8 w-64 bg-muted animate-pulse mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
              <div>
                <div className="h-4 w-48 bg-muted animate-pulse mb-2" />
                <div className="h-3 w-32 bg-muted animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('deals');

  const { data: deals, isLoading: dealsLoading, error: dealsError } = useQuery({
    queryKey: ['admin-deals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select('*');

      if (error) {
        console.error('Error fetching deals:', error);
        throw error;
      }

      return data as Deal[];
    }
  });

  const { data: users, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      return data as User[];
    }
  });

  const { data: claims, isLoading: claimsLoading, error: claimsError } = useQuery({
    queryKey: ['admin-claims'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deal_claims')
        .select('*');

      if (error) {
        console.error('Error fetching claims:', error);
        throw error;
      }

      return data as Claim[];
    }
  });

  const totalRevenue = deals?.reduce((sum, deal) => sum + (deal.price || 0), 0) || 0;

  if (dealsLoading || usersLoading || claimsLoading) {
    return <AdminDashboardSkeleton />;
  }

  if (dealsError || usersError || claimsError) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Error loading data</h2>
            <p className="text-muted-foreground">Please try refreshing the page</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const stats = [
    { label: 'Total Users', value: users?.length || 0, icon: Users, color: 'text-blue-500' },
    { label: 'Total Deals', value: deals?.length || 0, icon: Gift, color: 'text-green-500' },
    { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-purple-500' },
    { label: 'Active Deals', value: deals?.filter(deal => deal.status === 'active').length || 0, icon: TrendingUp, color: 'text-orange-500' },
  ];

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of platform statistics and management tools.</p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  <span>{stat.label}</span>
                </CardTitle>
                <CardDescription>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span>{stat.value}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Activity className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Recent activity</span>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="deals">Deals</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="claims">Claims</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>
            <TabsContent value="deals">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Deals Management</h2>
                {deals?.map(deal => (
                  <Card key={deal.id} className="mb-4">
                    <CardHeader>
                      <CardTitle>{deal.title}</CardTitle>
                      <CardDescription>
                        <Clock className="h-4 w-4 mr-1" />
                        Created at: {new Date(deal.created_at).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Category: {deal.category}</p>
                      <p>Price: ${deal.price}</p>
                      <Badge variant={deal.status === 'active' ? 'outline' : 'destructive'}>
                        {deal.status}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="users">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Users Management</h2>
                {users?.map(user => (
                  <Card key={user.user_id} className="mb-4">
                    <CardHeader>
                      <CardTitle>{user.display_name}</CardTitle>
                      <CardDescription>
                        <AlertCircle className="h-4 w-4 mr-1 text-yellow-500" />
                        User ID: {user.user_id}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Email: {user.email}</p>
                      <p>Role: {user.role || 'User'}</p>
                      <Badge variant="secondary">
                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                        Verified
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="claims">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Claims Management</h2>
                {claims?.map(claim => (
                  <Card key={claim.id} className="mb-4">
                    <CardHeader>
                      <CardTitle>Claim ID: {claim.id}</CardTitle>
                      <CardDescription>
                        <Clock className="h-4 w-4 mr-1" />
                        Claimed at: {new Date(claim.claimed_at).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Deal ID: {claim.deal_id}</p>
                      <p>User ID: {claim.user_id}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="videos">
              <VideoManagement />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <Footer />
    </motion.div>
  );
};

export default AdminDashboard;
