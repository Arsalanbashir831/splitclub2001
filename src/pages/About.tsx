import { motion } from "framer-motion";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Heart, Users, Lightbulb, Target, Globe } from "lucide-react";

// Animation variants
const fadeInUp = {
	hidden: { opacity: 0, y: 30 },
	visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const scaleIn = {
	hidden: { opacity: 0, scale: 0.95 },
	visible: { opacity: 1, scale: 1 },
};

export const About = () => {
	return (
		<motion.div
			className="min-h-screen bg-background"
			initial="hidden"
			animate="visible"
			variants={staggerContainer}>
			<div className="max-w-4xl mx-auto px-4 py-8">
				{/* Hero Section */}
				<motion.div
					className="text-center mb-12"
					variants={fadeInUp}
					transition={{ duration: 0.6 }}>
					<motion.div
						className="flex items-center justify-center space-x-3 mb-4"
						variants={scaleIn}
						transition={{ delay: 0.2 }}>
						<div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
							<Leaf className="w-6 h-6 text-primary-foreground" />
						</div>
						<h1 className="text-4xl font-bold">About SplitClub</h1>
					</motion.div>
					<motion.p
						className="text-xl text-muted-foreground max-w-2xl mx-auto"
						variants={fadeInUp}
						transition={{ delay: 0.3 }}>
						A community marketplace where unused subscriptions, memberships, and
						rewards find new purpose
					</motion.p>
					<motion.div variants={scaleIn} transition={{ delay: 0.4 }}>
						<Badge variant="secondary" className="mt-4">
							Share. Save. Sustain.
						</Badge>
					</motion.div>
				</motion.div>

				{/* Mission Section */}
				<motion.div variants={fadeInUp} transition={{ delay: 0.5 }}>
					<Card className="mb-8">
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Target className="w-5 h-5 text-primary" />
								<span>Our Mission</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground leading-relaxed">
								SplitClub was born from a simple observation: too many valuable
								digital benefits go unused while others struggle to afford them.
								We created a platform where community members can share their
								unused subscription slots, membership benefits, and rewards,
								creating a circular economy that reduces waste and makes premium
								services more accessible to everyone.
							</p>
						</CardContent>
					</Card>
				</motion.div>

				{/* How It Works */}
				<motion.div
					className="mb-8"
					variants={fadeInUp}
					transition={{ delay: 0.6 }}>
					<h2 className="text-2xl font-bold mb-6 text-center">
						How SplitClub Works
					</h2>
					<motion.div
						className="grid md:grid-cols-3 gap-6"
						variants={staggerContainer}>
						<motion.div variants={scaleIn} whileHover={{ scale: 1.02 }}>
							<Card>
								<CardHeader>
									<div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
										<Heart className="w-6 h-6 text-green-600 dark:text-green-400" />
									</div>
									<CardTitle className="text-lg">Share Benefits</CardTitle>
									<CardDescription>
										Post your unused subscription slots, membership perks, or
										rewards that would otherwise go to waste
									</CardDescription>
								</CardHeader>
							</Card>
						</motion.div>

						<motion.div variants={scaleIn} whileHover={{ scale: 1.02 }}>
							<Card>
								<CardHeader>
									<div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
										<Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
									</div>
									<CardTitle className="text-lg">Find Deals</CardTitle>
									<CardDescription>
										Browse amazing deals shared by community members and claim
										the ones that interest you
									</CardDescription>
								</CardHeader>
							</Card>
						</motion.div>

						<motion.div variants={scaleIn} whileHover={{ scale: 1.02 }}>
							<Card>
								<CardHeader>
									<div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
										<Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
									</div>
									<CardTitle className="text-lg">Build Community</CardTitle>
									<CardDescription>
										Connect with like-minded individuals who care about
										sustainability and smart spending
									</CardDescription>
								</CardHeader>
							</Card>
						</motion.div>
					</motion.div>
				</motion.div>

				{/* Values Section */}
				<motion.div variants={fadeInUp} transition={{ delay: 0.7 }}>
					<Card className="mb-8">
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Lightbulb className="w-5 h-5 text-primary" />
								<span>Our Values</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<motion.div
								className="grid md:grid-cols-2 gap-6"
								variants={staggerContainer}>
								<motion.div variants={fadeInUp}>
									<h4 className="font-semibold mb-2">🌱 Sustainability</h4>
									<p className="text-sm text-muted-foreground">
										We believe in reducing digital waste by ensuring valuable
										resources don't go unused.
									</p>
								</motion.div>
								<motion.div variants={fadeInUp}>
									<h4 className="font-semibold mb-2">🤝 Community</h4>
									<p className="text-sm text-muted-foreground">
										Building connections between people who want to help each
										other save money and resources.
									</p>
								</motion.div>
								<motion.div variants={fadeInUp}>
									<h4 className="font-semibold mb-2">💡 Innovation</h4>
									<p className="text-sm text-muted-foreground">
										Creating new ways to share and access digital services in a
										fair and transparent manner.
									</p>
								</motion.div>
								<motion.div variants={fadeInUp}>
									<h4 className="font-semibold mb-2">🔒 Trust</h4>
									<p className="text-sm text-muted-foreground">
										Maintaining a safe, secure platform where community members
										can share with confidence.
									</p>
								</motion.div>
							</motion.div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Community Impact */}
				<motion.div variants={fadeInUp} transition={{ delay: 0.8 }}>
					<Card>
						<CardHeader>
							<CardTitle>Community Impact</CardTitle>
							<CardDescription>
								Together, we're making a difference
							</CardDescription>
						</CardHeader>
						<CardContent>
							<motion.div
								className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center"
								variants={staggerContainer}>
								<motion.div variants={scaleIn} whileHover={{ scale: 1.05 }}>
									<div className="text-2xl font-bold text-primary">500+</div>
									<div className="text-sm text-muted-foreground">
										Deals Shared
									</div>
								</motion.div>
								<motion.div variants={scaleIn} whileHover={{ scale: 1.05 }}>
									<div className="text-2xl font-bold text-primary">$10k+</div>
									<div className="text-sm text-muted-foreground">
										Community Savings
									</div>
								</motion.div>
								<motion.div variants={scaleIn} whileHover={{ scale: 1.05 }}>
									<div className="text-2xl font-bold text-primary">200+</div>
									<div className="text-sm text-muted-foreground">
										Active Members
									</div>
								</motion.div>
								<motion.div variants={scaleIn} whileHover={{ scale: 1.05 }}>
									<div className="text-2xl font-bold text-primary">98%</div>
									<div className="text-sm text-muted-foreground">
										Satisfaction Rate
									</div>
								</motion.div>
							</motion.div>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</motion.div>
	);
};
