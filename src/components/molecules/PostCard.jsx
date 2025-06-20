import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { postService } from '@/services/api/postService';

const PostCard = ({ post, showActions = true }) => {
  const navigate = useNavigate();
  const [localPost, setLocalPost] = useState(post);
  const [isLiking, setIsLiking] = useState(false);
  
  const handleLike = async (e) => {
    e.stopPropagation();
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      const updatedPost = await postService.likePost(localPost.Id);
      setLocalPost(updatedPost);
    } catch (error) {
      toast.error('Failed to like post');
    } finally {
      setIsLiking(false);
    }
  };
  
  const handleComment = (e) => {
    e.stopPropagation();
    navigate(`/post/${localPost.Id}`);
  };
  
  const handleCardClick = () => {
    navigate(`/post/${localPost.Id}`);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-primary/30"
      onClick={handleCardClick}
    >
      {/* Post Header */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar 
          src={`https://images.unsplash.com/photo-150${localPost.userId}648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face`}
          alt="User Avatar"
          size="md"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-semibold text-white truncate">
              User {localPost.userId}
            </h3>
            <span className="text-gray-400 text-sm">
              @user{localPost.userId}
            </span>
          </div>
          <p className="text-gray-400 text-sm">
            {formatDistanceToNow(new Date(localPost.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>
      
      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-100 leading-relaxed break-words">
          {localPost.content}
        </p>
        
        {/* Post Image */}
        {localPost.imageUrl && (
          <div className="mt-4 rounded-lg overflow-hidden">
            <img 
              src={localPost.imageUrl} 
              alt="Post content"
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>
        )}
        
        {/* Hashtags */}
        {localPost.hashtags && localPost.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {localPost.hashtags.map((tag, index) => (
              <span 
                key={index}
                className="text-primary text-sm hover:text-secondary cursor-pointer transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Post Actions */}
      {showActions && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
          <div className="flex items-center gap-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              disabled={isLiking}
              className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors"
            >
              <ApperIcon 
                name="Heart" 
                className={`w-5 h-5 ${isLiking ? 'animate-pulse' : ''}`} 
              />
              <span className="text-sm">{localPost.likes}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleComment}
              className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
            >
              <ApperIcon name="MessageCircle" className="w-5 h-5" />
              <span className="text-sm">{localPost.comments}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors"
            >
              <ApperIcon name="Share" className="w-5 h-5" />
            </motion.button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-400 hover:text-accent transition-colors"
          >
            <ApperIcon name="Bookmark" className="w-5 h-5" />
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default PostCard;