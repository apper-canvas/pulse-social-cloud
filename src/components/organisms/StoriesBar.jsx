import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { storyService } from '@/services/api/storyService';
import { toast } from 'react-toastify';

const StoriesBar = ({ onCreateStory }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUserId = 1; // In a real app, this would come from auth context

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const data = await storyService.getAll();
      setStories(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch stories:', err);
      setError('Failed to load stories');
      toast.error('Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  const handleStoryClick = async (story) => {
    try {
      if (!storyService.hasViewed(story, currentUserId) && !storyService.isOwner(story, currentUserId)) {
        await storyService.markAsViewed(story.Id, currentUserId);
        // Update local state to reflect view
        setStories(prev => prev.map(s => 
          s.Id === story.Id 
            ? { ...s, viewedBy: [...s.viewedBy, currentUserId] }
            : s
        ));
      }
      // In a real app, this would open a story viewer modal
      toast.info(`Viewing ${story.user.displayName}'s story`);
    } catch (err) {
      console.error('Failed to view story:', err);
      toast.error('Failed to view story');
    }
  };

  const getStoryRingClass = (story) => {
    const isOwner = storyService.isOwner(story, currentUserId);
    const hasViewed = storyService.hasViewed(story, currentUserId);
    
    if (isOwner) {
      return 'ring-2 ring-dashed ring-blue-400';
    } else if (hasViewed) {
      return 'ring-2 ring-gray-300';
    } else {
      return 'ring-2 ring-gradient-to-r ring-pink-500';
    }
  };

  if (loading) {
    return (
      <div className="mb-6">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-shrink-0">
              <div className="w-14 h-14 bg-gray-200 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && stories.length === 0) {
    return (
      <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchStories}
          className="mt-2"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
        {/* Create Story Button */}
        <motion.div
          className="flex-shrink-0 flex flex-col items-center space-y-2"
          whileHover={{ scale: 0.95 }}
          whileTap={{ scale: 0.9 }}
        >
          <button
            onClick={onCreateStory}
            className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
          >
            <ApperIcon name="Plus" size={20} className="text-white" />
          </button>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
            Your Story
          </span>
        </motion.div>

        {/* Stories */}
        {stories.map((story) => (
          <motion.div
            key={story.Id}
            className="flex-shrink-0 flex flex-col items-center space-y-2"
            whileHover={{ scale: 0.95 }}
            whileTap={{ scale: 0.9 }}
          >
            <button
              onClick={() => handleStoryClick(story)}
              className={`relative rounded-full p-0.5 ${getStoryRingClass(story)} bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 transition-all duration-200`}
            >
              <div className="bg-white dark:bg-gray-900 rounded-full p-0.5">
                <Avatar
                  src={story.user.avatarUrl}
                  alt={story.user.displayName}
                  size="story"
                  fallback={story.user.displayName.charAt(0)}
                  className="cursor-pointer"
                />
              </div>
              
              {/* Story indicator dot */}
              {!storyService.hasViewed(story, currentUserId) && !storyService.isOwner(story, currentUserId) && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-900" />
              )}
            </button>
            
            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium truncate max-w-16">
              {storyService.isOwner(story, currentUserId) ? 'You' : story.user.displayName.split(' ')[0]}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Story count indicator */}
      {stories.length > 0 && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {stories.length} active {stories.length === 1 ? 'story' : 'stories'}
        </div>
      )}
    </motion.div>
  );
};

export default StoriesBar;