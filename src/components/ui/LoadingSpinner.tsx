
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12'
};

export const LoadingSpinner = ({ size = 'md', text, className }: LoadingSpinnerProps) => {
  return (
    <motion.div
      className={`flex items-center justify-center ${className || ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 className={`${sizeClasses[size]} text-primary`} />
      </motion.div>
      {text && (
        <motion.span 
          className="ml-2 text-muted-foreground"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {text}
        </motion.span>
      )}
    </motion.div>
  );
};
