import { motion } from "framer-motion";
import { CountUp } from "@/components/ui/CountUp";

export default function StatsSection() {
	return (
		<motion.section
			className="py-16 bg-muted/30"
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
			}}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
					<motion.div
						initial={{
							opacity: 0,
							scale: 0.5,
						}}
						whileInView={{
							opacity: 1,
							scale: 1,
						}}
						viewport={{
							once: true,
						}}
						transition={{
							delay: 0.1,
							duration: 0.5,
						}}>
						<div className="text-3xl md:text-4xl font-bold text-primary mb-2">
							<CountUp end={10000} duration={2} suffix="+" />
						</div>
						<div className="text-muted-foreground">Active Users</div>
					</motion.div>
					<motion.div
						initial={{
							opacity: 0,
							scale: 0.5,
						}}
						whileInView={{
							opacity: 1,
							scale: 1,
						}}
						viewport={{
							once: true,
						}}
						transition={{
							delay: 0.2,
							duration: 0.5,
						}}>
						<div className="text-3xl md:text-4xl font-bold text-primary mb-2">
							<CountUp end={500000} duration={2} prefix="$" />
						</div>
						<div className="text-muted-foreground">Money Saved</div>
					</motion.div>
					<motion.div
						initial={{
							opacity: 0,
							scale: 0.5,
						}}
						whileInView={{
							opacity: 1,
							scale: 1,
						}}
						viewport={{
							once: true,
						}}
						transition={{
							delay: 0.3,
							duration: 0.5,
						}}>
						<div className="text-3xl md:text-4xl font-bold text-primary mb-2">
							<CountUp end={2500} duration={2} suffix="+" />
						</div>
						<div className="text-muted-foreground">Deals Shared</div>
					</motion.div>
					<motion.div
						initial={{
							opacity: 0,
							scale: 0.5,
						}}
						whileInView={{
							opacity: 1,
							scale: 1,
						}}
						viewport={{
							once: true,
						}}
						transition={{
							delay: 0.4,
							duration: 0.5,
						}}>
						<div className="text-3xl md:text-4xl font-bold text-primary mb-2">
							<CountUp end={95} duration={2} suffix="%" />
						</div>
						<div className="text-muted-foreground">User Satisfaction</div>
					</motion.div>
				</div>
			</div>
		</motion.section>
	);
}
