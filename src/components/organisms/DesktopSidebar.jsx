import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const DesktopSidebar = () => {
  const navItems = [
    { to: '/', icon: 'Home', label: 'Home' },
    { to: '/search', icon: 'Search', label: 'Search' },
    { to: '/notifications', icon: 'Bell', label: 'Notifications' },
    { to: '/profile', icon: 'User', label: 'Profile' }
  ];
  
  return (
    <aside className="hidden md:block w-64 bg-surface/30 border-r border-gray-700/50 overflow-y-auto">
      <nav className="p-6">
        <div className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative
                ${isActive 
                  ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-white border border-primary/30' 
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
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="desktop-nav-indicator"
                      className="absolute right-2 w-2 h-2 bg-primary rounded-full"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default DesktopSidebar;