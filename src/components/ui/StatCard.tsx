
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconColor?: string;
  delay?: number;
}

export const StatCard = ({ icon: Icon, label, value, iconColor, delay = 0 }: StatCardProps) => {
  return (
    <motion.div
      className="flex items-center space-x-2 bg-card px-4 py-2 rounded-lg border"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
    >
      <Icon className={`h-4 w-4 ${iconColor || 'text-primary'}`} />
      <span className="font-medium">{value} {label}</span>
    </motion.div>
  );
};
