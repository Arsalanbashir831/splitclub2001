import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DealCard } from "../components/DealCard";
import { DealFilters, FilterState } from "../components/DealFilters";
import { WelcomeTip } from "../components/WelcomeTip";
import { DemoVideoSection } from "../components/DemoVideoSection";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { StatCard } from "@/components/ui/StatCard";
import { AnimatedContainer } from "@/components/animations/AnimatedContainer";
import {
	StaggeredList,
	StaggeredItem,
} from "@/components/animations/StaggeredList";
import { HoverScale } from "@/components/animations/HoverScale";
import { useDeals } from "../hooks/useDeals";
import { useUserClaims } from "../hooks/useUserClaims";
import { useAuthStore } from "../store/authStore";
import { dealsService } from "../services/dealsService";
import { videoService } from "@/services/videoService";
import { Search, Leaf, TrendingUp, Users, Gift, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useFavorites } from "@/hooks/useFavorites";
import { useDemoVideo } from "@/hooks/useDemoVideo";

const Index = () => {
	const { isAuthenticated, user } = useAuthStore();
	const { toast } = useToast();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [searchQuery, setSearchQuery] = useState("");
	const [isFiltersOpen, setIsFiltersOpen] = useState(false);
	const [claimingDealId, setClaimingDealId] = useState<string | null>(null);
	const { data: demoVideo } = useDemoVideo();
	const { deals, isLoading, error } = useDeals();
	const { hasClaimedDeal } = useUserClaims();
	const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

	const [filters, setFilters] = useState<FilterState>({
		category: [],
		priceRange: [0, 100],
		isFree: false,
		availableOnly: false,
		expiringWithin: "any",
		sortBy: "newest",
	});

	// Handle search from URL parameters
	useEffect(() => {
		const searchFromUrl = searchParams.get("search");
		if (searchFromUrl) {
			setSearchQuery(searchFromUrl);
		}
	}, [searchParams]);

	const handleDealClaim = async (dealId: string) => {
		if (!isAuthenticated) {
			sessionStorage.setItem(
				"redirectAfterLogin",
				window.location.pathname + window.location.search
			);
			navigate("/login");
			return;
		}

		if (!user) {
			toast({
				title: "Error",
				description:
					"User information not available. Please try logging in again.",
				variant: "destructive",
			});
			return;
		}

		const deal = deals?.find((d) => d.id === dealId);
		if (deal && deal.sharedBy.id === user.id) {
			toast({
				title: "Cannot claim your own deal",
				description: "You cannot claim a deal that you created.",
				variant: "destructive",
			});
			return;
		}

		setClaimingDealId(dealId);
		try {
			await dealsService.claimDeal(dealId, user.id);
			toast({
				title: "Deal claimed!",
				description:
					"You've successfully claimed this deal. The owner will be notified.",
			});
		} catch (error) {
			console.error("Error claiming deal:", error);
			toast({
				title: "Error claiming deal",
				description: "Something went wrong. Please try again.",
				variant: "destructive",
			});
		} finally {
			setClaimingDealId(null);
		}
	};

	const handleFavoriteToggle = (dealId: string) => {
		if (!isAuthenticated) {
			navigate("/login");
			return;
		}

		if (isFavorite(dealId)) {
			removeFavorite(dealId);
			toast({
				title: "Removed from favorites",
				description: "Deal removed from your favorites.",
			});
		} else {
			addFavorite(dealId);
			toast({
				title: "Added to favorites",
				description: "Deal added to your favorites.",
			});
		}
	};

	const handleDealView = (dealId: string) => {
		navigate(`/deal/${dealId}`);
	};

	const filteredDeals = useMemo(() => {
		if (!deals) return [];

		let filteredList = [...deals];

		// Filter out current user's own deals
		if (user) {
			filteredList = filteredList.filter(
				(deal) => deal.sharedBy.id !== user.id
			);
		}

		if (searchQuery) {
			filteredList = filteredList.filter(
				(deal) =>
					deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					deal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
					deal.tags.some((tag) =>
						tag.toLowerCase().includes(searchQuery.toLowerCase())
					)
			);
		}

		if (filters.category.length > 0) {
			filteredList = filteredList.filter((deal) =>
				filters.category.includes(deal.category)
			);
		}

		if (!filters.isFree) {
			filteredList = filteredList.filter(
				(deal) =>
					deal.isFree ||
					(deal.sharePrice >= filters.priceRange[0] &&
						deal.sharePrice <= filters.priceRange[1])
			);
		} else {
			filteredList = filteredList.filter((deal) => deal.isFree);
		}

		if (filters.availableOnly) {
			filteredList = filteredList.filter(
				(deal) => deal.status === "active" && deal.availableSlots > 0
			);
		}

		if (filters.expiringWithin !== "any") {
			const days = parseInt(filters.expiringWithin);
			const cutoffDate = new Date();
			cutoffDate.setDate(cutoffDate.getDate() + days);

			filteredList = filteredList.filter((deal) => {
				if (!deal.expiryDate) return false;
				const expiryDate = new Date(deal.expiryDate);
				return expiryDate <= cutoffDate;
			});
		}

		switch (filters.sortBy) {
			case "newest":
				filteredList.sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
				break;
			case "expiring":
				filteredList.sort((a, b) => {
					if (!a.expiryDate) return 1;
					if (!b.expiryDate) return -1;
					return (
						new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
					);
				});
				break;
			case "price-low":
				filteredList.sort((a, b) => a.sharePrice - b.sharePrice);
				break;
			case "price-high":
				filteredList.sort((a, b) => b.sharePrice - a.sharePrice);
				break;
			case "popular":
				filteredList.sort(
					(a, b) =>
						b.totalSlots - b.availableSlots - (a.totalSlots - a.availableSlots)
				);
				break;
		}
		return filteredList;
	}, [deals, searchQuery, filters, user]);

	const clearFilters = () => {
		setFilters({
			category: [],
			priceRange: [0, 100],
			isFree: false,
			availableOnly: false,
			expiringWithin: "any",
			sortBy: "newest",
		});
		setSearchQuery("");
	};

	const stats = {
		totalDeals: deals?.length || 0,
		activeDeals: deals?.filter((d) => d.status === "active").length || 0,
		totalSavings:
			deals?.reduce(
				(sum, deal) => sum + (deal.originalPrice - deal.sharePrice),
				0
			) || 0,
		freeDeals: deals?.filter((d) => d.isFree).length || 0,
	};

	if (error) {
		console.error("Error loading deals:", error);
		return (
			<motion.div
				className="min-h-screen bg-background"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3 }}>
				<AnimatedContainer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="text-center">
						<h2 className="text-2xl font-bold text-foreground mb-4">
							Error loading deals
						</h2>
						<p className="text-muted-foreground mb-4">
							{error?.message || "Please try refreshing the page"}
						</p>
						<Button onClick={() => window.location.reload()}>
							Refresh Page
						</Button>
					</div>
				</AnimatedContainer>
			</motion.div>
		);
	}

	return (
		<motion.div
			className="min-h-screen bg-background"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.3 }}>
			<WelcomeTip />

			{/* Hero section */}
			<motion.div
				className="bg-gradient-to-r from-primary/10 via-background to-accent/10 border-b border-border"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
					<div className="text-center max-w-3xl mx-auto">
						<AnimatedContainer
							variant="scaleIn"
							className="flex justify-center mb-6">
							<motion.div
								className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center"
								whileHover={{ rotate: 5, scale: 1.05 }}
								transition={{ duration: 0.2 }}>
								<Leaf className="w-8 h-8 text-primary-foreground" />
							</motion.div>
						</AnimatedContainer>

						<AnimatedContainer variant="slideUp" delay={0.1}>
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
								Share. Save. Sustain.
							</h1>
						</AnimatedContainer>

						<AnimatedContainer variant="fadeIn" delay={0.2}>
							<p className="text-xl md:text-2xl text-muted-foreground mb-8">
								Join the community marketplace for unused subscriptions,
								memberships, and rewards. Reduce waste while saving money
								together.
							</p>
						</AnimatedContainer>

						<motion.div
							className="flex flex-wrap justify-center gap-4 text-sm"
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4, duration: 0.5 }}>
							<StatCard
								icon={TrendingUp}
								label="saved"
								value={`$${stats.totalSavings.toFixed(0)}+`}
								iconColor="text-green-600"
								delay={0.5}
							/>
							<StatCard
								icon={Users}
								label="active deals"
								value={stats.activeDeals}
								iconColor="text-blue-600"
								delay={0.6}
							/>
							<StatCard
								icon={Gift}
								label="free offers"
								value={stats.freeDeals}
								iconColor="text-purple-600"
								delay={0.7}
							/>
						</motion.div>
					</div>
				</div>
			</motion.div>

			{/* Demo Video Section */}
			<motion.div
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6 }}
				className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<DemoVideoSection />
			</motion.div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* Filters sidebar */}
					<motion.div
						className="lg:col-span-1"
						initial={{ opacity: 0, x: -50 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}>
						<DealFilters
							filters={filters}
							onFiltersChange={setFilters}
							onClearFilters={clearFilters}
							isOpen={isFiltersOpen}
							onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
						/>
					</motion.div>

					{/* Main content */}
					<div className="lg:col-span-3">
						{/* Search and header */}
						<motion.div
							className="mb-6"
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5 }}>
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
								<div>
									<h2 className="text-2xl font-bold text-foreground">
										Available Deals
									</h2>
									<p className="text-muted-foreground">
										{isLoading
											? "Loading..."
											: `${filteredDeals.length} deals found`}
									</p>
								</div>
								{!isAuthenticated && (
									<HoverScale>
										<Button
											size="lg"
											className="sm:w-auto"
											onClick={() => navigate("/login")}>
											Join SplitClub
										</Button>
									</HoverScale>
								)}
							</div>

							{/* Search bar */}
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
								<Input
									type="text"
									placeholder="Search deals by title, description, or tags..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-10"
								/>
							</div>

							{/* Active filters */}
							{(searchQuery ||
								filters.category.length > 0 ||
								filters.isFree ||
								filters.availableOnly ||
								filters.expiringWithin !== "any") && (
								<StaggeredList className="flex flex-wrap gap-2 mt-4">
									{searchQuery && (
										<StaggeredItem>
											<Badge variant="secondary" className="px-3 py-1">
												Search: "{searchQuery}"
											</Badge>
										</StaggeredItem>
									)}
									{filters.category.map((category) => (
										<StaggeredItem key={category}>
											<Badge variant="secondary" className="px-3 py-1">
												{category}
											</Badge>
										</StaggeredItem>
									))}
									{filters.isFree && (
										<StaggeredItem>
											<Badge variant="secondary" className="px-3 py-1">
												Free only
											</Badge>
										</StaggeredItem>
									)}
									{filters.availableOnly && (
										<StaggeredItem>
											<Badge variant="secondary" className="px-3 py-1">
												Available only
											</Badge>
										</StaggeredItem>
									)}
									{filters.expiringWithin !== "any" && (
										<StaggeredItem>
											<Badge variant="secondary" className="px-3 py-1">
												Expires in {filters.expiringWithin} days
											</Badge>
										</StaggeredItem>
									)}
									<HoverScale>
										<Button
											variant="ghost"
											size="sm"
											onClick={clearFilters}
											className="h-auto p-1 text-muted-foreground hover:text-foreground">
											Clear all
										</Button>
									</HoverScale>
								</StaggeredList>
							)}
						</motion.div>

						{/* Loading state */}
						{isLoading && (
							<motion.div
								className="flex items-center justify-center py-12"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}>
								<LoadingSpinner size="lg" text="Loading deals..." />
							</motion.div>
						)}

						{/* Deals grid */}
						{!isLoading && filteredDeals.length > 0 ? (
							<motion.div
								className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
								initial={{ opacity: 0 }}
								whileInView={{ opacity: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5 }}>
								{filteredDeals.map((deal, index) => {
									const isOwnDeal = user && deal.sharedBy.id === user.id;
									const hasClaimedThisDeal = hasClaimedDeal(deal.id);

									return (
										<motion.div
											key={deal.id}
											className="relative"
											initial={{ opacity: 0, y: 30 }}
											whileInView={{ opacity: 1, y: 0 }}
											viewport={{ once: true }}
											transition={{ delay: index * 0.1, duration: 0.5 }}>
											<DealCard
												deal={deal}
												onClaim={handleDealClaim}
												onView={handleDealView}
												isClaimLoading={claimingDealId === deal.id}
											/>
											{isAuthenticated && (
												<motion.div
													className="absolute top-2 right-2"
													initial={{ opacity: 0, scale: 0.8 }}
													animate={{ opacity: 1, scale: 1 }}
													transition={{ delay: 0.3 + index * 0.05 }}>
													<HoverScale>
														<Button
															variant="ghost"
															size="icon"
															className="bg-white/80 hover:bg-white"
															onClick={() => handleFavoriteToggle(deal.id)}>
															<Heart
																className={`h-4 w-4 ${
																	isFavorite(deal.id)
																		? "fill-red-500 text-red-500"
																		: "text-gray-400"
																}`}
															/>
														</Button>
													</HoverScale>
												</motion.div>
											)}
										</motion.div>
									);
								})}
							</motion.div>
						) : (
							!isLoading && (
								<motion.div
									className="text-center py-12"
									initial={{ opacity: 0, scale: 0.9 }}
									whileInView={{ opacity: 1, scale: 1 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5 }}>
									<div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
										<Search className="h-8 w-8 text-muted-foreground" />
									</div>
									<h3 className="text-lg font-semibold mb-2">No deals found</h3>
									<p className="text-muted-foreground mb-4">
										Try adjusting your search or filters to find more deals.
									</p>
									<HoverScale>
										<Button variant="outline" onClick={clearFilters}>
											Clear Filters
										</Button>
									</HoverScale>
								</motion.div>
							)
						)}
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default Index;
