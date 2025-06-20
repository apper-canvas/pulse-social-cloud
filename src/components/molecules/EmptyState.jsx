import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const EmptyState = ({ 
  title, 
  description, 
  actionLabel, 
  onAction, 
  icon = 'Package',
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`text-center py-16 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="mb-6"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name={icon} className="w-10 h-10 text-gray-400" />
        </div>
      </motion.div>
      
      <h3 className="text-xl font-heading font-semibold text-white mb-2">
        {title}
      </h3>
      
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          size="lg"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;