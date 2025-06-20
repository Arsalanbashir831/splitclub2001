
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Navbar } from '../components/Navbar';
import { useRealtimeDeals } from '@/hooks/useRealtimeDeals';
import { useRealtimeContactMessages } from '@/hooks/useRealtimeContactMessages';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Gift, 
  DollarSign, 
  Eye, 
  Activity,
  Calendar,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';
import { useMemo } from 'react';

export const AdminDashboard = () => {
  const { deals, isLoading: dealsLoading } = useRealtimeDeals();
  const { messages, isLoading: messagesLoading } = useRealtimeContactMessages();

  // Calculate statistics from real data
  const stats = useMemo(() => {
    if (!deals) return { totalDeals: 0, activeDeals: 0, totalSavings: 0, freeDeals: 0 };
    
    const totalDeals = deals.length;
    const activeDeals = deals.filter(d => d.status === 'active').length;
    const totalSavings = deals.reduce((sum, deal) => sum + (deal.originalPrice - deal.sharePrice), 0);
    const freeDeals = deals.filter(d => d.isFree).length;
    
    return { totalDeals, activeDeals, totalSavings, freeDeals };
  }, [deals]);

  // Category distribution from real data
  const categoryData = useMemo(() => {
    if (!deals) return [];
    
    const categories = deals.reduce((acc, deal) => {
      acc[deal.category] = (acc[deal.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];
    
    return Object.entries(categories).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  }, [deals]);

  // Price distribution from real data
  const priceData = useMemo(() => {
    if (!deals) return [];
    
    return [
      { range: 'Free', count: deals.filter(d => d.isFree).length },
      { range: '$1-10', count: deals.filter(d => !d.isFree && d.sharePrice <= 10).length },
      { range: '$11-25', count: deals.filter(d => !d.isFree && d.sharePrice > 10 && d.sharePrice <= 25).length },
      { range: '$26-50', count: deals.filter(d => !d.isFree && d.sharePrice > 25 && d.sharePrice <= 50).length },
      { range: '$50+', count: deals.filter(d => !d.isFree && d.sharePrice > 50).length }
    ];
  }, [deals]);

  // Activity over time (mock data for now)
  const activityData = [
    { date: '2024-06-01', deals: 5, messages: 8 },
    { date: '2024-06-02', deals: 8, messages: 12 },
    { date: '2024-06-03', deals: 12, messages: 15 },
    { date: '2024-06-04', deals: 7, messages: 9 },
    { date: '2024-06-05', deals: 15, messages: 18 },
    { date: '2024-06-06', deals: 11, messages: 14 },
    { date: '2024-06-07', deals: 9, messages: 11 }
  ];

  // Expiring deals from real data
  const expiringDeals = useMemo(() => {
    if (!deals) return [];
    
    return deals.filter(deal => {
      const expiryDate = new Date(deal.expiryDate);
      const today = new Date();
      const diffTime = expiryDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && deal.status === 'active';
    });
  }, [deals]);

  if (dealsLoading || messagesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor platform activity and manage deals
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
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
              <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messages?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {messages?.filter(m => m.status === 'unread').length || 0} unread
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalSavings.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">
                Community impact
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Free Deals</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.freeDeals}</div>
              <p className="text-xs text-muted-foreground">
                Available for free
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Distribution */}
              {categoryData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Deal Categories</CardTitle>
                    <CardDescription>Distribution of deals by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                      {categoryData.map((entry) => (
                        <div key={entry.name} className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-sm">{entry.name}: {entry.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Price Distribution */}
              {priceData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Price Distribution</CardTitle>
                    <CardDescription>Deals by price range</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={priceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Activity Over Time */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Activity Trends</CardTitle>
                  <CardDescription>Platform activity over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="deals" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="messages" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="deals" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Deals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gift className="h-5 w-5" />
                    <span>Active Deals</span>
                  </CardTitle>
                  <CardDescription>Currently available deals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deals?.filter(d => d.status === 'active').slice(0, 5).map((deal) => (
                      <div key={deal.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{deal.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{deal.category}</Badge>
                            <span className="text-sm text-muted-foreground">
                              by {deal.sharedBy.name}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            {deal.isFree ? 'FREE' : `$${deal.sharePrice}`}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(deal.expiryDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Expiring Soon */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <span>Expiring Soon</span>
                  </CardTitle>
                  <CardDescription>Deals expiring within 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {expiringDeals.slice(0, 5).map((deal) => {
                      const expiryDate = new Date(deal.expiryDate);
                      const today = new Date();
                      const diffDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                      
                      return (
                        <div key={deal.id} className="flex items-center justify-between p-3 border rounded-lg border-orange-200">
                          <div className="flex-1">
                            <h4 className="font-medium">{deal.title}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline">{deal.category}</Badge>
                              <span className="text-sm text-orange-600 font-medium">
                                {diffDays} days left
                              </span>
                            </div>
                          </div>
                          <div className="font-bold">
                            {deal.isFree ? 'FREE' : `$${deal.sharePrice}`}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
                <CardDescription>Messages from users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages?.slice(0, 10).map((message) => (
                    <div key={message.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{message.name}</h4>
                          <Badge variant={message.status === 'unread' ? 'default' : 'secondary'}>
                            {message.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{message.email}</p>
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(message.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>Latest platform activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deals?.slice(0, 10).map((deal) => (
                    <div key={deal.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={deal.sharedBy.avatar} alt={deal.sharedBy.name} />
                        <AvatarFallback>
                          {deal.sharedBy.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{deal.sharedBy.name}</span>
                          {' '}
                          <span className="text-muted-foreground">shared</span>
                          {' '}
                          <span className="font-medium">{deal.title}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(deal.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {deal.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
