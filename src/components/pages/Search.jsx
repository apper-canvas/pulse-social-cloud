import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import SearchBar from '@/components/molecules/SearchBar';
import PostCard from '@/components/molecules/PostCard';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import { userService } from '@/services/api/userService';
import { postService } from '@/services/api/postService';

const Search = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  
  const handleSearch = async (searchQuery) => {
    setQuery(searchQuery);
    setLoading(true);
    setError(null);
    
    try {
      const [usersResult, postsResult] = await Promise.all([
        userService.searchUsers(searchQuery),
        postService.searchPosts(searchQuery)
      ]);
      
      setUsers(usersResult);
      setPosts(postsResult);
    } catch (err) {
      setError(err.message || 'Search failed');
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };
  
  const renderContent = () => {
    if (loading) {
      return <SkeletonLoader count={3} type={activeTab === 'posts' ? 'post' : 'comment'} />;
    }
    
    if (error) {
      return (
        <ErrorState 
          message={error}
          onRetry={() => handleSearch(query)}
        />
      );
    }
    
    if (!query) {
      return (
        <EmptyState
          title="Search Pulse"
          description="Find users, posts, and hashtags from around the community"
          icon="Search"
        />
      );
    }
    
    if (activeTab === 'users') {
      if (users.length === 0) {
        return (
          <EmptyState
            title="No users found"
            description={`No users found for "${query}"`}
            icon="UserX"
          />
        );
      }
      
      return (
        <div className="space-y-4">
          {users.map((user) => (
            <motion.div
              key={user.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface/50 border border-gray-700/50 rounded-xl p-6"
            >
              <div className="flex items-center gap-4">
                <Avatar 
                  src={user.avatarUrl}
                  alt={user.displayName}
                  size="lg"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold text-white text-lg">
                    {user.displayName}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">@{user.username}</p>
                  <p className="text-gray-300 text-sm line-clamp-2">
                    {user.bio}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                    <span>{user.followers} followers</span>
                    <span>{user.following} following</span>
                  </div>
                </div>
                <Button variant="primary" size="sm">
                  Follow
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      );
    }
    
    if (posts.length === 0) {
      return (
        <EmptyState
          title="No posts found"
          description={`No posts found for "${query}"`}
          icon="FileText"
        />
      );
    }
    
    return (
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.Id} post={post} />
        ))}
      </div>
    );
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-4 md:p-6 max-w-4xl mx-auto"
    >
      {/* Search Header */}
      <div className="mb-6">
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search users, posts, and hashtags..."
        />
      </div>
      
      {query && (
        <>
          {/* Tabs */}
          <div className="flex items-center gap-1 mb-6 bg-surface/30 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'posts'
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Posts ({posts.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'users'
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Users ({users.length})
            </button>
          </div>
        </>
      )}
      
      {/* Content */}
      {renderContent()}
    </motion.div>
  );
};

export default Search;