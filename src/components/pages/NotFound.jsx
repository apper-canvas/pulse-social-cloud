import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center min-h-[60vh] p-4"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name="Search" className="w-12 h-12 text-gray-400" />
          </div>
        </motion.div>
        
        <h1 className="text-6xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-heading font-semibold text-white mb-2">
          Page Not Found
        </h2>
        
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved to a different location.
        </p>
        
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="primary"
            icon="Home"
            onClick={() => navigate('/')}
          >
            Go Home
          </Button>
          
          <Button
            variant="ghost"
            icon="ArrowLeft"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFound;