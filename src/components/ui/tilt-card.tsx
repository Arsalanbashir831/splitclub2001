import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef } from "react";

export const TiltCard = ({ children }) => {
	const ref = useRef(null);
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);

	const handleMouseMove = (e) => {
		if (!ref.current) return;
		const { left, top, width, height } = ref.current.getBoundingClientRect();
		mouseX.set(e.clientX - left - width / 2);
		mouseY.set(e.clientY - top - height / 2);
	};

	const handleMouseLeave = () => {
		mouseX.set(0);
		mouseY.set(0);
	};

	const rotateX = useTransform(mouseY, [-150, 150], [7, -7]);
	const rotateY = useTransform(mouseX, [-150, 150], [-7, 7]);

	return (
		<motion.div
			ref={ref}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			style={{ perspective: "1000px", transformStyle: "preserve-3d" }}>
			<motion.div
				style={{ rotateX, rotateY }}
				className="transform-style-3d h-full">
				{children}
			</motion.div>
		</motion.div>
	);
};
