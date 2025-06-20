import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import PostCard from '@/components/molecules/PostCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import ApperIcon from '@/components/ApperIcon';
import { userService } from '@/services/api/userService';
import { postService } from '@/services/api/postService';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [postsLoading, setPostsLoading] = useState(false);
  
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const currentUser = await userService.getCurrentUser();
        setUser(currentUser);
        
        // Load user's posts
        setPostsLoading(true);
        const userPosts = await postService.getByUserId(currentUser.Id.toString());
        setPosts(userPosts);
      } catch (err) {
        setError(err.message || 'Failed to load profile');
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
        setPostsLoading(false);
      }
    };
    
    loadProfile();
  }, []);
  
  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <SkeletonLoader count={1} type="post" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <ErrorState 
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <EmptyState
          title="Profile not found"
          description="We couldn't find this profile"
          icon="UserX"
        />
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-primary/30 to-secondary/30 overflow-hidden">
        <img 
          src={user.coverUrl} 
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>
      
      {/* Profile Info */}
      <div className="px-4 md:px-6 pb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 md:-mt-20 mb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="relative">
              <Avatar 
                src={user.avatarUrl}
                alt={user.displayName}
                size="2xl"
                className="border-4 border-background"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-white mb-1">
                {user.displayName}
              </h1>
              <p className="text-gray-400 mb-2">@{user.username}</p>
              <p className="text-gray-300 max-w-md">{user.bio}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button variant="secondary" size="md" icon="MessageSquare">
              Message
            </Button>
            <Button variant="primary" size="md" icon="UserPlus">
              Follow
            </Button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex items-center gap-6 mb-8 text-center md:text-left">
          <div>
            <p className="text-xl font-heading font-bold text-white">{posts.length}</p>
            <p className="text-gray-400 text-sm">Posts</p>
          </div>
          <div>
            <p className="text-xl font-heading font-bold text-white">{user.followers.toLocaleString()}</p>
            <p className="text-gray-400 text-sm">Followers</p>
          </div>
          <div>
            <p className="text-xl font-heading font-bold text-white">{user.following.toLocaleString()}</p>
            <p className="text-gray-400 text-sm">Following</p>
          </div>
        </div>
        
        {/* Posts Section */}
        <div className="border-t border-gray-700 pt-8">
          <h2 className="text-xl font-heading font-semibold text-white mb-6">Posts</h2>
          
          {postsLoading ? (
            <SkeletonLoader count={3} type="post" />
          ) : posts.length === 0 ? (
            <EmptyState
              title="No posts yet"
              description="This user hasn't posted anything yet"
              icon="MessageSquare"
            />
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.Id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;