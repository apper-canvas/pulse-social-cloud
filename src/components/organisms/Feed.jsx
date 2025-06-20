import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PostCard from '@/components/molecules/PostCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import ApperIcon from '@/components/ApperIcon';
import { postService } from '@/services/api/postService';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const loadPosts = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      const result = await postService.getAll();
      setPosts(result);
    } catch (err) {
      setError(err.message || 'Failed to load posts');
      if (!isRefresh) {
        toast.error('Failed to load posts');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    loadPosts();
  }, []);
  
  const handleRefresh = () => {
    loadPosts(true);
  };
  
  if (loading) {
    return <SkeletonLoader count={3} type="post" />;
  }
  
  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={() => loadPosts()}
      />
    );
  }
  
  if (posts.length === 0) {
    return (
      <EmptyState
        title="No posts yet"
        description="Be the first to share something amazing with the community!"
        actionLabel="Create Your First Post"
        onAction={() => {/* This would open the create post modal */}}
        icon="MessageSquare"
      />
    );
  }
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      {/* Pull to Refresh Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-heading font-bold text-white">Home Feed</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white transition-colors"
        >
          <ApperIcon 
            name="RefreshCw" 
            className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} 
          />
          <span className="text-sm">Refresh</span>
        </motion.button>
      </div>
      
      {/* Posts */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {posts.map((post) => (
          <motion.div key={post.Id} variants={staggerItem}>
            <PostCard post={post} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Feed;