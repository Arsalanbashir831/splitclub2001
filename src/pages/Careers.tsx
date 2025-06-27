import { motion } from "framer-motion";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Heart, Coffee, Zap } from "lucide-react";

export const Careers = () => {
	const openings = [
		{
			title: "Senior Frontend Developer",
			department: "Engineering",
			location: "Remote",
			type: "Full-time",
			description:
				"Join our frontend team to build beautiful, accessible user interfaces that help people save money and reduce waste.",
		},
		{
			title: "Community Manager",
			department: "Community",
			location: "New York, NY",
			type: "Full-time",
			description:
				"Help build and nurture our growing community of users who are passionate about sustainable consumption.",
		},
		{
			title: "UX/UI Designer",
			department: "Design",
			location: "Remote",
			type: "Full-time",
			description:
				"Design intuitive experiences that make sharing deals and subscriptions delightful and easy for our users.",
		},
		{
			title: "Data Analyst",
			department: "Analytics",
			location: "San Francisco, CA",
			type: "Full-time",
			description:
				"Help us understand user behavior and optimize our platform using data-driven insights and analytics.",
		},
	];

	const benefits = [
		{
			icon: Heart,
			title: "Health & Wellness",
			description:
				"Comprehensive health insurance, mental health support, and wellness stipends",
		},
		{
			icon: Coffee,
			title: "Remote-First",
			description:
				"Work from anywhere with flexible hours and home office setup allowance",
		},
		{
			icon: Users,
			title: "Team Culture",
			description:
				"Collaborative environment with regular team retreats and social events",
		},
		{
			icon: Zap,
			title: "Growth",
			description:
				"Learning budget, conference attendance, and clear career progression paths",
		},
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
						Join Our Team
					</motion.h1>
					<motion.p
						className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.6 }}>
						Help us build the future of sustainable consumption. Join a
						mission-driven team that's making a real impact on how people save
						money and reduce waste.
					</motion.p>
				</div>
			</motion.section>

			{/* Benefits Section */}
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
						<h2 className="text-3xl font-bold mb-4">Why Work With Us</h2>
						<p className="text-muted-foreground">
							We're committed to creating an environment where everyone can
							thrive
						</p>
					</motion.div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
						{benefits.map((benefit, index) => {
							const Icon = benefit.icon;
							return (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: index * 0.1, duration: 0.6 }}
									whileHover={{ scale: 1.02 }}>
									<Card className="h-full text-center">
										<CardHeader>
											<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
												<Icon className="w-8 h-8 text-primary" />
											</div>
											<CardTitle className="text-xl">{benefit.title}</CardTitle>
										</CardHeader>
										<CardContent>
											<CardDescription className="text-base">
												{benefit.description}
											</CardDescription>
										</CardContent>
									</Card>
								</motion.div>
							);
						})}
					</div>
				</div>
			</motion.section>

			{/* Open Positions */}
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
						<h2 className="text-3xl font-bold mb-4">Open Positions</h2>
						<p className="text-muted-foreground">
							Find your perfect role and help shape the future of SplitClub
						</p>
					</motion.div>

					<div className="space-y-6">
						{openings.map((job, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1, duration: 0.6 }}
								whileHover={{ scale: 1.01 }}>
								<Card>
									<CardHeader>
										<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
											<div>
												<CardTitle className="text-xl mb-2">
													{job.title}
												</CardTitle>
												<div className="flex flex-wrap gap-2">
													<Badge variant="secondary">{job.department}</Badge>
													<Badge
														variant="outline"
														className="flex items-center gap-1">
														<MapPin className="w-3 h-3" />
														{job.location}
													</Badge>
													<Badge
														variant="outline"
														className="flex items-center gap-1">
														<Clock className="w-3 h-3" />
														{job.type}
													</Badge>
												</div>
											</div>
											<Button>Apply Now</Button>
										</div>
									</CardHeader>
									<CardContent>
										<CardDescription className="text-base">
											{job.description}
										</CardDescription>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>

					<motion.div
						className="text-center mt-12"
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.5, duration: 0.6 }}>
						<Card className="bg-primary/5 border-primary/20">
							<CardContent className="p-8">
								<h3 className="text-xl font-semibold mb-4">
									Don't see the right role?
								</h3>
								<p className="text-muted-foreground mb-6">
									We're always looking for talented people to join our team.
									Send us your resume and let us know how you'd like to
									contribute.
								</p>
								<Button variant="outline">Send Us Your Resume</Button>
							</CardContent>
						</Card>
					</motion.div>
				</div>
			</motion.section>
		</motion.div>
	);
};
