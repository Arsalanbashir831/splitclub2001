import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Navbar } from '../components/Navbar';
import { mockDeals, mockUsers, mockLogs } from '../data/mockData';
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
  AlertTriangle
} from 'lucide-react';

export const AdminDashboard = () => {
  // Calculate statistics
  const totalDeals = mockDeals.length;
  const activeDeals = mockDeals.filter(d => d.status === 'active').length;
  const totalUsers = mockUsers.length;
  const totalSavings = mockDeals.reduce((sum, deal) => sum + (deal.originalPrice - deal.sharePrice), 0);

  // Category distribution
  const categoryData = [
    { name: 'Subscriptions', value: mockDeals.filter(d => d.category === 'subscription').length, color: '#3b82f6' },
    { name: 'Memberships', value: mockDeals.filter(d => d.category === 'membership').length, color: '#10b981' },
    { name: 'Rewards', value: mockDeals.filter(d => d.category === 'reward').length, color: '#8b5cf6' },
    { name: 'Other', value: mockDeals.filter(d => d.category === 'other').length, color: '#f59e0b' }
  ];

  // Activity over time (mock data)
  const activityData = [
    { date: '2024-06-01', claims: 5, views: 23 },
    { date: '2024-06-02', claims: 8, views: 31 },
    { date: '2024-06-03', claims: 12, views: 45 },
    { date: '2024-06-04', claims: 7, views: 28 },
    { date: '2024-06-05', claims: 15, views: 52 },
    { date: '2024-06-06', claims: 11, views: 38 },
    { date: '2024-06-07', claims: 9, views: 33 }
  ];

  // Price distribution
  const priceData = [
    { range: 'Free', count: mockDeals.filter(d => d.isFree).length },
    { range: '$1-10', count: mockDeals.filter(d => !d.isFree && d.sharePrice <= 10).length },
    { range: '$11-25', count: mockDeals.filter(d => !d.isFree && d.sharePrice > 10 && d.sharePrice <= 25).length },
    { range: '$26-50', count: mockDeals.filter(d => !d.isFree && d.sharePrice > 25 && d.sharePrice <= 50).length },
    { range: '$50+', count: mockDeals.filter(d => !d.isFree && d.sharePrice > 50).length }
  ];

  // Recent activity
  const recentActivity = mockLogs.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, 10);

  // Expiring deals
  const expiringDeals = mockDeals.filter(deal => {
    const expiryDate = new Date(deal.expiryDate);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && deal.status === 'active';
  });

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
              <div className="text-2xl font-bold">{totalDeals}</div>
              <p className="text-xs text-muted-foreground">
                {activeDeals} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Community members
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSavings.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">
                Community impact
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activity</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockLogs.length}</div>
              <p className="text-xs text-muted-foreground">
                Total actions
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Distribution */}
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

              {/* Price Distribution */}
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

              {/* Activity Over Time */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Activity Trends</CardTitle>
                  <CardDescription>Claims and views over the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="claims" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="views" stroke="#10b981" strokeWidth={2} />
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
                    {mockDeals.filter(d => d.status === 'active').slice(0, 5).map((deal) => (
                      <div key={deal.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{deal.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{deal.category}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {deal.availableSlots} slots left
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
                          <Button size="sm" variant="outline">
                            Extend
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Community Members</CardTitle>
                <CardDescription>Platform users and their activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUsers.map((user) => {
                    const userDeals = mockDeals.filter(d => d.sharedBy.id === user.id);
                    const userClaims = mockLogs.filter(l => l.userId === user.id && l.action === 'claimed');
                    
                    return (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">{user.name}</h4>
                              {user.isAdmin && (
                                <Badge variant="secondary">Admin</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {userDeals.length} deals shared
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {userClaims.length} deals claimed
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
                <CardDescription>Latest user actions on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((log) => {
                    const user = mockUsers.find(u => u.id === log.userId);
                    const deal = mockDeals.find(d => d.id === log.dealId);
                    
                    return (
                      <div key={log.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.avatar} alt={user?.name} />
                          <AvatarFallback>
                            {user?.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{user?.name}</span>
                            {' '}
                            <span className="text-muted-foreground">
                              {log.action === 'claimed' ? 'claimed' : 
                               log.action === 'viewed' ? 'viewed' :
                               log.action === 'shared' ? 'shared' : 'reviewed'}
                            </span>
                            {' '}
                            <span className="font-medium">{deal?.title}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {log.action}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};