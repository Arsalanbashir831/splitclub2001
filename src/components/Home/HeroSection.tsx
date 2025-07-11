import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { ArrowRight} from "lucide-react";
import HeroMobileWidget from "./HeroMobileWidget";

export default function HeroSection() {
	// const { toast } = useToast();
	// const [showVideoPlayer, setShowVideoPlayer] = useState(false);
	// const { data: demoVideo, isLoading: isLoadingVideo, error: videoError } = useDemoVideo();

	// const handleWatchDemo = () => {
	// 	if (demoVideo?.url) {
	// 		setShowVideoPlayer(true);
	// 	} else {
	// 		toast({
	// 			title: "Demo Coming Soon",
	// 			description: videoError ? "Unable to load demo video. Please try again later." : "The demo video is not available yet.",
	// 			variant: videoError ? "destructive" : "default",
	// 		});
	// 	}
	// };

	return (
		<>
			<motion.section
				className="relative overflow-hidden"
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}>
				<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 dark:from-primary/10 dark:to-accent/10" />
				{/* Responsive vertical and horizontal padding */}
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 sm:pt-28 sm:pb-20">
					{/* Responsive grid and gap */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-y-16 lg:gap-x-12 lg:gap-y-0">
						{/* Left Content */}
						<motion.div
							className="space-y-6 md:space-y-8 text-center lg:text-left md:mt-16" // Center text on mobile, left-align on desktop
							initial={{ opacity: 0, x: -50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.2, duration: 0.6 }}>
							{/* Responsive content spacing */}
							<div className="space-y-4">
								{/* <motion.div
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 0.3, duration: 0.5 }}>
									<Badge
										variant="secondary"
										className="w-fit mx-auto lg:mx-0 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
										🏆 Trusted by Fortune 500 Companies
									</Badge>
								</motion.div> */}
								<motion.h1
									// Responsive typography
									className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.4, duration: 0.6 }}>
									Premium deals,
									<span className="text-primary"> Exclusive access</span>
								</motion.h1>
								<motion.p
									// Responsive typography
									className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.5, duration: 0.6 }}>
									The world's most sophisticated marketplace for high-value
									subscriptions, memberships, and exclusive rewards.
								</motion.p>
							</div>

							{/* CTA Buttons */}
							<motion.div
								// Responsive button layout (stack on mobile, row on desktop)
								className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.6, duration: 0.6 }}>
								<Button
									size="lg"
									className="gap-2 bg-gradient-to-r from-slate-900 via-blue-900 to-black hover:from-slate-800 hover:via-blue-800 hover:to-gray-900 text-white border-0 shadow-2xl shadow-blue-900/20 dark:bg-gradient-to-r dark:from-white dark:via-gray-100 dark:to-gray-50 dark:hover:from-gray-100 dark:hover:via-gray-200 dark:hover:to-gray-100 dark:text-black dark:shadow-white/10"
									asChild>
									<Link to="/login">
										Access Platform <ArrowRight className="w-4 h-4" />
									</Link>
								</Button>
								{/* <Button
									variant="outline"
									size="lg"
									className="gap-2 border-primary/30 hover:bg-primary/5 dark:border-primary/40 dark:hover:bg-primary/10"
									onClick={handleWatchDemo}
									disabled={isLoadingVideo}>
									{isLoadingVideo ? (
										<>Loading...</>
									) : demoVideo?.url ? (
										<>
											<Play className="w-4 h-4" />
											Watch Demo
										</>
									) : (
										<>
											<Play className="w-4 h-4" />
											Request Demo
										</>
									)}
								</Button> */}
							</motion.div>

						</motion.div>

						{/* Right Content - The already responsive HeroWidgets component */}
						<HeroMobileWidget />
					</div>
				</div>
			</motion.section>

			{/* {demoVideo?.url && (
				<VideoPlayer
					open={showVideoPlayer}
					onOpenChange={setShowVideoPlayer}
					videoUrl={demoVideo.url}
					title="SplitClub Demo"
				/>
			)} */}
		</>
	);
}
