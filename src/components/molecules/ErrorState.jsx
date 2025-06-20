import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ErrorState = ({ 
  message = 'Something went wrong', 
  onRetry, 
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`text-center py-16 ${className}`}
    >
      <div className="w-20 h-20 bg-gradient-to-br from-error/20 to-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <ApperIcon name="AlertCircle" className="w-10 h-10 text-error" />
      </div>
      
      <h3 className="text-xl font-heading font-semibold text-white mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        {message}
      </p>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="secondary"
          icon="RefreshCw"
        >
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorState;