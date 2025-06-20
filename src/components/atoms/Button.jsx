import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  icon, 
  iconPosition = 'left',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 focus:ring-primary/50',
    secondary: 'bg-surface text-white border border-gray-600 hover:bg-surface/80 focus:ring-gray-500/50',
    ghost: 'text-gray-300 hover:text-white hover:bg-white/10 focus:ring-gray-500/50',
    danger: 'bg-error text-white hover:bg-error/90 focus:ring-error/50'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;
  
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <ApperIcon name="Loader2" className="w-4 h-4 animate-spin mr-2" />}
      {icon && iconPosition === 'left' && !loading && (
        <ApperIcon name={icon} className="w-4 h-4 mr-2" />
      )}
      {children}
      {icon && iconPosition === 'right' && !loading && (
        <ApperIcon name={icon} className="w-4 h-4 ml-2" />
      )}
    </motion.button>
  );
};

export default Button;