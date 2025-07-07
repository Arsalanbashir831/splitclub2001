import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoManagement } from "../components/AdminDashboard/VideoManagement";
import { supabase } from "@/integrations/supabase/client";
import {
	Users,
	Gift,
	DollarSign,
	TrendingUp,
	Activity,
	AlertCircle,
	CheckCircle,
	Clock,
	BarChart3,
} from "lucide-react";
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
} from "recharts";

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
	role?: string;
	avatar_url?: string;
	is_admin: boolean;
}

interface Claim {
	id: string;
	deal_id: string;
	user_id: string;
	claimed_at: string;
}

const AdminDashboardSkeleton = () => (
	<div className="min-h-screen bg-background">
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={i} className="border-0 shadow-lg">
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
						<Card key={i} className="border-0 shadow-lg">
							<CardContent className="p-6">
								<div className="flex items-center space-x-4">
									<Skeleton className="h-12 w-12 rounded-full" />
									<div>
										<Skeleton className="h-4 w-48 mb-2" />
										<Skeleton className="h-3 w-32" />
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	</div>
);

const AdminDashboard = () => {
	const [activeTab, setActiveTab] = useState("overview");

	const {
		data: deals,
		isLoading: dealsLoading,
		error: dealsError,
	} = useQuery({
		queryKey: ["admin-deals"],
		queryFn: async () => {
			const { data, error } = await supabase.from("deals").select("*");

			if (error) {
				console.error("Error fetching deals:", error);
				throw error;
			}

			return data as Deal[];
		},
	});

	const {
		data: users,
		isLoading: usersLoading,
		error: usersError,
	} = useQuery({
		queryKey: ["admin-users"],
		queryFn: async () => {
			const { data, error } = await supabase.from("profiles").select("*");

			if (error) {
				console.error("Error fetching users:", error);
				throw error;
			}

			return (
				(data?.map((profile) => ({
					user_id: profile.user_id,
					display_name: profile.display_name || "Unknown User",
					role: profile.is_admin ? "admin" : "user",
					avatar_url: profile.avatar_url,
					is_admin: profile.is_admin,
				})) as User[]) || []
			);
		},
	});

	const {
		data: claims,
		isLoading: claimsLoading,
		error: claimsError,
	} = useQuery({
		queryKey: ["admin-claims"],
		queryFn: async () => {
			const { data, error } = await supabase.from("deal_claims").select("*");

			if (error) {
				console.error("Error fetching claims:", error);
				throw error;
			}

			return data as Claim[];
		},
	});

	const totalRevenue =
		deals?.reduce((sum, deal) => sum + (deal.price || 0), 0) || 0;

	if (dealsLoading || usersLoading || claimsLoading) {
		return <AdminDashboardSkeleton />;
	}

	if (dealsError || usersError || claimsError) {
		return (
			<div className="min-h-screen bg-background">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<Card className="border-0 shadow-xl bg-destructive/10 border-destructive/20">
						<CardContent className="text-center p-12">
							<AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
							<h2 className="text-2xl font-bold text-destructive mb-4">
								Error loading dashboard data
							</h2>
							<p className="text-destructive/80">
								Please try refreshing the page
							</p>
							<Button
								variant="outline"
								className="mt-4"
								onClick={() => window.location.reload()}>
								Refresh Page
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	const stats = [
		{
			label: "Total Users",
			value: users?.length || 0,
			icon: Users,
			color: "text-primary",
			bgColor: "bg-primary/10",
			change: "+12.5%",
		},
		{
			label: "Total Deals",
			value: deals?.length || 0,
			icon: Gift,
			color: "text-green-500 dark:text-green-400",
			bgColor: "bg-green-100 dark:bg-green-900/20",
			change: "+8.1%",
		},
		{
			label: "Total Revenue",
			value: `£${totalRevenue.toFixed(2)}`,
			icon: DollarSign,
			color: "text-purple-500 dark:text-purple-400",
			bgColor: "bg-purple-100 dark:bg-purple-900/20",
			change: "+23.4%",
		},
		{
			label: "Active Deals",
			value: deals?.filter((deal) => deal.status === "active").length || 0,
			icon: TrendingUp,
			color: "text-orange-500 dark:text-orange-400",
			bgColor: "bg-orange-100 dark:bg-orange-900/20",
			change: "+5.7%",
		},
	];

	// Data for charts
	const categoryData = deals?.reduce((acc, deal) => {
		acc[deal.category] = (acc[deal.category] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	const chartData = Object.entries(categoryData || {}).map(
		([category, count]) => ({
			category,
			count,
		})
	);

	const COLORS = [
		"#3B82F6",
		"#10B981",
		"#F59E0B",
		"#EF4444",
		"#8B5CF6",
		"#06B6D4",
	];

	return (
		<motion.div
			className="min-h-screen bg-background"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.3 }}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<motion.div
					className="mb-8"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}>
					<div className="text-center mb-8">
						<h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">
							Admin Dashboard
						</h1>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Comprehensive overview of platform statistics, user management,
							and performance metrics.
						</p>
					</div>
				</motion.div>

				<motion.div
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}>
					{stats.map((stat, index) => (
						<motion.div
							key={index}
							whileHover={{ scale: 1.05 }}
							transition={{ duration: 0.2 }}>
							<Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-card">
								<CardContent className="p-6">
									<div className="flex items-center justify-between mb-4">
										<div className={`p-3 rounded-xl ${stat.bgColor}`}>
											<stat.icon className={`h-6 w-6 ${stat.color}`} />
										</div>
										<Badge variant="secondary" className="text-xs font-medium">
											{stat.change}
										</Badge>
									</div>
									<div>
										<p className="text-sm font-medium text-muted-foreground mb-1">
											{stat.label}
										</p>
										<p className="text-3xl font-bold text-foreground">
											{stat.value}
										</p>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</motion.div>

				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}>
					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="space-y-6">
						<div className="flex justify-center">
							<TabsList className="grid grid-cols-5 w-fit bg-card shadow-lg border-0 p-1">
								<TabsTrigger
									value="overview"
									className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
									<BarChart3 className="h-4 w-4 mr-2" />
									Overview
								</TabsTrigger>
								<TabsTrigger
									value="deals"
									className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
									<Gift className="h-4 w-4 mr-2" />
									Deals
								</TabsTrigger>
								<TabsTrigger
									value="users"
									className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
									<Users className="h-4 w-4 mr-2" />
									Users
								</TabsTrigger>
								<TabsTrigger
									value="claims"
									className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
									<Activity className="h-4 w-4 mr-2" />
									Claims
								</TabsTrigger>
								<TabsTrigger
									value="videos"
									className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
									<TrendingUp className="h-4 w-4 mr-2" />
									Videos
								</TabsTrigger>
							</TabsList>
						</div>

						<TabsContent value="overview">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
								<Card className="border-0 shadow-lg bg-card">
									<CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
										<CardTitle className="flex items-center gap-2">
											<BarChart3 className="h-5 w-5" />
											Deals by Category
										</CardTitle>
									</CardHeader>
									<CardContent className="p-6">
										<ResponsiveContainer width="100%" height={300}>
											<BarChart data={chartData}>
												<CartesianGrid
													strokeDasharray="3 3"
													className="stroke-muted"
												/>
												<XAxis
													dataKey="category"
													className="fill-muted-foreground"
												/>
												<YAxis className="fill-muted-foreground" />
												<Tooltip
													contentStyle={{
														backgroundColor: "hsl(var(--card))",
														border: "1px solid hsl(var(--border))",
														borderRadius: "8px",
													}}
												/>
												<Bar
													dataKey="count"
													fill="hsl(var(--primary))"
													radius={[4, 4, 0, 0]}
												/>
											</BarChart>
										</ResponsiveContainer>
									</CardContent>
								</Card>

								<Card className="border-0 shadow-lg bg-card">
									<CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
										<CardTitle className="flex items-center gap-2">
											<Activity className="h-5 w-5" />
											Deal Distribution
										</CardTitle>
									</CardHeader>
									<CardContent className="p-6">
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
													label={({ category, percent }) =>
														`${category} ${(percent * 100).toFixed(0)}%`
													}>
													{chartData?.map((entry, index) => (
														<Cell
															key={`cell-${index}`}
															fill={COLORS[index % COLORS.length]}
														/>
													))}
												</Pie>
												<Tooltip
													contentStyle={{
														backgroundColor: "hsl(var(--card))",
														border: "1px solid hsl(var(--border))",
														borderRadius: "8px",
													}}
												/>
											</PieChart>
										</ResponsiveContainer>
									</CardContent>
								</Card>
							</div>
						</TabsContent>

						<TabsContent value="deals">
							<div className="space-y-4">
								<div className="flex justify-between items-center">
									<h2 className="text-2xl font-bold text-foreground">
										Deals Management
									</h2>
									<Badge variant="outline" className="text-sm">
										{deals?.length || 0} total deals
									</Badge>
								</div>
								<div className="grid gap-4">
									{deals?.map((deal) => (
										<Card
											key={deal.id}
											className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card">
											<CardContent className="p-6">
												<div className="flex justify-between items-start">
													<div className="flex-1">
														<h3 className="text-lg font-semibold text-foreground mb-2">
															{deal.title}
														</h3>
														<div className="flex items-center gap-4 text-sm text-muted-foreground">
															<div className="flex items-center gap-1">
																<Clock className="h-4 w-4" />
																{new Date(deal.created_at).toLocaleDateString()}
															</div>
															<Badge variant="outline">{deal.category}</Badge>
															<span className="font-medium">${deal.price}</span>
														</div>
													</div>
													<Badge
														variant={
															deal.status === "active"
																? "default"
																: "destructive"
														}>
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
							<div className="space-y-4">
								<div className="flex justify-between items-center">
									<h2 className="text-2xl font-bold text-foreground">
										Users Management
									</h2>
									<Badge variant="outline" className="text-sm">
										{users?.length || 0} total users
									</Badge>
								</div>
								<div className="grid gap-4">
									{users?.map((user) => (
										<Card
											key={user.user_id}
											className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card">
											<CardContent className="p-6">
												<div className="flex justify-between items-start">
													<div className="flex items-center gap-4">
														{user.avatar_url ? (
															<img
																src={user.avatar_url}
																alt={user.display_name}
																className="w-12 h-12 rounded-full object-cover"
															/>
														) : (
															<div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-primary-foreground font-semibold">
																{user.display_name.charAt(0).toUpperCase()}
															</div>
														)}
														<div>
															<h3 className="text-lg font-semibold text-foreground">
																{user.display_name}
															</h3>
															<p className="text-sm text-muted-foreground">
																User ID: {user.user_id.slice(0, 8)}...
															</p>
														</div>
													</div>
													<div className="flex items-center gap-2">
														<Badge
															variant={user.is_admin ? "default" : "secondary"}>
															{user.role}
														</Badge>
														<Badge
															variant="outline"
															className="text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">
															<CheckCircle className="h-3 w-3 mr-1" />
															Active
														</Badge>
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</div>
						</TabsContent>

						<TabsContent value="claims">
							<div className="space-y-4">
								<div className="flex justify-between items-center">
									<h2 className="text-2xl font-bold text-foreground">
										Claims Management
									</h2>
									<Badge variant="outline" className="text-sm">
										{claims?.length || 0} total claims
									</Badge>
								</div>
								<div className="grid gap-4">
									{claims?.map((claim) => (
										<Card
											key={claim.id}
											className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card">
											<CardContent className="p-6">
												<div className="flex justify-between items-start">
													<div>
														<h3 className="text-lg font-semibold text-foreground mb-2">
															Claim #{claim.id.slice(0, 8)}
														</h3>
														<div className="space-y-1 text-sm text-muted-foreground">
															<div className="flex items-center gap-1">
																<Clock className="h-4 w-4" />
																Claimed:{" "}
																{new Date(
																	claim.claimed_at
																).toLocaleDateString()}
															</div>
															<p>Deal ID: {claim.deal_id.slice(0, 8)}...</p>
															<p>User ID: {claim.user_id.slice(0, 8)}...</p>
														</div>
													</div>
													<Badge variant="default">
														<CheckCircle className="h-3 w-3 mr-1" />
														Claimed
													</Badge>
												</div>
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
		</motion.div>
	);
};

export default AdminDashboard;
