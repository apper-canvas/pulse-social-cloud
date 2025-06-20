import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';
import { userService } from '@/services/api/userService';
import { postService } from '@/services/api/postService';

const SearchBar = ({ onSearch, placeholder = "Search users and posts..." }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (query.trim().length > 0) {
        setIsSearching(true);
        try {
          const [users, posts] = await Promise.all([
            userService.searchUsers(query),
            postService.searchPosts(query)
          ]);
          
          const userSuggestions = users.slice(0, 3).map(user => ({
            type: 'user',
            data: user
          }));
          
          const postSuggestions = posts.slice(0, 2).map(post => ({
            type: 'post',
            data: post
          }));
          
          setSuggestions([...userSuggestions, ...postSuggestions]);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    
    return () => clearTimeout(searchTimer);
  }, [query]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query.trim());
      setShowSuggestions(false);
    }
  };
  
  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'user') {
      // Navigate to user profile
      setQuery(suggestion.data.username);
    } else {
      // Navigate to post
      setQuery(suggestion.data.content.substring(0, 50));
    }
    setShowSuggestions(false);
    onSearch?.(query.trim());
  };
  
  return (
    <div className="relative">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            icon="Search"
            className="pl-11 pr-4"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <ApperIcon name="Loader2" className="w-4 h-4 animate-spin text-gray-400" />
            </div>
          )}
        </div>
      </form>
      
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-surface border border-gray-600 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                className="p-3 cursor-pointer border-b border-gray-700 last:border-b-0"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.type === 'user' ? (
                  <div className="flex items-center gap-3">
                    <Avatar 
                      src={suggestion.data.avatarUrl}
                      alt={suggestion.data.displayName}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm truncate">
                        {suggestion.data.displayName}
                      </p>
                      <p className="text-gray-400 text-xs truncate">
                        @{suggestion.data.username}
                      </p>
                    </div>
                    <ApperIcon name="User" className="w-4 h-4 text-gray-400" />
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <ApperIcon name="FileText" className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-200 text-sm line-clamp-2">
                        {suggestion.data.content}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {suggestion.data.likes} likes • {suggestion.data.comments} comments
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;