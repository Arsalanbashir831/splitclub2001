import { motion } from "framer-motion";
import { DemoVideoSection } from "@/components/Home/DemoVideoSection";
import HeroSection from "@/components/Home/HeroSection";
import StatsSection from "@/components/Home/StatsSection";
import CTASection from "@/components/Home/CTASection";

export const Home = () => {
	return (
		<motion.div
			className="min-h-screen bg-background"
			initial={{
				opacity: 0,
			}}
			animate={{
				opacity: 1,
			}}
			transition={{
				duration: 0.5,
			}}>
			<HeroSection />
			<StatsSection />
			<DemoVideoSection />
			<CTASection />
		</motion.div>
	);
};
