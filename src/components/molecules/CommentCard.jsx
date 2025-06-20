import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';
import { commentService } from '@/services/api/commentService';

const CommentCard = ({ comment }) => {
  const [localComment, setLocalComment] = useState(comment);
  const [isLiking, setIsLiking] = useState(false);
  
  const handleLike = async (e) => {
    e.stopPropagation();
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      const updatedComment = await commentService.likeComment(localComment.Id);
      setLocalComment(updatedComment);
    } catch (error) {
      toast.error('Failed to like comment');
    } finally {
      setIsLiking(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-surface/30 border border-gray-700/30 rounded-lg p-4"
    >
      <div className="flex items-start gap-3">
        <Avatar 
          src={`https://images.unsplash.com/photo-150${localComment.userId}648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face`}
          alt="User Avatar"
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-white text-sm">
              User {localComment.userId}
            </h4>
            <span className="text-gray-400 text-xs">
              @user{localComment.userId}
            </span>
            <span className="text-gray-400 text-xs">
              {formatDistanceToNow(new Date(localComment.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-gray-200 text-sm leading-relaxed break-words mb-2">
            {localComment.content}
          </p>
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              disabled={isLiking}
              className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors"
            >
              <ApperIcon 
                name="Heart" 
                className={`w-4 h-4 ${isLiking ? 'animate-pulse' : ''}`} 
              />
              <span className="text-xs">{localComment.likes}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              <ApperIcon name="MessageCircle" className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CommentCard;