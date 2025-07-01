import { motion } from "framer-motion";
import {
	TrendingUp,
	Award,
	DollarSign,
	Globe,
	Heart,
	Shield,
	Target,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useEffect, useState } from "react";
import { CountUp } from "../ui/CountUp";

// --- Main HeroWidgets Component ---
export default function HeroMobileWidgets() {
	const [likeAnimations, setLikeAnimations] = useState<number[]>([]);
	const [activityFeed, setActivityFeed] = useState([
		{
			id: 1,
			user: "Sarah K.",
			action: "claimed Netflix deal",
			time: "2m ago",
			avatar: "bg-blue-500",
		},
		{
			id: 2,
			user: "Mark T.",
			action: "shared Spotify offer",
			time: "5m ago",
			avatar: "bg-green-500",
		},
		{
			id: 3,
			user: "Emma L.",
			action: "saved $500 on gym",
			time: "8m ago",
			avatar: "bg-purple-500",
		},
	]);
	useEffect(() => {
		// Animate likes periodically
		const likeInterval = setInterval(() => {
			const newLike = Date.now();
			setLikeAnimations((prev) => [...prev, newLike]);
			setTimeout(() => {
				setLikeAnimations((prev) => prev.filter((id) => id !== newLike));
			}, 2000);
		}, 3000);

		// Simulate real-time activity
		const activityInterval = setInterval(() => {
			const activities = [
				{
					user: "Alex R.",
					action: "joined premium club",
					avatar: "bg-red-500",
				},
				{
					user: "Lisa M.",
					action: "found rare deal",
					avatar: "bg-yellow-500",
				},
				{
					user: "David P.",
					action: "earned $200 cashback",
					avatar: "bg-indigo-500",
				},
				{
					user: "Maya S.",
					action: "unlocked VIP status",
					avatar: "bg-pink-500",
				},
			];
			const randomActivity =
				activities[Math.floor(Math.random() * activities.length)];
			setActivityFeed((prev) => [
				{
					id: Date.now(),
					...randomActivity,
					time: "now",
				},
				...prev.slice(0, 2),
			]);
		}, 4000);
		return () => {
			clearInterval(likeInterval);
			clearInterval(activityInterval);
		};
	}, []);

	return (
		<motion.div
			className="relative"
			initial={{
				opacity: 0,
				x: 50,
			}}
			animate={{
				opacity: 1,
				x: 0,
			}}
			transition={{
				delay: 0.3,
				duration: 0.8,
			}}>
			<div className="relative mx-auto w-80 h-[650px]">
				{/* Main Premium Phone */}
				<motion.div
					className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[3rem] p-3 shadow-2xl border border-slate-700"
					initial={{
						opacity: 0,
						scale: 0.8,
						rotateY: 30,
					}}
					animate={{
						opacity: 1,
						scale: 1,
						rotateY: 0,
					}}
					transition={{
						delay: 0.5,
						duration: 0.8,
					}}>
					{/* Phone Notch */}
					<div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-full border border-slate-600"></div>

					<div className="w-full h-full bg-gradient-to-br from-slate-50 to-white rounded-[2.5rem] overflow-hidden relative">
						{/* Premium Header */}
						<div className="h-28 bg-gradient-to-r from-black via-black to-black flex items-center justify-center relative overflow-hidden">
							<motion.div
								className="absolute inset-0 bg-white/10"
								animate={{
									background: [
										"linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)",
										"linear-gradient(225deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)",
									],
								}}
								transition={{
									duration: 3,
									repeat: Infinity,
									ease: "easeInOut",
								}}
							/>
							<div className="text-white font-bold text-xl tracking-wide flex items-center gap-2">
								<Award className="w-6 h-6" />
								SplitClub
							</div>
						</div>

						{/* Live Activity Feed */}
						<div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-blue-50">
							<div className="flex items-center gap-2 mb-2">
								<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
								<span className="text-xs font-semibold text-slate-700">
									Live Activity
								</span>
								<TrendingUp className="w-3 h-3 text-green-600" />
							</div>
							<motion.div className="space-y-1" layout>
								{activityFeed.map((activity, index) => (
									<motion.div
										key={activity.id}
										initial={{
											opacity: 0,
											x: -20,
											scale: 0.95,
										}}
										animate={{
											opacity: 1,
											x: 0,
											scale: 1,
										}}
										exit={{
											opacity: 0,
											x: 20,
											scale: 0.95,
										}}
										className="flex items-center gap-2 text-xs"
										layout>
										<div
											className={`w-4 h-4 ${activity.avatar} rounded-full flex-shrink-0`}></div>
										<span className="text-slate-600 truncate">
											<span className="font-medium">
												{activity.user}
											</span>{" "}
											{activity.action}
										</span>
										<span className="text-slate-400 text-[10px]">
											{activity.time}
										</span>
									</motion.div>
								))}
							</motion.div>
						</div>

						{/* Premium Deal Cards */}
						<div className="p-4 space-y-3 flex-1">
							{[
								{
									title: "Goldman Sachs Access",
									value: "$50K",
									category: "Financial",
									icon: DollarSign,
									gradient: "from-yellow-400 to-orange-500",
								},
								{
									title: "Private Jet Shares",
									value: "€25K",
									category: "Travel",
									icon: Globe,
									gradient: "from-blue-500 to-cyan-400",
								},
								{
									title: "Exclusive Wine Club",
									value: "$15K",
									category: "Luxury",
									icon: Award,
									gradient: "from-purple-500 to-pink-500",
								},
							].map((deal, i) => (
								<motion.div
									key={deal.title}
									initial={{
										opacity: 0,
										y: 20,
									}}
									animate={{
										opacity: 1,
										y: 0,
									}}
									transition={{
										delay: 1 + i * 0.2,
										duration: 0.5,
									}}
									whileHover={{
										scale: 1.02,
										y: -2,
									}}
									className="relative">
									<Card className="p-4 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
										<CardContent className="p-0">
											<div className="flex items-center space-x-3">
												<div
													className={`w-14 h-14 bg-gradient-to-br ${deal.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
													<deal.icon className="w-7 h-7 text-white" />
												</div>
												<div className="flex-1">
													<div className="flex items-center justify-between mb-1">
														<h4 className="font-bold text-sm text-slate-800">
															{deal.title}
														</h4>
														<motion.button
															whileTap={{
																scale: 0.9,
															}}
															onClick={() => {
																const newLike = Date.now();
																setLikeAnimations((prev) => [
																	...prev,
																	newLike,
																]);
																setTimeout(() => {
																	setLikeAnimations((prev) =>
																		prev.filter((id) => id !== newLike)
																	);
																}, 2000);
															}}
															className="relative">
															<Heart className="w-4 h-4 text-red-500 hover:fill-current transition-all" />
															{likeAnimations.map((id) => (
																<motion.div
																	key={id}
																	initial={{
																		scale: 0,
																		y: 0,
																	}}
																	animate={{
																		scale: [0, 1.2, 0],
																		y: -30,
																	}}
																	transition={{
																		duration: 2,
																	}}
																	className="absolute inset-0 text-red-500">
																	<Heart className="w-4 h-4 fill-current" />
																</motion.div>
															))}
														</motion.button>
													</div>
													<div className="flex items-center justify-between">
														<span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
															{deal.category}
														</span>
														<span className="font-bold text-lg text-slate-800">
															{deal.value}
														</span>
													</div>
													<motion.div
														className="h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mt-2"
														initial={{
															width: 0,
														}}
														animate={{
															width: `${65 + i * 10}%`,
														}}
														transition={{
															delay: 1.5 + i * 0.2,
															duration: 1,
														}}
													/>
												</div>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							))}
						</div>

						{/* Premium Stats Bar */}
						<div className="px-4 py-3 bg-gradient-to-r from-slate-900 to-slate-800">
							<div className="grid grid-cols-3 gap-3 text-center">
								<div>
									<div className="text-xl font-bold text-white">
										<CountUp end={847} duration={2} suffix="M" />
									</div>
									<div className="text-xs text-slate-400">Volume</div>
								</div>
								<div>
									<div className="text-xl font-bold text-green-400">
										<CountUp end={99.7} duration={2} suffix="%" />
									</div>
									<div className="text-xs text-slate-400">Success</div>
								</div>
								<div>
									<div className="text-xl font-bold text-blue-400">
										<CountUp end={24} duration={2} suffix="/7" />
									</div>
									<div className="text-xs text-slate-400">Support</div>
								</div>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Floating Premium Elements */}
				<motion.div
					className="absolute -left-8 top-24 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-yellow-300/50 shadow-2xl"
					initial={{
						opacity: 0,
						scale: 0,
						rotate: -180,
					}}
					animate={{
						opacity: 1,
						scale: 1,
						rotate: 0,
					}}
					transition={{
						delay: 1.5,
						duration: 0.6,
					}}
					whileHover={{
						scale: 1.1,
						rotate: 10,
					}}>
					<Shield className="w-10 h-10 text-white" />
					<motion.div
						className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
						animate={{
							scale: [1, 1.1, 1],
						}}
						transition={{
							duration: 2,
							repeat: Infinity,
						}}>
						<span className="text-white text-xs">✓</span>
					</motion.div>
				</motion.div>

				<motion.div
					className="absolute -right-6 bottom-32 w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-purple-400/50 shadow-2xl"
					initial={{
						opacity: 0,
						scale: 0,
						rotate: 180,
					}}
					animate={{
						opacity: 1,
						scale: 1,
						rotate: 0,
					}}
					transition={{
						delay: 1.7,
						duration: 0.6,
					}}
					whileHover={{
						scale: 1.1,
						rotate: -10,
					}}>
					<Target className="w-8 h-8 text-white" />
					<motion.div
						className="absolute inset-0 bg-purple-400/30 rounded-2xl"
						animate={{
							scale: [1, 1.2, 1],
							opacity: [0.3, 0.1, 0.3],
						}}
						transition={{
							duration: 2,
							repeat: Infinity,
						}}
					/>
				</motion.div>

				{/* Floating Success Indicators */}
			</div>
		</motion.div>
	);
}
