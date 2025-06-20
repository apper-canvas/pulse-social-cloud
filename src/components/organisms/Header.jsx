import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import ApperIcon from '@/components/ApperIcon';

const Header = ({ onCreatePost }) => {
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';
  
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 bg-gradient-to-r from-surface/90 to-surface/70 backdrop-blur-sm border-b border-gray-700/50 flex items-center px-4 md:px-6 z-40"
    >
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Zap" className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-heading font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden sm:block">
            Pulse
          </h1>
        </div>
        
        {/* Search Bar - Desktop */}
        {!isSearchPage && (
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar placeholder="Search Pulse..." />
          </div>
        )}
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="md"
            icon="Plus"
            onClick={onCreatePost}
            className="hidden sm:inline-flex"
          >
            New Post
          </Button>
          
          <Button
            variant="primary"
            size="md"
            icon="Plus"
            onClick={onCreatePost}
            className="sm:hidden"
          />
          
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <ApperIcon name="Bell" className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;