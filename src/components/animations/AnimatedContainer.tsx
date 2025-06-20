
import { motion, MotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedContainerProps extends MotionProps {
  children: ReactNode;
  variant?: 'fadeIn' | 'slideUp' | 'slideRight' | 'scaleIn' | 'stagger';
  delay?: number;
  className?: string;
}

const variants = {
  fadeIn: {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  },
  slideUp: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  },
  slideRight: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  },
  stagger: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
};

export const AnimatedContainer = ({ 
  children, 
  variant = 'fadeIn', 
  delay = 0, 
  className,
  ...motionProps 
}: AnimatedContainerProps) => {
  return (
    <motion.div
      className={className}
      variants={variants[variant]}
      initial="hidden"
      animate="visible"
      transition={{
        duration: 0.3,
        delay,
        ease: 'easeOut'
      }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};
