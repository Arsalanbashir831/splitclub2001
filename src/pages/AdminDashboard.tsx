
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { VideoManagement } from '../components/AdminDashboard/VideoManagement';
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
  email?: string;
  role?: string;
  avatar_url?: string;
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
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div>
                <Skeleton className="h-4 w-48 mb-2" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

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

      // Map the data to match the User interface
      return data?.map(profile => ({
        user_id: profile.user_id,
        display_name: profile.display_name || 'Unknown User',
        email: profile.email || '',
        role: profile.is_admin ? 'admin' : 'user',
        avatar_url: profile.avatar_url
      })) as User[] || [];
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

  // Data for charts
  const categoryData = deals?.reduce((acc, deal) => {
    acc[deal.category] = (acc[deal.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(categoryData || {}).map(([category, count]) => ({
    category,
    count
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

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
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
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
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="deals">Deals</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="claims">Claims</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Deals by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Deal Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                        >
                          {chartData?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="deals">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Deals Management</h2>
                <div className="grid gap-4">
                  {deals?.map(deal => (
                    <Card key={deal.id}>
                      <CardHeader>
                        <CardTitle>{deal.title}</CardTitle>
                        <CardDescription>
                          <Clock className="h-4 w-4 mr-1 inline" />
                          Created at: {new Date(deal.created_at).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div>
                            <p>Category: {deal.category}</p>
                            <p>Price: ${deal.price}</p>
                          </div>
                          <Badge variant={deal.status === 'active' ? 'default' : 'destructive'}>
                            {deal.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="users">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Users Management</h2>
                <div className="grid gap-4">
                  {users?.map(user => (
                    <Card key={user.user_id}>
                      <CardHeader>
                        <CardTitle>{user.display_name}</CardTitle>
                        <CardDescription>
                          <AlertCircle className="h-4 w-4 mr-1 inline text-yellow-500" />
                          User ID: {user.user_id}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div>
                            <p>Email: {user.email}</p>
                            <p>Role: {user.role || 'User'}</p>
                          </div>
                          <Badge variant="secondary">
                            <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                            Verified
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="claims">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Claims Management</h2>
                <div className="grid gap-4">
                  {claims?.map(claim => (
                    <Card key={claim.id}>
                      <CardHeader>
                        <CardTitle>Claim ID: {claim.id}</CardTitle>
                        <CardDescription>
                          <Clock className="h-4 w-4 mr-1 inline" />
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
