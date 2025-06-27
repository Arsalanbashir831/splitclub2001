import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { motion } from "framer-motion";

interface DemoVideoSectionProps {
	videoUrl?: string | null;
}

export const DemoVideoSection = ({ videoUrl }: DemoVideoSectionProps) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [isMuted, setIsMuted] = useState(true);
	const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

	const togglePlay = () => {
		if (videoRef) {
			if (isPlaying) {
				videoRef.pause();
			} else {
				videoRef.play();
			}
			setIsPlaying(!isPlaying);
		}
	};

	const toggleMute = () => {
		if (videoRef) {
			videoRef.muted = !isMuted;
			setIsMuted(!isMuted);
		}
	};

	const toggleFullscreen = () => {
		if (videoRef) {
			if (document.fullscreenElement) {
				document.exitFullscreen();
			} else {
				videoRef.requestFullscreen();
			}
		}
	};

	return (
		<motion.div
			initial={{
				opacity: 0,
				y: 50,
			}}
			whileInView={{
				opacity: 1,
				y: 0,
			}}
			viewport={{
				once: true,
			}}
			transition={{
				duration: 0.6,
			}}
			className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-4xl mx-auto py-12">
				<motion.div
					className="text-center mb-8"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}>
					<h2 className="text-3xl font-bold text-foreground mb-4">
						See SplitClub in Action
					</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Watch how easy it is to share deals, save money, and reduce waste in
						our community marketplace.
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.2, duration: 0.6 }}>
					<Card className="overflow-hidden">
						<CardContent className="p-0">
							<div className="relative group">
								{videoUrl ? (
									<video
										ref={setVideoRef}
										className="w-full h-auto aspect-video bg-black"
										muted={isMuted}
										loop
										preload="metadata"
										poster="/placeholder.svg"
										onPlay={() => setIsPlaying(true)}
										onPause={() => setIsPlaying(false)}>
										<source src={videoUrl} type="video/mp4" />
										Your browser does not support the video tag.
									</video>
								) : (
									<div className="w-full h-64 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
										<div className="text-center space-y-4">
											<motion.div
												className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto"
												whileHover={{ scale: 1.1 }}
												transition={{ duration: 0.2 }}>
												<Play className="w-8 h-8 text-primary" />
											</motion.div>
											<p className="text-muted-foreground">
												Demo video coming soon
											</p>
										</div>
									</div>
								)}

								{videoUrl && (
									<>
										{/* Video Controls Overlay */}
										<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200">
											<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
												<Button
													size="lg"
													variant="secondary"
													className="rounded-full w-16 h-16 bg-white/90 hover:bg-white text-black"
													onClick={togglePlay}>
													{isPlaying ? (
														<Pause className="w-6 h-6" />
													) : (
														<Play className="w-6 h-6 ml-1" />
													)}
												</Button>
											</div>

											<div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
												<div className="flex items-center space-x-2">
													<Button
														size="sm"
														variant="secondary"
														className="bg-black/50 hover:bg-black/70 text-white border-none"
														onClick={togglePlay}>
														{isPlaying ? (
															<Pause className="w-4 h-4" />
														) : (
															<Play className="w-4 h-4" />
														)}
													</Button>
													<Button
														size="sm"
														variant="secondary"
														className="bg-black/50 hover:bg-black/70 text-white border-none"
														onClick={toggleMute}>
														{isMuted ? (
															<VolumeX className="w-4 h-4" />
														) : (
															<Volume2 className="w-4 h-4" />
														)}
													</Button>
												</div>
												<Button
													size="sm"
													variant="secondary"
													className="bg-black/50 hover:bg-black/70 text-white border-none"
													onClick={toggleFullscreen}>
													<Maximize className="w-4 h-4" />
												</Button>
											</div>
										</div>
									</>
								)}
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					className="mt-8 text-center"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.4, duration: 0.6 }}>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
						{[
							{
								step: "1",
								title: "Share Your Deals",
								description:
									"Upload unused subscriptions, vouchers, and memberships",
							},
							{
								step: "2",
								title: "Browse & Claim",
								description:
									"Find great deals from the community and claim your favorites",
							},
							{
								step: "3",
								title: "Save & Sustain",
								description:
									"Reduce waste while saving money for everyone in the community",
							},
						].map((item, index) => (
							<motion.div
								key={index}
								className="space-y-2"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}>
								<motion.div
									className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
									whileHover={{
										scale: 1.1,
										backgroundColor: "hsl(var(--primary))",
									}}
									transition={{ duration: 0.2 }}>
									<motion.span
										className="text-primary font-bold"
										whileHover={{ color: "hsl(var(--primary-foreground))" }}>
										{item.step}
									</motion.span>
								</motion.div>
								<h3 className="font-semibold">{item.title}</h3>
								<p className="text-sm text-muted-foreground">
									{item.description}
								</p>
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>
		</motion.div>
	);
};
