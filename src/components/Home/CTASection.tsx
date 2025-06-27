import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTASection() {
	return (
		<motion.section
			className="py-20 bg-gradient-to-r from-primary/10 via-background to-accent/10"
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
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<motion.h2
					className="text-3xl md:text-4xl font-bold text-foreground mb-4"
					initial={{
						opacity: 0,
						y: 20,
					}}
					whileInView={{
						opacity: 1,
						y: 0,
					}}
					viewport={{
						once: true,
					}}
					transition={{
						delay: 0.2,
						duration: 0.6,
					}}>
					Ready to Start Saving?
				</motion.h2>
				<motion.p
					className="text-xl text-muted-foreground mb-8"
					initial={{
						opacity: 0,
						y: 20,
					}}
					whileInView={{
						opacity: 1,
						y: 0,
					}}
					viewport={{
						once: true,
					}}
					transition={{
						delay: 0.3,
						duration: 0.6,
					}}>
					Join thousands of users who are already saving money with SplitClub
				</motion.p>
				<motion.div
					className="flex flex-col sm:flex-row gap-4 justify-center"
					initial={{
						opacity: 0,
						y: 20,
					}}
					whileInView={{
						opacity: 1,
						y: 0,
					}}
					viewport={{
						once: true,
					}}
					transition={{
						delay: 0.4,
						duration: 0.6,
					}}>
					<Button size="lg" className="gap-2" asChild>
						<Link to="/login">
							Sign Up Free <ArrowRight className="w-4 h-4" />
						</Link>
					</Button>
					<Button variant="outline" size="lg" asChild>
						<Link to="/about">Learn More</Link>
					</Button>
				</motion.div>
			</div>
		</motion.section>
	);
}
