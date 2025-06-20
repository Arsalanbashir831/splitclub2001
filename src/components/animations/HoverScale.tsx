
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface HoverScaleProps {
  children: ReactNode;
  className?: string;
  scale?: number;
}

export const HoverScale = ({ children, className, scale = 1.05 }: HoverScaleProps) => {
  return (
    <motion.div
      className={className}
      whileHover={{ scale }}
      whileTap={{ scale: scale - 0.02 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};
