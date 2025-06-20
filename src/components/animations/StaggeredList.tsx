
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StaggeredListProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const StaggeredList = ({ children, className, staggerDelay = 0.1 }: StaggeredListProps) => {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
};

export const StaggeredItem = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <motion.div
      className={className}
      variants={itemVariants}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};
