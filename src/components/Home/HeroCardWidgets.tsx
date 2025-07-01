import { motion } from "framer-motion";
import {
	Ticket,
	Users,
	Sparkles,
	BadgePercent,
	TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useEffect, useState } from "react";
import { CountUp } from "../ui/CountUp";
import { TiltCard } from "../ui/tilt-card";

// --- Reusable StatCard with Dark Mode and Post-Load Animation ---
const StatCard = ({ icon, label, value, colorClass, delay = 0 }) => (
	<TiltCard>
		<motion.div
			className="h-full bg-white/80 dark:bg-slate-800/30 backdrop-blur-sm p-4 rounded-lg shadow-lg flex items-center gap-4 border border-slate-200/50 dark:border-slate-700/50"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: delay }}>
			<motion.div
				className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}
				animate={{ scale: [1, 1.05, 1] }}
				transition={{
					duration: 2,
					repeat: Infinity,
					repeatType: "mirror",
					ease: "easeInOut",
					delay: delay + 0.5,
				}}>
				{icon}
			</motion.div>
			<div>
				<p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
				<p className="text-xl font-bold text-slate-800 dark:text-slate-100">
					<CountUp end={value} />+
				</p>
			</div>
		</motion.div>
	</TiltCard>
);

// --- Main HeroWidgets Component ---
export default function HeroCardWidgets() {
	const [activityFeed, setActivityFeed] = useState([
		{
			id: 1,
			user: "Jenna R.",
			action: "claimed a Netflix slot",
			avatar: "bg-red-500",
			time: "2m ago",
		},
		{
			id: 2,
			user: "Mike P.",
			action: "shared a Gym Pass",
			avatar: "bg-blue-500",
			time: "5m ago",
		},
		{
			id: 3,
			user: "Sara L.",
			action: "saved $15 on Spotify",
			avatar: "bg-green-500",
			time: "8m ago",
		},
	]);

	useEffect(() => {
		const interval = setInterval(() => {
			const activities = [
				{
					user: "Chris B.",
					action: "shared YouTube Premium",
					avatar: "bg-red-600",
				},
				{
					user: "Anna K.",
					action: "found a great deal",
					avatar: "bg-purple-500",
				},
				{
					user: "Tom F.",
					action: "unlocked a voucher",
					avatar: "bg-yellow-500",
				},
			];
			const randomActivity =
				activities[Math.floor(Math.random() * activities.length)];
			setActivityFeed((prev) => [
				{ id: Date.now(), ...randomActivity, time: "now" },
				...prev.slice(0, 2),
			]);
		}, 6000);
		return () => clearInterval(interval);
	}, []);

	return (
		<motion.div
			className="relative w-full max-w-lg mx-auto lg:ml-auto lg:mx-0"
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.8 }}>
			{/* Responsive vertical spacing */}
			<div className="space-y-4 sm:space-y-6">
				<TiltCard>
					<motion.div
						className="relative"
						animate={{ y: ["-2px", "2px"] }}
						transition={{
							duration: 2.5,
							repeat: Infinity,
							repeatType: "mirror",
							ease: "easeInOut",
						}}>
						<div className="absolute -top-3 -left-3 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg z-10">
							<motion.div
								animate={{ rotate: [0, 360] }}
								transition={{ duration: 15, repeat: Infinity, ease: "linear" }}>
								<Sparkles className="w-6 h-6 text-white" />
							</motion.div>
						</div>
						<Card className="shadow-2xl border-0 bg-gradient-to-br from-slate-900 via-blue-900 to-black text-white rounded-2xl overflow-hidden relative">
							<motion.div
								className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent"
								animate={{ x: "200%" }}
								transition={{
									duration: 5,
									repeat: Infinity,
									delay: 3,
									ease: "linear",
								}}
							/>
							{/* Responsive padding */}
							<CardContent className="p-5 sm:p-6">
								<div className="flex justify-between items-start">
									<div>
										<p className="font-semibold text-white/80 text-sm">
											Featured Deal
										</p>
										{/* Responsive typography */}
										<h3 className="text-xl sm:text-2xl font-bold mt-1">
											Annual Gym Membership
										</h3>
									</div>
									<BadgePercent className="w-6 h-6 text-green-400" />
								</div>
								<div className="mt-6 flex justify-between items-center">
									<div>
										{/* Responsive typography */}
										<p className="text-2xl sm:text-3xl font-bold tracking-tight">
											$35
											{/* <span className="text-lg font-normal text-white/70">
												/month
											</span> */}
										</p>
										<p className="text-sm line-through text-red-400">$60</p>
									</div>
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										className="bg-white text-black font-bold py-2 px-5 rounded-full hover:bg-slate-200 transition-colors">
										Claim
									</motion.button>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</TiltCard>

				{/* Responsive grid: 1 column on mobile, 2 on larger screens */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<StatCard
						icon={<Ticket className="w-6 h-6 text-white" />}
						label="Deals Shared"
						value={500}
						colorClass="bg-gradient-to-br from-purple-500 to-pink-500"
						delay={0.6}
					/>
					<StatCard
						icon={<Users className="w-6 h-6 text-white" />}
						label="Active Members"
						value={200}
						colorClass="bg-gradient-to-br from-emerald-500 to-green-600"
						delay={0.7}
					/>
				</div>

				<TiltCard>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.8 }}>
						<Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/30 backdrop-blur-sm rounded-2xl">
							<CardContent className="p-4">
								<div className="flex items-center gap-2 mb-3">
									<div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
									<h4 className="font-semibold text-slate-800 dark:text-slate-100">
										Community Activity
									</h4>
									<TrendingUp className="w-4 h-4 text-green-600" />
								</div>
								<motion.div className="space-y-2" layout>
									{activityFeed.map((activity) => (
										<motion.div
											key={activity.id}
											className="flex items-center gap-3 text-sm"
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											exit={{ opacity: 0, x: 10 }}
											layout>
											<div
												className={`w-5 h-5 ${activity.avatar} rounded-full flex-shrink-0`}></div>
											<p className="text-slate-600 dark:text-slate-300 truncate">
												<span className="font-medium text-slate-800 dark:text-slate-100">
													{activity.user}
												</span>{" "}
												{activity.action}
											</p>
											<span className="ml-auto text-slate-400 dark:text-slate-500 text-xs flex-shrink-0">
												{activity.time}
											</span>
										</motion.div>
									))}
								</motion.div>
							</CardContent>
						</Card>
					</motion.div>
				</TiltCard>
			</div>
		</motion.div>
	);
}
