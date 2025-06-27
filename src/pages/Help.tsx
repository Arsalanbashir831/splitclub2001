import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, BookOpen, Video, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

export const Help = () => {
	const navigate = useNavigate();

	return (
		<motion.div
			className="min-h-screen bg-background"
			initial="hidden"
			animate="visible"
			variants={staggerContainer}>
			<div className="max-w-4xl mx-auto px-4 py-8">
				<motion.div
					className="text-center mb-8"
					variants={fadeInUp}
					transition={{ duration: 0.6 }}>
					<h1 className="text-3xl font-bold mb-4">Online Help</h1>
					<p className="text-muted-foreground">
						Find answers to your questions and get the support you need
					</p>
				</motion.div>

				<motion.div
					className="grid md:grid-cols-2 gap-6"
					variants={staggerContainer}>
					<motion.div variants={scaleIn} whileHover={{ scale: 1.02 }}>
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									<BookOpen className="w-5 h-5" />
									<span>FAQ</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground mb-4">
									Browse our frequently asked questions to find quick answers
								</p>
								<motion.div
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}>
									<Button variant="outline" onClick={() => navigate("/faq")}>
										View FAQ
									</Button>
								</motion.div>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div variants={scaleIn} whileHover={{ scale: 1.02 }}>
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									<Video className="w-5 h-5" />
									<span>Video Tutorials</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground mb-4">
									Watch step-by-step guides on how to use SplitClub
								</p>
								<motion.div
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}>
									<Button variant="outline">Watch Videos</Button>
								</motion.div>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div variants={scaleIn} whileHover={{ scale: 1.02 }}>
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									<MessageCircle className="w-5 h-5" />
									<span>Live Chat</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground mb-4">
									Chat with our support team for immediate assistance
								</p>
								<motion.div
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}>
									<Button>Start Chat</Button>
								</motion.div>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div variants={scaleIn} whileHover={{ scale: 1.02 }}>
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									<Mail className="w-5 h-5" />
									<span>Email Support</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground mb-4">
									Send us an email and we'll get back to you within 24 hours
								</p>
								<motion.div
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}>
									<Button
										variant="outline"
										onClick={() => navigate("/contact")}>
										Send Email
									</Button>
								</motion.div>
							</CardContent>
						</Card>
					</motion.div>
				</motion.div>
			</div>
		</motion.div>
	);
};
