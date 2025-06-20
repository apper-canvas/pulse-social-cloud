import { useState } from 'react';
import { motion } from 'framer-motion';

const Avatar = ({ 
  src, 
  alt, 
  size = 'md', 
  fallback,
  className = '',
  ...props 
}) => {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl'
  };
  
  const avatarClasses = `${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-semibold text-white ${className}`;
  
  if (imageError || !src) {
    return (
      <motion.div 
        className={avatarClasses}
        whileHover={{ scale: 1.05 }}
        {...props}
      >
        {fallback || alt?.charAt(0)?.toUpperCase() || '?'}
      </motion.div>
    );
  }
  
  return (
    <motion.img
      src={src}
      alt={alt}
      className={`${avatarClasses} object-cover`}
      onError={() => setImageError(true)}
      whileHover={{ scale: 1.05 }}
      {...props}
    />
  );
};

export default Avatar;