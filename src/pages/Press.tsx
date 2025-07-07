import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Users, Calendar, Award } from "lucide-react";

export const Press = () => {
	return (
		<motion.div
			className="min-h-screen bg-background"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}>
			<div className="max-w-4xl mx-auto px-4 py-8">
				<motion.div
					className="text-center mb-8"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}>
					<h1 className="text-3xl font-bold mb-4">Press Relations</h1>
					<p className="text-muted-foreground">
						Media resources and company information for journalists and press
					</p>
				</motion.div>

				<motion.div
					className="grid md:grid-cols-2 gap-6 mb-8"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.6 }}>
					<motion.div
						whileHover={{ scale: 1.02 }}
						transition={{ duration: 0.2 }}>
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									<Download className="w-5 h-5" />
									<span>Press Kit</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground mb-4">
									Download our complete press kit including logos, screenshots,
									and company information
								</p>
								<Button>Download Press Kit</Button>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div
						whileHover={{ scale: 1.02 }}
						transition={{ duration: 0.2 }}>
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									<Users className="w-5 h-5" />
									<span>Media Contact</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground mb-4">
									Get in touch with our media relations team for interviews and
									inquiries
								</p>
								<p className="font-semibold">press@splitclub.com</p>
							</CardContent>
						</Card>
					</motion.div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4, duration: 0.6 }}>
					<Card className="mb-8">
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Calendar className="w-5 h-5" />
								<span>Recent News</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{[
									{
										title: "SplitClub Reaches 10,000 Active Users",
										date: "December 2024",
										content:
											"Our community marketplace continues to grow as more users discover the benefits of sharing unused subscriptions.",
									},
									{
										title: "Series A Funding Round Completed",
										date: "November 2024",
										content:
											"SplitClub raises £5M to expand platform features and community reach.",
									},
								].map((news, index) => (
									<motion.div
										key={index}
										className="border-l-4 border-primary pl-4"
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}>
										<h3 className="font-semibold">{news.title}</h3>
										<p className="text-sm text-muted-foreground">{news.date}</p>
										<p className="text-muted-foreground mt-2">{news.content}</p>
									</motion.div>
								))}
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6, duration: 0.6 }}>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Award className="w-5 h-5" />
								<span>Company Facts</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
								{[
									{ value: "2000+", label: "Active Users" },
									{ value: "£150,000", label: "Money Saved" },
									{ value: "2500+", label: "Deals Shared" },
									{ value: "95%", label: "User Satisfaction" },
								].map((stat, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}>
										<div className="text-2xl font-bold text-primary">
											{stat.value}
										</div>
										<div className="text-sm text-muted-foreground">
											{stat.label}
										</div>
									</motion.div>
								))}
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</motion.div>
	);
};
