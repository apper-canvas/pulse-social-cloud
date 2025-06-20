import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const MobileNavigation = () => {
  const navItems = [
    { to: '/', icon: 'Home', label: 'Home' },
    { to: '/search', icon: 'Search', label: 'Search' },
    { to: '/notifications', icon: 'Bell', label: 'Notifications' },
    { to: '/profile', icon: 'User', label: 'Profile' }
  ];
  
  return (
    <motion.nav
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="md:hidden bg-surface/90 backdrop-blur-sm border-t border-gray-700/50 px-4 py-2"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200
              ${isActive 
                ? 'text-primary bg-primary/10' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ApperIcon name={item.icon} className="w-5 h-5" />
                </motion.div>
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </motion.nav>
  );
};

export default MobileNavigation;