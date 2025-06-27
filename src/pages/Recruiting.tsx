import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { useScrollToTop } from "@/hooks/useScrollToTop";

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

export const Recruiting = () => {
	useScrollToTop();

	const jobOpenings = [
		{
			title: "Senior Frontend Developer",
			location: "San Francisco, CA / Remote",
			type: "Full-time",
			department: "Engineering",
			description:
				"Join our engineering team to build beautiful and performant user interfaces for our community marketplace.",
		},
		{
			title: "Product Manager",
			location: "San Francisco, CA",
			type: "Full-time",
			department: "Product",
			description:
				"Drive product strategy and execution to enhance user experience and grow our community.",
		},
		{
			title: "Community Manager",
			location: "Remote",
			type: "Full-time",
			department: "Community",
			description:
				"Build and nurture our community, creating engaging experiences for our users.",
		},
		{
			title: "Marketing Intern",
			location: "San Francisco, CA",
			type: "Internship",
			department: "Marketing",
			description:
				"Support our marketing initiatives and help spread the word about SplitClub.",
		},
	];

	const benefits = [
		"Competitive salary and equity",
		"Comprehensive health insurance",
		"Flexible working arrangements",
		"Professional development budget",
		"401(k) matching",
		"Unlimited PTO",
		"Team retreats and events",
		"Latest equipment and tools",
	];

	return (
		<motion.div
			className="min-h-screen bg-background"
			initial="hidden"
			animate="visible"
			variants={staggerContainer}>
			<div className="max-w-4xl mx-auto px-4 py-8">
				<motion.div
					className="text-center mb-12"
					variants={fadeInUp}
					transition={{ duration: 0.6 }}>
					<h1 className="text-3xl font-bold mb-4">Join Our Team</h1>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						Help us build the future of community-driven sharing and make
						premium services accessible to everyone
					</p>
				</motion.div>

				{/* Why Work With Us */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle>Why SplitClub?</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground leading-relaxed mb-4">
							At SplitClub, you'll be part of a mission-driven team that's
							creating real impact. We're building something that matters - a
							platform that reduces waste, saves money, and brings communities
							together. Join us if you're passionate about sustainability,
							technology, and creating positive change.
						</p>
						<div className="grid md:grid-cols-2 gap-4">
							{benefits.map((benefit) => (
								<div key={benefit} className="flex items-center space-x-2">
									<div className="w-2 h-2 bg-primary rounded-full"></div>
									<span className="text-sm">{benefit}</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Open Positions */}
				<div className="mb-8">
					<h2 className="text-2xl font-bold mb-6">Open Positions</h2>
					<div className="space-y-4">
						{jobOpenings.map((job) => (
							<Card key={job.title}>
								<CardContent className="pt-6">
									<div className="flex justify-between items-start mb-4">
										<div>
											<h3 className="font-semibold text-lg mb-2">
												{job.title}
											</h3>
											<div className="flex flex-wrap gap-2 mb-3">
												<Badge
													variant="secondary"
													className="flex items-center space-x-1">
													<MapPin className="w-3 h-3" />
													<span>{job.location}</span>
												</Badge>
												<Badge
													variant="outline"
													className="flex items-center space-x-1">
													<Clock className="w-3 h-3" />
													<span>{job.type}</span>
												</Badge>
												<Badge
													variant="outline"
													className="flex items-center space-x-1">
													<Briefcase className="w-3 h-3" />
													<span>{job.department}</span>
												</Badge>
											</div>
											<p className="text-muted-foreground">{job.description}</p>
										</div>
										<Button>Apply Now</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>

				{/* Culture & Values */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="flex items-center space-x-2">
							<Users className="w-5 h-5" />
							<span>Our Culture</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-semibold mb-2">🚀 Fast-Paced Growth</h4>
								<p className="text-sm text-muted-foreground">
									We're scaling rapidly and every team member has the
									opportunity to make a significant impact.
								</p>
							</div>
							<div>
								<h4 className="font-semibold mb-2">🧠 Learning-Focused</h4>
								<p className="text-sm text-muted-foreground">
									We invest in our team's growth with learning budgets,
									conferences, and mentorship programs.
								</p>
							</div>
							<div>
								<h4 className="font-semibold mb-2">🌍 Remote-Friendly</h4>
								<p className="text-sm text-muted-foreground">
									We support flexible work arrangements and have team members
									across different time zones.
								</p>
							</div>
							<div>
								<h4 className="font-semibold mb-2">🎯 Results-Oriented</h4>
								<p className="text-sm text-muted-foreground">
									We focus on outcomes over hours, giving you the autonomy to do
									your best work.
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Application Process */}
				<Card>
					<CardHeader>
						<CardTitle>Application Process</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex items-center space-x-4">
								<div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
									1
								</div>
								<div>
									<h4 className="font-semibold">Apply Online</h4>
									<p className="text-sm text-muted-foreground">
										Submit your application through our careers page
									</p>
								</div>
							</div>
							<div className="flex items-center space-x-4">
								<div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
									2
								</div>
								<div>
									<h4 className="font-semibold">Initial Screening</h4>
									<p className="text-sm text-muted-foreground">
										Brief call with our talent team to learn about you and the
										role
									</p>
								</div>
							</div>
							<div className="flex items-center space-x-4">
								<div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
									3
								</div>
								<div>
									<h4 className="font-semibold">Technical/Skills Assessment</h4>
									<p className="text-sm text-muted-foreground">
										Role-specific evaluation to assess your skills and fit
									</p>
								</div>
							</div>
							<div className="flex items-center space-x-4">
								<div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
									4
								</div>
								<div>
									<h4 className="font-semibold">Final Interview</h4>
									<p className="text-sm text-muted-foreground">
										Meet with team members and leadership to discuss the
										opportunity
									</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<div className="text-center mt-8">
					<p className="text-muted-foreground mb-4">
						Don't see a role that fits? We're always looking for talented
						people.
					</p>
					<Button variant="outline">Send Us Your Resume</Button>
				</div>
			</div>
		</motion.div>
	);
};
