import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { MessageReader } from '@/components/MessageReader';
import { AdminSkeleton } from '@/components/AdminDashboard/AdminSkeleton';
import { VideoManagement } from '@/components/AdminDashboard/VideoManagement';
import { useRealtimeDeals } from '@/hooks/useRealtimeDeals';
import { useRealtimeContactMessages } from '@/hooks/useRealtimeContactMessages';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { 
  Users, ShoppingCart, MessageSquare, TrendingUp,
  Clock, DollarSign, AlertTriangle 
} from 'lucide-react';

export const AdminDashboard = () => {
  useScrollToTop();
  const { deals, isLoading: dealsLoading } = useRealtimeDeals();
  const { messages, isLoading: messagesLoading } = useRealtimeContactMessages();

  const isLoading = dealsLoading || messagesLoading;

  // Calculate statistics
  const stats = {
    totalDeals: deals?.length || 0,
    activeDeals: deals?.filter(d => d.status === 'active').length || 0,
    totalMessages: messages?.length || 0,
    unreadMessages: messages?.filter(m => m.status === 'unread').length || 0,
    totalValue: deals?.reduce((sum, deal) => sum + deal.originalPrice, 0) || 0,
    totalSavings: deals?.reduce((sum, deal) => sum + (deal.originalPrice - deal.sharePrice), 0) || 0,
  };

  // Process data for charts
  const categoryData = deals?.reduce((acc: any, deal) => {
    acc[deal.category] = (acc[deal.category] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(categoryData || {}).map(([category, count]) => ({
    category,
    count
  }));

  // Recent activity
  const recentDeals = deals?.slice(0, 5) || [];
  const recentMessages = messages?.slice(0, 5) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Monitor and manage your platform</p>
            </div>
            <MessageReader />
          </div>
          <AdminSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor and manage your platform</p>
          </div>
          <MessageReader />
        </div>

        {/* Video Management Section */}
        <div className="mb-8">
          <VideoManagement />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDeals}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeDeals} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMessages}</div>
              <p className="text-xs text-muted-foreground">
                {stats.unreadMessages} unread
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalValue.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">
                Original value of all deals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalSavings.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">
                Community savings
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Deals by Category Chart */}
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

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Latest Deals</h4>
                  <div className="space-y-2">
                    {recentDeals.map((deal) => (
                      <div key={deal.id} className="flex items-center justify-between text-sm">
                        <span className="truncate">{deal.title}</span>
                        <span className="text-muted-foreground">
                          {new Date(deal.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Recent Messages</h4>
                  <div className="space-y-2">
                    {recentMessages.map((message) => (
                      <div key={message.id} className="flex items-center justify-between text-sm">
                        <span className="truncate">{message.name}</span>
                        <span className="text-muted-foreground">
                          {new Date(message.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
