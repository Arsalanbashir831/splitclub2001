import { motion } from "framer-motion";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Building2,
	Users,
	TrendingUp,
	Shield,
	CheckCircle,
	ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export const Business = () => {
	const features = [
		{
			icon: Building2,
			title: "Enterprise Dashboard",
			description:
				"Comprehensive analytics and management tools for your organization's deals and subscriptions.",
		},
		{
			icon: Users,
			title: "Team Management",
			description:
				"Easily manage team members, permissions, and access levels across your organization.",
		},
		{
			icon: TrendingUp,
			title: "Cost Optimization",
			description:
				"Advanced insights and recommendations to optimize your subscription spending and reduce waste.",
		},
		{
			icon: Shield,
			title: "Enterprise Security",
			description:
				"Bank-grade security with SSO, compliance certifications, and dedicated support.",
		},
	];

	const benefits = [
		"Reduce subscription costs by up to 60%",
		"Centralized management of all deals",
		"Real-time analytics and reporting",
		"Priority customer support",
		"Custom integrations available",
		"Compliance with enterprise standards",
	];

	return (
		<motion.div
			className="min-h-screen bg-background"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}>
			{/* Hero Section */}
			<motion.section
				className="py-20 bg-gradient-to-r from-primary/10 to-accent/10"
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}>
				<div className="max-w-4xl mx-auto px-4 text-center">
					<motion.h1
						className="text-4xl md:text-5xl font-bold mb-6"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.6 }}>
						SplitClub for Business
					</motion.h1>
					<motion.p
						className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.6 }}>
						Transform how your organization manages subscriptions and deals.
						Save money, reduce waste, and optimize your spending with our
						enterprise platform.
					</motion.p>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4, duration: 0.6 }}>
						<Button size="lg" className="gap-2" asChild>
							<Link to="/contact">
								Get Started <ArrowRight className="w-4 h-4" />
							</Link>
						</Button>
					</motion.div>
				</div>
			</motion.section>

			{/* Features Section */}
			<motion.section
				className="py-16"
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6 }}>
				<div className="max-w-6xl mx-auto px-4">
					<motion.div
						className="text-center mb-12"
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}>
						<h2 className="text-3xl font-bold mb-4">Enterprise Features</h2>
						<p className="text-muted-foreground">
							Everything you need to manage deals and subscriptions at scale
						</p>
					</motion.div>

					<div className="grid md:grid-cols-2 gap-6">
						{features.map((feature, index) => {
							const Icon = feature.icon;
							return (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: index * 0.1, duration: 0.6 }}
									whileHover={{ scale: 1.02 }}>
									<Card className="h-full">
										<CardHeader>
											<div className="flex items-center space-x-3">
												<div className="p-2 bg-primary/10 rounded-lg">
													<Icon className="w-6 h-6 text-primary" />
												</div>
												<CardTitle>{feature.title}</CardTitle>
											</div>
										</CardHeader>
										<CardContent>
											<CardDescription className="text-base">
												{feature.description}
											</CardDescription>
										</CardContent>
									</Card>
								</motion.div>
							);
						})}
					</div>
				</div>
			</motion.section>

			{/* Benefits Section */}
			<motion.section
				className="py-16 bg-card/30"
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6 }}>
				<div className="max-w-4xl mx-auto px-4">
					<motion.div
						className="text-center mb-12"
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}>
						<h2 className="text-3xl font-bold mb-4">
							Why Choose SplitClub Business
						</h2>
						<p className="text-muted-foreground">
							Join hundreds of companies already saving with our platform
						</p>
					</motion.div>

					<div className="grid md:grid-cols-2 gap-4">
						{benefits.map((benefit, index) => (
							<motion.div
								key={index}
								className="flex items-center space-x-3 p-4 bg-background rounded-lg"
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1, duration: 0.5 }}>
								<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
								<span>{benefit}</span>
							</motion.div>
						))}
					</div>
				</div>
			</motion.section>
		</motion.div>
	);
};
